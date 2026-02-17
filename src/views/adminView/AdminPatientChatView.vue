<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out pt-16',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main class="h-[calc(100vh-4rem)] flex">
        <div class="w-72 border-r p-4 overflow-y-auto" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="flex items-center justify-between mb-3">
            <h1 class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ t('admin.patientMessagesTitle') }}</h1>
            <button
              type="button"
              @click="loadAssignedUsers"
              class="px-3 py-1 text-xs rounded border"
              :class="[themeClasses.border, themeClasses.textSecondary, themeClasses.inputBackground]"
            >
              {{ t('admin.refresh') }}
            </button>
          </div>

          <p v-if="usersLoading" class="text-sm" :class="themeClasses.textSecondary">{{ t('common.loading') }}</p>
          <p v-else-if="users.length === 0" class="text-sm" :class="themeClasses.textSecondary">{{ t('admin.noAssignedUsers') }}</p>

          <div v-else class="space-y-2">
            <button
              v-for="user in users"
              :key="user.id"
              type="button"
              @click="selectUser(user)"
              class="w-full text-left p-3 rounded border transition"
              :class="[
                selectedUser?.id === user.id
                  ? (isDarkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-300 bg-blue-50')
                  : `${themeClasses.border} ${themeClasses.inputBackground}`
              ]"
            >
              <p class="text-sm font-medium" :class="themeClasses.textPrimary">{{ user.name }}</p>
              <p class="text-xs truncate" :class="themeClasses.textSecondary">{{ user.email }}</p>
            </button>
          </div>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="px-6 py-4 border-b" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="isDarkMode ? 'bg-blue-600' : 'bg-blue-500'">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-semibold" :class="themeClasses.textPrimary">{{ selectedUser ? selectedUser.name : t('admin.selectPatient') }}</h2>
                  <p class="text-xs" :class="themeClasses.textSecondary">{{ selectedUser ? selectedUser.email : t('admin.selectPatientHint') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-4 space-y-4" :class="themeClasses.background">
            <div v-if="messagesLoading" class="text-sm" :class="themeClasses.textSecondary">{{ t('common.loading') }}</div>

            <div v-for="message in messages" :key="message.id" :class="['flex', message.isUser ? 'justify-start' : 'justify-end']">
              <div :class="[
                'max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg',
                message.isUser
                  ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
                  : (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              ]">
                <p v-if="message.fileName" class="text-xs mb-1 opacity-80">📎 {{ message.fileName }}</p>
                <p class="text-sm">{{ message.text }}</p>
                <p class="text-xs mt-1 opacity-70">{{ message.time }}</p>
              </div>
            </div>

            <div v-if="!selectedUser || messages.length === 0" class="flex flex-col items-center justify-center h-full">
              <svg class="w-16 h-16 mb-4 opacity-30" :class="themeClasses.textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-lg font-medium" :class="themeClasses.textSecondary">{{ t('chat.noMessages') }}</p>
              <p class="text-sm" :class="themeClasses.textSecondary">{{ selectedUser ? t('admin.noPatientMessages') : t('admin.selectPatientHint') }}</p>
            </div>
          </div>

          <div class="px-6 py-4 border-t" :class="[themeClasses.cardBackground, themeClasses.border]">
            <form @submit.prevent="sendMessage" class="flex items-end gap-3">
              <div class="flex flex-col gap-1">
                <input
                  ref="fileInputRef"
                  type="file"
                  class="hidden"
                  @change="onFileSelected"
                />
                <button
                  type="button"
                  @click="triggerFilePicker"
                  :disabled="!selectedUser || isSending"
                  class="px-3 py-3 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="[themeClasses.border, themeClasses.inputBackground, themeClasses.textPrimary]"
                  :title="t('chat.attachFile')"
                >
                  📎
                </button>
              </div>
              <textarea
                v-model="newMessage"
                @keydown.enter.exact.prevent="sendMessage"
                rows="1"
                :placeholder="t('chat.typePlaceholder')"
                :disabled="!selectedUser || isSending"
                class="flex-1 px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
              />
              <button
                type="submit"
                :disabled="(!newMessage.trim() && !selectedFile) || !selectedUser || isSending"
                class="px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <p v-if="selectedFile" class="text-xs mt-2" :class="themeClasses.textSecondary">
              {{ t('chat.attachedFile') }}: {{ selectedFile.name }}
              <button type="button" @click="clearSelectedFile" class="ml-2 underline">{{ t('chat.removeFile') }}</button>
            </p>
            <p class="text-xs mt-2" :class="themeClasses.textSecondary">{{ t('chat.sendHint') }}</p>
            <p v-if="errorMessage" class="text-xs mt-2 text-red-500">{{ errorMessage }}</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Sidebar from '../../components/Side_and_Top_Bar.vue'
import { useTheme } from '../../composables/useTheme'
import { useLanguage } from '../../composables/useLanguage'
import { fetchAdminChatHistory, fetchAssignedUsers, fetchCurrentUserProfile, sendAdminChatMessage } from '../../services/userChatService'

const { themeClasses, isDarkMode } = useTheme()
const { t } = useLanguage()

const sidebarHidden = ref(false)
const updateSidebarState = (state) => sidebarHidden.value = state

const users = ref([])
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
    const response = await fetchAssignedUsers(1, 100)
    users.value = (response?.users || []).map((user) => ({
      id: user.id || user._id,
      name: user.name || user.email || 'User',
      email: user.email || ''
    }))

    if (!selectedUser.value && users.value.length > 0) {
      await selectUser(users.value[0])
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load assigned users'
  } finally {
    usersLoading.value = false
  }
}

const selectUser = async (user) => {
  selectedUser.value = user
  messagesLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetchAdminChatHistory(user.id, adminId.value)
    messages.value = response?.messages || []
    scrollToBottom()
  } catch (error) {
    messages.value = []
    errorMessage.value = error.message || 'Failed to load patient messages'
  } finally {
    messagesLoading.value = false
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
