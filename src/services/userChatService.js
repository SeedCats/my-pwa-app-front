import { apiRequest } from './apiClient'

const resolveMessages = (payload) => {
  if (Array.isArray(payload?.messages)) return payload.messages
  if (Array.isArray(payload?.data?.messages)) return payload.data.messages
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const normalizeMessage = (message, currentUserId = null) => {
  const senderId = message?.senderId?.toString?.() || String(message?.senderId || '')
  const normalizedUserId = currentUserId ? String(currentUserId) : null

  return {
    id: message?.id || message?._id || `${senderId}-${message?.createdAt || Date.now()}`,
    text: message?.text || '',
    fileName: message?.fileName || message?.attachmentName || message?.file?.name || null,
    fileUrl: message?.fileUrl || message?.attachmentUrl || message?.file?.url || null,
    senderId: message?.senderId,
    receiverId: message?.receiverId,
    createdAt: message?.createdAt,
    time: message?.time || (message?.createdAt ? new Date(message.createdAt).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }) : ''),
    isUser: typeof message?.isUser === 'boolean'
      ? message.isUser
      : (normalizedUserId ? senderId === normalizedUserId : false)
  }
}

const normalizeMessageFromResponse = (response, currentUserId = null) => {
  const rawMessage = response?.message || response?.data?.message || response?.data
  return rawMessage ? normalizeMessage(rawMessage, currentUserId) : null
}

const toFallbackText = (text, file) => {
  const cleanText = (text || '').trim()
  if (!file) return cleanText
  const fileLine = `[File] ${file.name}`
  return cleanText ? `${cleanText}\n${fileLine}` : fileLine
}

const tryRequestWithNotFoundFallback = async (attempts) => {
  let lastError = null

  for (const attempt of attempts) {
    try {
      return await apiRequest(attempt.path, {
        method: attempt.method || 'GET',
        query: attempt.query || null,
        body: attempt.body || null,
        isForm: !!attempt.isForm
      })
    } catch (error) {
      lastError = error
      const errorText = String(error?.message || '')
      const isNotFound = errorText.includes('404') || errorText.toLowerCase().includes('not found')
      if (!isNotFound) throw error
    }
  }

  throw lastError || new Error('Request failed')
}

export const fetchCurrentUserProfile = async () => {
  return apiRequest('/api/user/me')
}

export const fetchUserChatHistory = async (currentUserId = null) => {
  const response = await apiRequest('/api/user-chat/history')
  return {
    ...response,
    messages: resolveMessages(response).map((message) => normalizeMessage(message, currentUserId))
  }
}

export const sendUserChatMessage = async (text, currentUserId = null) => {
  const response = await apiRequest('/api/user-chat/send', {
    method: 'POST',
    body: { text }
  })

  return {
    ...response,
    message: normalizeMessageFromResponse(response, currentUserId)
  }
}

export const sendUserChatMessageWithAttachment = async (text, file, currentUserId = null) => {
  if (!file) return sendUserChatMessage(text, currentUserId)

  const formData = new FormData()
  formData.append('text', (text || '').trim())
  formData.append('file', file)

  try {
    const response = await apiRequest('/api/user-chat/send', {
      method: 'POST',
      body: formData,
      isForm: true
    })

    return {
      ...response,
      message: normalizeMessageFromResponse(response, currentUserId)
    }
  } catch {
    const fallbackResponse = await apiRequest('/api/user-chat/send', {
      method: 'POST',
      body: { text: toFallbackText(text, file) }
    })

    return {
      ...fallbackResponse,
      message: normalizeMessageFromResponse(fallbackResponse, currentUserId)
    }
  }
}

export const fetchUserUnreadSummary = async () => {
  const response = await apiRequest('/api/user-chat/unread')
  const count = Number(response?.count ?? response?.data?.count ?? response?.unreadCount ?? 0) || 0
  const preview = response?.lastMessage || response?.data?.lastMessage || null

  return {
    ...response,
    count,
    preview
  }
}

export const fetchAdminUnreadSummary = async () => {
  const attempts = [
    { path: '/api/admin-chat/unread' },
    { path: '/api/admin/user-chat/unread' }
  ]

  const response = await tryRequestWithNotFoundFallback(attempts)
  const count = Number(response?.count ?? response?.data?.count ?? response?.unreadCount ?? 0) || 0
  const preview = response?.lastMessage || response?.data?.lastMessage || null

  return {
    ...response,
    count,
    preview
  }
}

export const fetchAssignedUsers = async (page = 1, limit = 50) => {
  const response = await apiRequest('/api/admin/assigned-users', { query: { page, limit } })
  const users = response?.data?.users || response?.users || []
  return {
    ...response,
    users
  }
}

export const fetchAdminChatHistory = async (userId, providerId = null) => {
  if (!userId) throw new Error('Missing userId')

  const endpointAttempts = [
    { path: `/api/admin-chat/history`, query: { userId } },
    { path: `/api/admin/user-chat/history`, query: { userId } },
    { path: `/api/admin-chat/history/${userId}` },
    { path: `/api/admin/user-chat/history/${userId}` },
    { path: `/api/user-chat/history`, query: { userId } }
  ]

  const response = await tryRequestWithNotFoundFallback(endpointAttempts)

  return {
    ...response,
    messages: resolveMessages(response).map((message) => normalizeMessage(message, providerId))
  }
}

export const sendAdminChatMessage = async (userId, text, providerId = null, file = null) => {
  if (!userId) throw new Error('Missing userId')

  const payloadText = (text || '').trim()
  const body = file
    ? (() => {
      const formData = new FormData()
      formData.append('userId', String(userId))
      formData.append('text', payloadText)
      formData.append('file', file)
      return formData
    })()
    : { userId, text: payloadText }

  const sendAttempts = [
    { path: '/api/admin-chat/send', method: 'POST', body, isForm: !!file },
    { path: '/api/admin/user-chat/send', method: 'POST', body, isForm: !!file },
    { path: `/api/admin-chat/send/${userId}`, method: 'POST', body: file ? body : { text: payloadText }, isForm: !!file },
    { path: `/api/admin/user-chat/send/${userId}`, method: 'POST', body: file ? body : { text: payloadText }, isForm: !!file },
    { path: '/api/user-chat/send', method: 'POST', query: { userId }, body: file ? body : { text: payloadText }, isForm: !!file }
  ]

  try {
    const response = await tryRequestWithNotFoundFallback(sendAttempts)
    return {
      ...response,
      message: normalizeMessageFromResponse(response, providerId)
    }
  } catch {
    const fallbackResponse = await tryRequestWithNotFoundFallback([
      { path: '/api/admin-chat/send', method: 'POST', body: { userId, text: toFallbackText(text, file) } },
      { path: '/api/admin/user-chat/send', method: 'POST', body: { userId, text: toFallbackText(text, file) } },
      { path: `/api/admin-chat/send/${userId}`, method: 'POST', body: { text: toFallbackText(text, file) } },
      { path: `/api/admin/user-chat/send/${userId}`, method: 'POST', body: { text: toFallbackText(text, file) } },
      { path: '/api/user-chat/send', method: 'POST', query: { userId }, body: { text: toFallbackText(text, file) } }
    ])

    return {
      ...fallbackResponse,
      message: normalizeMessageFromResponse(fallbackResponse, providerId)
    }
  }
}
