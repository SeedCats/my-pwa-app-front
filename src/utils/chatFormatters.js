export const getDomain = (url) => {
    try {
        const urlObj = new URL(url)
        return urlObj.hostname.replace(/^www\./, '')
    } catch (e) {
        return url
    }
}

export const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const d = (timestamp instanceof Date) ? timestamp : new Date(timestamp)
    if (isNaN(d.getTime())) return ''
    const pad = (n) => (n < 10 ? '0' + n : '' + n)
    const year = d.getFullYear()
    const month = pad(d.getMonth() + 1)
    const day = pad(d.getDate())
    const hours = pad(d.getHours())
    const mins = pad(d.getMinutes())
    return `${year}/${month}/${day} ${hours}:${mins}`
}

export const cleanContent = (content) => {
    if (!content) return content
    let t = content.toString()

    t = t.replace(/<\s*parameter\s+name\s*=\s*[^>]*>[\s\S]*?<\s*\/\s*parameter\s*>/gi, '')
    t = t.replace(/<\s*parameter\s+name\s*=\s*[^>]*>/gi, '')
    t = t.replace(/<\s*\/\s*parameter\s*>/gi, '')
    t = t.replace(/<\s*\/\s*x\s*>/gi, '')
    t = t.replace(/<\s*\/\s*x\s*ai\s*_?\s*call\s*>/gi, '')
    t = t.replace(/<\s*\/\s*xai\s*:\s*function\s*_?\s*call\s*>/gi, '')
    t = t.replace(/ai\s*:\s*function\s*_?\s*call\s+[^>]*>/gi, '')
    t = t.replace(/<\s*ai\s*:\s*function\s*_?\s*call[^>]*>/gi, '')
    t = t.replace(/<\s*xai\s*:\s*function\s*_?\s*call[^>]*>/gi, '')
    t = t.replace(/ai\s*:\s*function\s+_?\s*call\s+name\s*=\s*[^>]*/gi, '')

    t = t.replace(/\u00A0/g, ' ')
    t = t.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    t = t.replace(/[ \t]+/g, ' ')
    t = t.replace(/[ \t]+([,.!?:;])/g, '$1')
    t = t.replace(/[ \t]*(°)[ \t]*/g, '$1')
    t = t.replace(/(\d)[ \t]+(\d)/g, '$1$2')
    t = t.replace(/(?<=\w)[ \t]+-[ \t]+(?=\w)/g, '-')
    t = t.replace(/(?<=\w)[ \t]+-(?=\w)/g, '-')
    t = t.replace(/(?<=\w)-[ \t]+(?=\w)/g, '-')
    t = t.replace(/[ \t]*\/[ \t]*/g, '/')
    t = t.replace(/\b([a-z])[ \t]+([a-z]{1,3})\.(gov|com|org|net|edu)/gi, '$1$2.$3')
    t = t.replace(/[ \t]+'/g, "'")
    t = t.replace(/'[ \t]+([st])\b/g, "'$1")

    t = t.split('\n').map(line => line.trim()).join('\n')
    t = t.replace(/^\s*\n+/, '').replace(/\n+\s*$/, '')

    return t
}

export const stripCitations = (text) => {
    if (typeof text !== 'string') return text
    let t = text.replace(/\[\[\d+\]\]\([^)]*\)/g, '')
    t = t.replace(/\[\d+\]\([^)]*\)/g, '')
    t = t.replace(/\[\[?\d+\]?\]/g, '')
    t = t.replace(/(?<!^)(?<!\n)[ \t]*-(?=[ \t]*\*\*|[ \t]*:|[ \t]*[A-Z])/g, '\n- ')
    return t
}

export const appendChunkContent = (aiMessage, text) => {
    if (!text) return
    const normalizeForDedupe = (s) => (s || '').toString().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
    const existing = normalizeForDedupe(aiMessage.content)
    const incoming = normalizeForDedupe(text)
    if (incoming && incoming.length > 6) {
        if (existing.endsWith(incoming) || existing.includes(incoming)) return
    }
    aiMessage.content += text
}

export const getChatPreview = (chat) => {
    if (!chat) return ''
    let msg = ''
    try {
        if (chat.lastMessage) {
            if (typeof chat.lastMessage === 'string') msg = chat.lastMessage
            else if (chat.lastMessage.content) msg = chat.lastMessage.content
            else if (typeof chat.lastMessage === 'object') {
                msg = chat.lastMessage.content || chat.lastMessage.text || ''
            }
        } else if (chat.messages && chat.messages.length) {
            const last = chat.messages[chat.messages.length - 1]
            msg = (last && last.content) ? last.content : ''
        }
    } catch (e) { msg = '' }
    msg = cleanContent(msg || '')
    if (msg.length > 140) return msg.slice(0, 140)
    return msg
}

export const parseId = (idCandidate) => {
    if (!idCandidate) return null
    if (typeof idCandidate === 'string') return idCandidate
    try {
        if (idCandidate.toString && typeof idCandidate.toString === 'function') return idCandidate.toString()
    } catch (e) { }
    if (idCandidate && typeof idCandidate === 'object' && idCandidate.$oid) return idCandidate.$oid
    return null
}
