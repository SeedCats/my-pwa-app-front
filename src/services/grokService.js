// Grok AI Service - lazy-load xAI/ai SDKs to avoid browser import-time failures

const API_KEY = import.meta.env.VITE_GROK_API_KEY
const MODEL_NAME = import.meta.env.VITE_GROK_MODEL

export const sendMessageToGrok = async (message, conversationHistory = [], onChunk, options = {}) => {
    if (!API_KEY) {
        throw new Error('Grok API key not configured. Please add VITE_GROK_API_KEY to your .env file.')
    }

    // Lazy import heavy/server-only SDKs when actually sending a message
    let createXai, streamText
    try {
        const xaiModule = await import('@ai-sdk/xai')
        createXai = xaiModule.createXai
        const aiModule = await import('ai')
        streamText = aiModule.streamText
    } catch (e) {
        console.error('Failed to load Grok SDKs in browser:', e)
        throw new Error('Grok SDK unavailable in this environment')
    }

    try {
        const messages = [
            {
                role: 'system',
                content: 'You are Grok, a helpful and maximally truthful AI built by xAI. You are not based on any other companies and their models. You are designed to be helpful, truthful, and witty. Keep your responses concise but informative.'
            },
            ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: message }
        ]

        console.log('Sending message to Grok:', { message, messagesCount: messages.length, model: MODEL_NAME })

        const xaiProvider = createXai({ apiKey: API_KEY })

        const { fullStream } = await streamText({
            model: xaiProvider.responses(MODEL_NAME),
            messages: messages,
            tools: {
                web_search: xaiProvider.tools.webSearch(),
                x_search: xaiProvider.tools.xSearch(),
                code_execution: xaiProvider.tools.codeExecution(),
            },
            maxToolRoundtrips: 3,
            ...options
        })

        let fullResponse = ''
        const toolCalls = []

        for await (const part of fullStream) {
            console.log('Received stream part:', part.type, part)
            if (part.type === 'tool-call') {
                toolCalls.push({ toolName: part.toolName, args: part.args })
                if (onChunk) onChunk({ type: 'tool-call', toolName: part.toolName, args: part.args })
            } else if (part.type === 'text-delta') {
                fullResponse += part.text
                if (onChunk) onChunk({ type: 'text-delta', text: part.text })
            } else if (part.type === 'source' && part.sourceType === 'url') {
                if (onChunk) onChunk({ type: 'source', url: part.url })
            }
        }

        return { success: true, message: fullResponse || 'No response from Grok', toolCalls, hasTools: toolCalls.length > 0 }
    } catch (error) {
        console.error('Grok API error:', error)
        throw new Error(error.message || 'Failed to get response from Grok')
    }
}

// Send a message with an attached file (file should be a File/Blob from input)
export const sendMessageToGrokWithFile = async (file, message, conversationHistory = [], onChunk, options = {}) => {
    if (!API_KEY) {
        throw new Error('Grok API key not configured. Please add VITE_GROK_API_KEY to your .env file.')
    }

    // Lazy import SDKs
    let createXai, streamText
    try {
        const xaiModule = await import('@ai-sdk/xai')
        createXai = xaiModule.createXai
        const aiModule = await import('ai')
        streamText = aiModule.streamText
    } catch (e) {
        console.error('Failed to load Grok SDKs in browser:', e)
        throw new Error('Grok SDK unavailable in this environment')
    }

    try {
        let fileContent = ''
        let fileMeta = ''
        if (file) {
            try {
                // Use File.text() when available
                if (typeof file.text === 'function') {
                    fileContent = await file.text()
                } else {
                    // Fallback to FileReader
                    fileContent = await new Promise((res, rej) => {
                        const reader = new FileReader()
                        reader.onload = () => res(reader.result)
                        reader.onerror = rej
                        reader.readAsText(file)
                    })
                }

                // Trim very large files to first 200k chars to avoid sending huge payloads
                const MAX_CHARS = 200000
                if (fileContent && fileContent.length > MAX_CHARS) {
                    fileContent = fileContent.slice(0, MAX_CHARS) + '\n\n...[truncated]'
                }
                fileMeta = `Attached file: ${file.name || 'unknown'} (type: ${file.type || 'unknown'})` + '\n'
            } catch (e) {
                console.warn('Failed to read attached file, sending message without file content', e)
                fileContent = ''
                fileMeta = `Attached file: ${file.name || 'unknown'} (could not read content)` + '\n'
            }
        }

        const messages = [
            {
                role: 'system',
                content: 'You are Grok, a helpful and maximally truthful AI built by xAI. You are not based on any other companies and their models. You are designed to be helpful, truthful, and witty. Keep your responses concise but informative.'
            },
            ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content }))
        ]

        // If a file was provided, attach its content as a user message prefixed with metadata.
        if (file) {
            messages.push({ role: 'user', content: fileMeta + '\n' + fileContent })
        }

        // Finally add the user's query
        messages.push({ role: 'user', content: message })

        console.log('Sending message to Grok with file:', { message, file: file && file.name, messagesCount: messages.length, model: MODEL_NAME, options })

        const xaiProvider = createXai({ apiKey: API_KEY })

        // Normalize option keys for common naming variants so downstream SDKs accept them
        const normalizeOptions = (opts = {}) => {
            const out = { ...opts }
            // map common camelCase to snake_case commonly used by SDKs
            if (opts.maxSources != null) out.max_sources = Number(opts.maxSources)
            if (opts.max_sources != null) out.max_sources = Number(opts.max_sources)
            if (opts.maxTokens != null) out.max_tokens = Number(opts.maxTokens)
            if (opts.max_tokens != null) out.max_tokens = Number(opts.max_tokens)
            if (opts.topP != null) out.top_p = Number(opts.topP)
            if (opts.top_p != null) out.top_p = Number(opts.top_p)
            if (opts.temperature != null) out.temperature = Number(opts.temperature)
            return out
        }

        const sdkOptions = normalizeOptions(options)
        console.log('Normalized SDK options for streamText:', sdkOptions)

        // Pass options through to streamText so model parameters (temperature, top_p, max_tokens, max_sources etc.) are applied when supported by the SDK
        const { fullStream } = await streamText({
            model: xaiProvider.responses(MODEL_NAME),
            messages: messages,
            tools: {
                web_search: xaiProvider.tools.webSearch(),
                x_search: xaiProvider.tools.xSearch(),
                code_execution: xaiProvider.tools.codeExecution(),
            },
            maxToolRoundtrips: 3,
            ...sdkOptions
        })

        let fullResponse = ''
        const toolCalls = []

        for await (const part of fullStream) {
            console.log('Received stream part:', part.type, part)
            if (part.type === 'tool-call') {
                toolCalls.push({ toolName: part.toolName, args: part.args })
                if (onChunk) onChunk({ type: 'tool-call', toolName: part.toolName, args: part.args })
            } else if (part.type === 'text-delta') {
                fullResponse += part.text
                if (onChunk) onChunk({ type: 'text-delta', text: part.text })
            } else if (part.type === 'source' && part.sourceType === 'url') {
                if (onChunk) onChunk({ type: 'source', url: part.url })
            }
        }

        return { success: true, message: fullResponse || 'No response from Grok', toolCalls, hasTools: toolCalls.length > 0 }
    } catch (error) {
        console.error('Grok API error:', error)
        throw new Error(error.message || 'Failed to get response from Grok')
    }
}

// Fetch paginated list of AI chats for the authenticated user
export const fetchAichatList = async (page = 1, limit = 20) => {
    try {
        const res = await fetch(`/api/ai/chat?page=${page}&limit=${limit}`, { credentials: 'include' })
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

// Fetch a single chat (including messages) by id
export const fetchAichatById = async (id) => {
    try {
        const res = await fetch(`/api/ai/chat/${id}`, { credentials: 'include' })
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

// Create a new AI chat on the server
export const createAichat = async (title = 'New Conversation', messages = []) => {
    try {
        const res = await fetch('/api/ai/chat', {
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

// Append messages to an existing chat (PUT with append:true)
export const appendMessagesToAichat = async (id, messages = []) => {
    try {
        const res = await fetch(`/api/ai/chat/${id}`, {
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

// Delete a single AI chat by id
export const deleteAichat = async (id) => {
    try {
        const res = await fetch(`/api/ai/chat/${id}`, {
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

// Update chat metadata (e.g., title)
export const updateAichatTitle = async (id, title) => {
    try {
        const res = await fetch(`/api/ai/chat/${id}`, {
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

// Update the last message for a chat by appending the message using the server's append API
// The server expects { messages: [ ... ], append: true } or title field for updates.
export const updateAichatLastMessage = async (id, lastMessage = null) => {
    // Validate and normalize payload; return early if nothing to update (don't throw)
    if (!id) return { success: false, message: 'Missing chat id' }
    if (!lastMessage) return { success: false, message: 'Nothing to update' }

    // Build a messages array suitable for append
    let msgObj = null
    if (typeof lastMessage === 'string') {
        if (!lastMessage.trim()) return { success: false, message: 'Nothing to update' }
        msgObj = { role: 'assistant', content: lastMessage.trim(), timestamp: new Date().toISOString() }
    } else if (typeof lastMessage === 'object') {
        const content = (lastMessage.content || lastMessage.text || '').toString().trim()
        if (!content) return { success: false, message: 'Nothing to update' }
        msgObj = {
            role: lastMessage.role || 'assistant',
            content,
            timestamp: (lastMessage.timestamp instanceof Date) ? lastMessage.timestamp.toISOString() : new Date(lastMessage.timestamp).toISOString()
        }
    } else {
        return { success: false, message: 'Nothing to update' }
    }

    const body = { messages: [msgObj], append: true }

    try {
        const res = await fetch(`/api/ai/chat/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (!res.ok) {
            // try to parse JSON error body, otherwise text
            let errBody
            try { errBody = await res.json() } catch (e) { try { errBody = await res.text() } catch (e2) { errBody = res.statusText } }
            const msg = (errBody && errBody.message) ? errBody.message : (typeof errBody === 'string' ? errBody : (res.statusText || 'Failed to update chat lastMessage'))
            const result = { success: false, status: res.status, message: msg, body: errBody }

            // If Bad Request, attempt a sanitized retry with truncated content (best-effort)
            if (res.status === 400 && msgObj && msgObj.content) {
                try {
                    const sanitize = (s) => s.toString().replace(/[\u0000-\u001F\u007F]/g, '').trim()
                    const short = sanitize(msgObj.content).slice(0, 1000)
                    if (short && short !== msgObj.content) {
                        const retryBody = { messages: [{ ...msgObj, content: short }], append: true }
                        const retryRes = await fetch(`/api/ai/chat/${id}`, {
                            method: 'PUT',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(retryBody)
                        })
                        if (retryRes.ok) {
                            const data = await retryRes.json()
                            return { success: true, data, retried: true }
                        } else {
                            let rb
                            try { rb = await retryRes.json() } catch (e) { try { rb = await retryRes.text() } catch (e2) { rb = retryRes.statusText } }
                            result.retry = { status: retryRes.status, body: rb }
                        }
                    }
                } catch (err) { console.warn('Retry updateAichatLastMessage failed:', err) }
            }

            return result
        }
        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        console.error('Update AI chat lastMessage error:', error)
        // return error result rather than throw
        return { success: false, message: error.message || 'Failed to update chat lastMessage' }
    }
}
export default { sendMessageToGrok, sendMessageToGrokWithFile, fetchAichatList, fetchAichatById, createAichat, appendMessagesToAichat, deleteAichat, updateAichatTitle, updateAichatLastMessage }