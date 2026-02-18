// Grok AI Service - Backend API Proxy
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { apiRequest } from './apiClient'

const API_URL = import.meta.env.VITE_API_URL || ''

// Helper function to handle streaming response
const handleStreamingResponse = async (response, onChunk) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = '', buffer = ''
    const toolCalls = [], sources = []

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
                const jsonStr = line.slice(6).trim()
                if (!jsonStr) continue
                const data = JSON.parse(jsonStr)

                if (data.type === 'tool-call') {
                    toolCalls.push({ toolName: data.toolName, args: data.args })
                    onChunk?.({ type: 'tool-call', toolName: data.toolName, args: data.args })
                } else if (data.type === 'text-delta') {
                    fullResponse += data.text
                    onChunk?.({ type: 'text-delta', text: data.text })
                } else if (data.type === 'source') {
                    sources.push({ url: data.url, title: data.title || data.url })
                    onChunk?.({ type: 'source', url: data.url, title: data.title })
                } else if (data.type === 'done') {
                    if (data.message && !fullResponse) fullResponse = data.message
                    data.sources?.forEach(src => { if (!sources.find(s => s.url === src.url)) sources.push({ url: src.url, title: src.title || src.url }) })
                    data.toolCalls?.forEach(tc => { if (!toolCalls.find(t => t.toolName === tc.toolName)) toolCalls.push(tc) })
                }
            } catch (e) {
                if (line.length < 1000) console.warn('Failed to parse SSE data:', line.substring(0, 200), e)
            }
        }
    }

    return { success: true, message: fullResponse || 'No response from Grok', toolCalls, sources, hasTools: toolCalls.length > 0 }
}

// Helper function to process response (streaming or non-streaming)
const processGrokResponse = async (response, onChunk) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(errorData.message || 'Failed to get response from Grok')
    }

    if (response.headers.get('content-type')?.includes('text/event-stream'))
        return handleStreamingResponse(response, onChunk)

    const data = await response.json()
    const toolCalls = data.data?.toolCalls || data.toolCalls || []
    return {
        success: true,
        message: data.data?.message || data.message || '',
        toolCalls,
        sources: data.data?.sources || data.sources || [],
        hasTools: toolCalls.length > 0
    }
}

const GROK_FETCH_OPTS = {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream, application/json' }
}

export const sendMessageToGrok = async (message, conversationHistory = [], onChunk, options = {}) => {
    const response = await fetchWithAuth(`${API_URL}/api/grok/chat`, {
        ...GROK_FETCH_OPTS,
        body: JSON.stringify({ message, conversationHistory: conversationHistory.map(({ role, content }) => ({ role, content })), options })
    })
    return processGrokResponse(response, onChunk)
}

// Send a message with an attached file
export const sendMessageToGrokWithFile = async (file, message, conversationHistory = [], onChunk, options = {}) => {
    const fileData = file ? {
        name: file.name,
        content: btoa(await readFileContent(file))
    } : null

    const response = await fetchWithAuth(`${API_URL}/api/grok/chat`, {
        ...GROK_FETCH_OPTS,
        body: JSON.stringify({ message, conversationHistory: conversationHistory.map(({ role, content }) => ({ role, content })), options, file: fileData })
    })
    return processGrokResponse(response, onChunk)
}

// Helper function to read file content
const readFileContent = async (file) => {
    const MAX_CHARS = 200000
    try {
        const content = typeof file.text === 'function'
            ? await file.text()
            : await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsText(file)
            })
        return content.length > MAX_CHARS ? content.slice(0, MAX_CHARS) + '\n\n...[truncated]' : content
    } catch (e) {
        console.warn('Failed to read file content:', e)
        return '[File could not be read]'
    }
}

// Chat management API calls

export const fetchAichatList = async (page = 1, limit = 20) => apiRequest('/api/ai/chat', { query: { page, limit } })
export const fetchAichatById = async (id) => apiRequest(`/api/ai/chat/${id}`)
export const createAichat = async (title = 'New Conversation', messages = []) => apiRequest('/api/ai/chat', { method: 'POST', body: { title, messages } })
export const appendMessagesToAichat = async (id, messages = []) => apiRequest(`/api/ai/chat/${id}`, { method: 'PUT', body: { messages, append: true } })
export const deleteAichat = async (id) => apiRequest(`/api/ai/chat/${id}`, { method: 'DELETE' })
export const updateAichatTitle = async (id, title) => apiRequest(`/api/ai/chat/${id}`, { method: 'PUT', body: { title } })

export const updateAichatLastMessage = async (id, lastMessage = null) => {
    if (!id) return { success: false, message: 'Missing chat id' }
    const msgObj = normalizeMessage(lastMessage)
    if (!msgObj) return { success: false, message: 'Nothing to update' }

    try {
        const res = await fetchWithAuth(`${API_URL}/api/ai/chat/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [msgObj], append: true })
        })

        if (!res.ok) {
            const errBody = await parseErrorResponse(res)
            const result = { success: false, status: res.status, message: errBody.message, body: errBody.raw }
            if (res.status === 400 && msgObj.content) result.retry = await retryWithSanitizedContent(id, msgObj)
            return result
        }

        return { success: true, data: await res.json() }
    } catch (error) {
        return { success: false, message: error.message || 'Failed to update chat lastMessage' }
    }
}

// Helper function to normalize message object
const normalizeMessage = (lastMessage) => {
    if (typeof lastMessage === 'string') {
        const content = lastMessage.trim()
        return content ? { role: 'assistant', content, timestamp: new Date().toISOString() } : null
    }
    if (typeof lastMessage === 'object' && lastMessage) {
        const content = (lastMessage.content || lastMessage.text || '').toString().trim()
        if (!content) return null
        return {
            role: lastMessage.role || 'assistant',
            content,
            timestamp: lastMessage.timestamp instanceof Date
                ? lastMessage.timestamp.toISOString()
                : new Date(lastMessage.timestamp || Date.now()).toISOString()
        }
    }
    return null
}

// Helper function to parse error response
const parseErrorResponse = async (res) => {
    let raw
    try { raw = await res.json() } catch { try { raw = await res.text() } catch { raw = res.statusText } }
    const message = raw?.message || (typeof raw === 'string' ? raw : res.statusText || 'Failed to update chat lastMessage')
    return { message, raw }
}

// Helper function to retry with sanitized content
const retryWithSanitizedContent = async (id, msgObj) => {
    try {
        const sanitize = (s) => s.toString().replace(/[\u0000-\u001F\u007F]/g, '').trim()
        const short = sanitize(msgObj.content).slice(0, 1000)
        if (!short || short === msgObj.content) return null

        const retryRes = await fetchWithAuth(`${API_URL}/api/ai/chat/${id}`, {
            method: 'PUT', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ ...msgObj, content: short }], append: true })
        })
        if (retryRes.ok) return { success: true, data: await retryRes.json(), retried: true }
        return { status: retryRes.status, body: (await parseErrorResponse(retryRes)).raw }
    } catch (err) {
        console.warn('Retry updateAichatLastMessage failed:', err)
        return null
    }
}


