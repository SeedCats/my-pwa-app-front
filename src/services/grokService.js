// Grok AI Service - Backend API Proxy
import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_URL = import.meta.env.VITE_API_URL || ''

// Helper function to handle streaming response
const handleStreamingResponse = async (response, onChunk) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''
    const toolCalls = []
    const sources = []
    let buffer = '' // Buffer for incomplete lines

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk
        const lines = buffer.split('\n')
        
        // Keep the last line in buffer if it doesn't end with newline
        buffer = lines.pop() || ''

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const jsonStr = line.slice(6).trim()
                    if (!jsonStr) continue // Skip empty data lines
                    
                    const data = JSON.parse(jsonStr)
                    
                    if (data.type === 'tool-call') {
                        toolCalls.push({ toolName: data.toolName, args: data.args })
                        if (onChunk) onChunk({ type: 'tool-call', toolName: data.toolName, args: data.args })
                    } else if (data.type === 'text-delta') {
                        fullResponse += data.text
                        if (onChunk) onChunk({ type: 'text-delta', text: data.text })
                    } else if (data.type === 'source') {
                        sources.push({ url: data.url, title: data.title || data.url })
                        if (onChunk) onChunk({ type: 'source', url: data.url, title: data.title })
                    } else if (data.type === 'done') {
                        // Handle final metadata from 'done' event - prefer message from done if fullResponse is empty
                        if (data.message && !fullResponse) {
                            fullResponse = data.message
                        }
                        if (data.sources && Array.isArray(data.sources)) {
                            data.sources.forEach(src => {
                                if (!sources.find(s => s.url === src.url)) {
                                    sources.push({ url: src.url, title: src.title || src.url })
                                }
                            })
                        }
                        if (data.toolCalls && Array.isArray(data.toolCalls)) {
                            data.toolCalls.forEach(tc => {
                                if (!toolCalls.find(t => t.toolName === tc.toolName)) {
                                    toolCalls.push(tc)
                                }
                            })
                        }
                    }
                } catch (e) {
                    // Skip logging for very long lines that are likely truncated
                    if (line.length < 1000) {
                        console.warn('Failed to parse SSE data:', line.substring(0, 200), e)
                    }
                }
            }
        }
    }

    return { 
        success: true, 
        message: fullResponse || 'No response from Grok', 
        toolCalls, 
        sources,
        hasTools: toolCalls.length > 0 
    }
}

// Helper function to process response (streaming or non-streaming)
const processGrokResponse = async (response, onChunk) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(errorData.message || 'Failed to get response from Grok')
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/event-stream')) {
        return await handleStreamingResponse(response, onChunk)
    } else {
        const data = await response.json()
        return { 
            success: true, 
            message: data.data?.message || data.message || '', 
            toolCalls: data.data?.toolCalls || data.toolCalls || [], 
            sources: data.data?.sources || data.sources || [],
            hasTools: (data.data?.toolCalls || data.toolCalls || []).length > 0 
        }
    }
}

export const sendMessageToGrok = async (message, conversationHistory = [], onChunk, options = {}) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/api/grok/chat`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream, application/json'
            },
            body: JSON.stringify({ 
                message,
                conversationHistory: conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
                options 
            })
        })

        return await processGrokResponse(response, onChunk)
    } catch (error) {
        console.error('Grok API error:', error)
        throw new Error(error.message || 'Failed to get response from Grok')
    }
}

// Send a message with an attached file
export const sendMessageToGrokWithFile = async (file, message, conversationHistory = [], onChunk, options = {}) => {
    try {
        let fileData = null
        
        // Read and encode file content if provided
        if (file) {
            const fileContent = await readFileContent(file)
            fileData = {
                name: file.name,
                content: btoa(fileContent) // base64 encode
            }
        }

        const response = await fetchWithAuth(`${API_URL}/api/grok/chat`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream, application/json'
            },
            body: JSON.stringify({
                message,
                conversationHistory: conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
                options,
                file: fileData
            })
        })

        return await processGrokResponse(response, onChunk)
    } catch (error) {
        console.error('Grok API error:', error)
        throw new Error(error.message || 'Failed to get response from Grok')
    }
}

// Helper function to read file content
const readFileContent = async (file) => {
    const MAX_CHARS = 200000
    
    try {
        let content = ''
        
        if (typeof file.text === 'function') {
            content = await file.text()
        } else {
            content = await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsText(file)
            })
        }

        return content.length > MAX_CHARS 
            ? content.slice(0, MAX_CHARS) + '\n\n...[truncated]'
            : content
    } catch (e) {
        console.warn('Failed to read file content:', e)
        return '[File could not be read]'
    }
}

// Chat management API calls

export const fetchAichatList = async (page = 1, limit = 20) => {
    try {
        const res = await fetchWithAuth(`${API_URL}/api/ai/chat?page=${page}&limit=${limit}`, { credentials: 'include' })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }))
            throw new Error(err.message || 'Failed to fetch chat list')
        }
        return await res.json()
    } catch (error) {
        console.error('Fetch AI chat list error:', error)
        throw error
    }
}

export const fetchAichatById = async (id) => {
    try {
        const res = await fetchWithAuth(`${API_URL}/api/ai/chat/${id}`, { credentials: 'include' })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }))
            throw new Error(err.message || 'Failed to fetch chat')
        }
        return await res.json()
    } catch (error) {
        console.error('Fetch AI chat by id error:', error)
        throw error
    }
}

export const createAichat = async (title = 'New Conversation', messages = []) => {
    try {
        const res = await fetchWithAuth(`${API_URL}/api/ai/chat`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, messages })
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }))
            throw new Error(err.message || 'Failed to create chat')
        }
        return await res.json()
    } catch (error) {
        console.error('Create AI chat error:', error)
        throw error
    }
}

export const appendMessagesToAichat = async (id, messages = []) => {
    try {
        const res = await fetchWithAuth(`${API_URL}/api/ai/chat/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages, append: true })
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }))
            throw new Error(err.message || 'Failed to append messages')
        }
        return await res.json()
    } catch (error) {
        console.error('Append messages to AI chat error:', error)
        throw error
    }
}

export const deleteAichat = async (id) => {
    try {
        const res = await fetchWithAuth(`${API_URL}/api/ai/chat/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }))
            throw new Error(err.message || 'Failed to delete chat')
        }
        return await res.json()
    } catch (error) {
        console.error('Delete AI chat error:', error)
        throw error
    }
}

export const updateAichatTitle = async (id, title) => {
    try {
        const res = await fetchWithAuth(`${API_URL}/api/ai/chat/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }))
            throw new Error(err.message || 'Failed to update chat')
        }
        return await res.json()
    } catch (error) {
        console.error('Update AI chat title error:', error)
        throw error
    }
}

export const updateAichatLastMessage = async (id, lastMessage = null) => {
    if (!id) return { success: false, message: 'Missing chat id' }
    if (!lastMessage) return { success: false, message: 'Nothing to update' }

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

            // Retry with sanitized content on 400 errors
            if (res.status === 400 && msgObj.content) {
                const retryResult = await retryWithSanitizedContent(id, msgObj)
                if (retryResult) return retryResult
                result.retry = retryResult
            }

            return result
        }

        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        console.error('Update AI chat lastMessage error:', error)
        return { success: false, message: error.message || 'Failed to update chat lastMessage' }
    }
}

// Helper function to normalize message object
const normalizeMessage = (lastMessage) => {
    if (typeof lastMessage === 'string') {
        const content = lastMessage.trim()
        return content ? { 
            role: 'assistant', 
            content, 
            timestamp: new Date().toISOString() 
        } : null
    }
    
    if (typeof lastMessage === 'object') {
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
    try {
        raw = await res.json()
    } catch (e) {
        try {
            raw = await res.text()
        } catch (e2) {
            raw = res.statusText
        }
    }
    
    const message = (raw && raw.message) 
        ? raw.message 
        : (typeof raw === 'string' ? raw : (res.statusText || 'Failed to update chat lastMessage'))
    
    return { message, raw }
}

// Helper function to retry with sanitized content
const retryWithSanitizedContent = async (id, msgObj) => {
    try {
        const sanitize = (s) => s.toString().replace(/[\u0000-\u001F\u007F]/g, '').trim()
        const short = sanitize(msgObj.content).slice(0, 1000)
        
        if (!short || short === msgObj.content) return null
        
        const retryRes = await fetchWithAuth(`${API_URL}/api/ai/chat/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ ...msgObj, content: short }], append: true })
        })
        
        if (retryRes.ok) {
            const data = await retryRes.json()
            return { success: true, data, retried: true }
        }
        
        const rb = await parseErrorResponse(retryRes)
        return { status: retryRes.status, body: rb.raw }
    } catch (err) {
        console.warn('Retry updateAichatLastMessage failed:', err)
        return null
    }
}


