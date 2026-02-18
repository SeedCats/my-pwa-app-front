<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="h-[calc(100vh-4rem)] flex overflow-hidden">

      <!-- ── Left panel: patient list ─────────────────────────────── -->
      <aside
        class="flex flex-col w-60 border-r shrink-0 transition-all duration-300"
        :class="[themeClasses.cardBackground, themeClasses.border]"
      >
        <!-- Header -->
        <div class="px-4 pt-5 pb-3">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center"
                   :class="isDarkMode ? 'bg-blue-600' : 'bg-blue-500'">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 class="text-sm font-bold tracking-wide uppercase" :class="themeClasses.textPrimary">
                {{ t('admin.patientMessagesTitle') }}
              </h1>
            </div>
            <button
              type="button"
              @click="loadAssignedUsers"
              :disabled="usersLoading"
              class="p-1.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95 disabled:opacity-40"
              :class="isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'"
              title="Refresh"
            >
              <svg class="w-4 h-4" :class="{ 'animate-spin': usersLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <!-- Search -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                 :class="themeClasses.textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('common.search') || 'Search patients…'"
              class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary]"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px mx-4" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'" />

        <!-- Patient list -->
        <div class="flex-1 overflow-y-auto py-2 px-2">
          <!-- Loading skeleton -->
          <template v-if="usersLoading">
            <div v-for="n in 4" :key="n" class="flex items-center gap-3 p-3 rounded-xl mb-1 animate-pulse"
                 :class="isDarkMode ? 'bg-gray-700/40' : 'bg-gray-100'">
              <div class="w-10 h-10 rounded-full" :class="isDarkMode ? 'bg-gray-600' : 'bg-gray-200'" />
              <div class="flex-1 space-y-2">
                <div class="h-3 rounded w-3/4" :class="isDarkMode ? 'bg-gray-600' : 'bg-gray-200'" />
                <div class="h-2 rounded w-1/2" :class="isDarkMode ? 'bg-gray-600' : 'bg-gray-200'" />
              </div>
            </div>
          </template>

          <p v-else-if="filteredUsers.length === 0" class="text-sm text-center py-10 px-4" :class="themeClasses.textSecondary">
            {{ searchQuery ? (t('common.noResults') || 'No matching patients') : t('admin.noAssignedUsers') }}
          </p>

          <transition-group name="list" tag="div" class="space-y-1">
            <button
              v-for="user in filteredUsers"
              :key="user.id"
              type="button"
              @click="selectUser(user)"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left group"
              :class="selectedUser?.id === user.id
                ? (isDarkMode ? 'bg-blue-600/20 ring-1 ring-blue-500' : 'bg-blue-50 ring-1 ring-blue-300')
                : (isDarkMode ? 'hover:bg-gray-700/60' : 'hover:bg-gray-50')"
            >
              <!-- Avatar -->
              <div class="relative shrink-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                     :style="{ background: stringToColor(user.name) }">
                  {{ initials(user.name) }}
                </div>
                <span
                  v-if="user.unreadCount > 0"
                  class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2"
                  :class="isDarkMode ? 'ring-gray-800' : 'ring-white'"
                >
                  {{ user.unreadCount > 99 ? '99+' : user.unreadCount }}
                </span>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline gap-1">
                  <p class="text-sm font-semibold truncate" :class="themeClasses.textPrimary">{{ user.name }}</p>
                  <span v-if="user.lastMessageTime" class="text-[10px] shrink-0" :class="themeClasses.textSecondary">
                    {{ formatTime(user.lastMessageTime) }}
                  </span>
                </div>
                <p class="text-xs truncate mt-0.5"
                   :class="user.unreadCount > 0 ? (isDarkMode ? 'text-gray-300 font-medium' : 'text-gray-700 font-medium') : themeClasses.textSecondary">
                  {{ user.lastMessage || user.email }}
                </p>
              </div>
            </button>
          </transition-group>
        </div>
      </aside>

      <!-- ── Right panel: chat ────────────────────────────────────── -->
      <div class="flex-1 flex flex-col min-w-0">

        <!-- Chat header -->
        <div class="flex items-center gap-4 px-6 py-4 border-b shrink-0"
             :class="[themeClasses.cardBackground, themeClasses.border]">
          <div v-if="selectedUser" class="flex items-center gap-3 flex-1 min-w-0">
            <div class="relative shrink-0">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                   :style="{ background: stringToColor(selectedUser.name) }">
                {{ initials(selectedUser.name) }}
              </div>
            </div>
            <div class="min-w-0">
              <h2 class="text-base font-bold truncate" :class="themeClasses.textPrimary">{{ selectedUser.name }}</h2>
              <p class="text-xs truncate" :class="themeClasses.textSecondary">{{ selectedUser.email }}</p>
            </div>
          </div>
          <div v-else class="flex-1">
            <h2 class="text-base font-semibold" :class="themeClasses.textSecondary">{{ t('admin.selectPatient') }}</h2>
            <p class="text-xs" :class="themeClasses.textSecondary">{{ t('admin.selectPatientHint') }}</p>
          </div>
        </div>

        <!-- Messages area -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto px-6 py-5 space-y-3"
          :class="themeClasses.background"
        >
          <!-- Loading -->
          <div v-if="messagesLoading" class="flex flex-col gap-3">
            <div v-for="n in 5" :key="n"
                 class="flex animate-pulse"
                 :class="n % 2 === 0 ? 'justify-end' : 'justify-start'">
              <div class="rounded-2xl h-9 px-4 py-2"
                   :class="[
                     n % 2 === 0
                       ? (isDarkMode ? 'bg-blue-700/40' : 'bg-blue-100')
                       : (isDarkMode ? 'bg-gray-700/40' : 'bg-gray-200'),
                     n % 3 === 0 ? 'w-48' : n % 3 === 1 ? 'w-64' : 'w-36'
                   ]" />
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="!selectedUser || messages.length === 0"
               class="flex flex-col items-center justify-center h-full text-center px-8">
            <div class="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                 :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
              <svg class="w-10 h-10 opacity-40" :class="themeClasses.textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p class="text-base font-semibold mb-1" :class="themeClasses.textPrimary">
              {{ selectedUser ? t('admin.noPatientMessages') : t('admin.selectPatient') }}
            </p>
            <p class="text-sm" :class="themeClasses.textSecondary">
              {{ selectedUser ? t('chat.startConversation') || 'Send the first message below.' : t('admin.selectPatientHint') }}
            </p>
          </div>

          <!-- Messages -->
          <template v-else>
            <template
              v-for="(message, index) in messages"
              :key="message.id"
            >
              <!-- Date separator -->
              <div
                v-if="index === 0 || !sameDay(messages[index - 1], message)"
                class="flex justify-center my-3"
              >
                <span class="text-[11px] px-3 py-1 rounded-full font-medium"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'">
                  {{ formatDateLabel(message.time) }}
                </span>
              </div>

              <!-- Message row -->
              <div
                class="flex"
                :class="message.isUser ? 'justify-start' : 'justify-end'"
              >
              <div class="flex items-end gap-2 max-w-[72%]"
                   :class="message.isUser ? 'flex-row' : 'flex-row-reverse'">
                <!-- Avatar dot -->
                <div class="w-6 h-6 rounded-full shrink-0 mb-0.5 flex items-center justify-center text-[10px] font-bold text-white"
                     :style="{ background: message.isUser ? stringToColor(selectedUser?.name || 'P') : '#3b82f6' }">
                  {{ message.isUser ? initials(selectedUser?.name || 'P') : 'A' }}
                </div>

                <div
                  class="px-4 py-2.5 rounded-2xl text-sm shadow-sm"
                  :class="[
                    message.isUser
                      ? (isDarkMode ? 'bg-gray-700 text-gray-100 rounded-bl-sm' : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200')
                      : (isDarkMode ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-blue-500 text-white rounded-br-sm')
                  ]"
                >
                  <p v-if="message.fileName" class="text-xs mb-1 opacity-75 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {{ message.fileName }}
                  </p>
                  <p>{{ message.text }}</p>
                  <p class="text-[10px] mt-1 opacity-60" :class="message.isUser ? 'text-left' : 'text-right'">{{ formatMsgTime(message.time) }}</p>
                </div>
              </div>
              </div>
            </template>
          </template>
        </div>

        <!-- Input area -->
        <div class="px-6 py-4 border-t shrink-0"
             :class="[themeClasses.cardBackground, themeClasses.border]">

          <!-- File preview -->
          <div v-if="selectedFile"
               class="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-xs border"
               :class="[isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600']">
            <svg class="w-4 h-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span class="truncate flex-1">{{ selectedFile.name }}</span>
            <button type="button" @click="clearSelectedFile"
                    class="ml-1 p-0.5 rounded hover:text-red-500 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="sendMessage" class="flex items-end gap-2">
            <!-- File attach -->
            <input ref="fileInputRef" type="file" class="hidden" @change="onFileSelected" />
            <button type="button" @click="triggerFilePicker"
                    :disabled="!selectedUser || isSending"
                    class="p-2.5 rounded-xl border transition-all duration-150 disabled:opacity-40 hover:scale-105 active:scale-95"
                    :class="[themeClasses.border, themeClasses.inputBackground, themeClasses.textSecondary]"
                    :title="t('chat.attachFile')">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            <!-- Text input -->
            <textarea
              v-model="newMessage"
              @keydown.enter.exact.prevent="sendMessage"
              rows="1"
              :placeholder="selectedUser ? (t('chat.typePlaceholder') || 'Type a message…') : (t('admin.selectPatientHint') || 'Select a patient to start chatting')"
              :disabled="!selectedUser || isSending"
              class="flex-1 px-4 py-2.5 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition disabled:opacity-50"
              :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
              style="max-height:120px;min-height:42px;"
            />

            <!-- Send -->
            <button
              type="submit"
              :disabled="(!newMessage.trim() && !selectedFile) || !selectedUser || isSending"
              class="p-2.5 rounded-xl font-medium transition-all duration-150 disabled:opacity-40 hover:scale-105 active:scale-95"
              :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
            >
              <svg v-if="!isSending" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </button>
          </form>

          <div class="flex items-center justify-between mt-2">
            <p class="text-xs" :class="themeClasses.textSecondary">{{ t('chat.sendHint') }}</p>
            <p v-if="errorMessage" class="text-xs text-red-500">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { useLanguage } from '../../composables/useLanguage'
import { fetchAdminChatHistory, fetchAdminChatUsers, fetchCurrentUserProfile, sendAdminChatMessage } from '../../services/userChatService'

const { themeClasses, isDarkMode } = useTheme()
const { t } = useLanguage()

const users = ref([])
const searchQuery = ref('')
const selectedUser = ref(null)
const usersLoading = ref(false)
const messagesLoading = ref(false)
const messages = ref([])
const errorMessage = ref('')
const adminId = ref(null)
const messagesContainer = ref(null)
const newMessage = ref('')
const isSending = ref(false)
const selectedFile = ref(null)
const fileInputRef = ref(null)

// ── Helpers ──────────────────────────────────────────────────────────────────

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

const initials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'

const stringToColor = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const h = Math.abs(hash) % 360
  return `hsl(${h},55%,45%)`
}

const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const diff = now - d
  if (diff < 7 * 86400000) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const formatDateLabel = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
}

// Show yyyy/mm/dd HH:MM inside a message bubble
const formatMsgTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  if (!Number.isNaN(d.getTime())) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`
  }
  return String(ts)
}

const sameDay = (a, b) => {
  const da = new Date(a?.time || 0)
  const db = new Date(b?.time || 0)
  return da.toDateString() === db.toDateString()
}

// ── Data loading ──────────────────────────────────────────────────────────────

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const loadProfile = async () => {
  try {
    const profile = await fetchCurrentUserProfile()
    const userData = profile?.data?.user || profile?.data || profile?.user || profile
    adminId.value = userData?.id || userData?._id || null
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load admin profile'
  }
}

const loadAssignedUsers = async () => {
  usersLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetchAdminChatUsers()
    users.value = (response?.users || []).map((user) => ({
      id: user.userId || user.id || user._id,
      name: user.name || user.email || 'User',
      email: user.email || '',
      unreadCount: user.unreadCount || 0,
      lastMessage: user.lastMessage,
      lastMessageTime: user.lastMessageTime
    }))

    if (!selectedUser.value && users.value.length > 0) {
      // selectUser(users.value[0]) // Don't auto-select, let them choose? Or auto-select first is fine.
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load chat users'
  } finally {
    usersLoading.value = false
  }
}

const selectUser = async (user) => {
  selectedUser.value = user
  // Reset unread count locally for UI feedback
  user.unreadCount = 0
  messagesLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetchAdminChatHistory(user.id, adminId.value)
    messages.value = response?.messages || []
  } catch (error) {
    messages.value = []
    errorMessage.value = error.message || 'Failed to load patient messages'
  } finally {
    messagesLoading.value = false
    scrollToBottom()
  }
}

const triggerFilePicker = () => {
  fileInputRef.value?.click()
}

const onFileSelected = (event) => {
  const file = event?.target?.files?.[0] || null
  selectedFile.value = file
}

const clearSelectedFile = () => {
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const sendMessage = async () => {
  if ((!newMessage.value.trim() && !selectedFile.value) || !selectedUser.value || isSending.value) return

  isSending.value = true
  errorMessage.value = ''
  const text = newMessage.value.trim()
  const file = selectedFile.value
  newMessage.value = ''
  clearSelectedFile()

  try {
    const response = await sendAdminChatMessage(selectedUser.value.id, text, adminId.value, file)
    if (response?.message) {
      messages.value.push(response.message)
      scrollToBottom()
    } else {
      await selectUser(selectedUser.value)
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to send patient message'
    newMessage.value = text
    selectedFile.value = file
  } finally {
    isSending.value = false
  }
}

onMounted(async () => {
  await loadProfile()
  await loadAssignedUsers()
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
