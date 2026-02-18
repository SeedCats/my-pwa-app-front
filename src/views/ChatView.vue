<template>
    <div class="min-h-screen" :class="themeClasses.background">
        <main class="h-[calc(100vh-4rem)] flex flex-col">
            <!-- Chat Header -->
            <div class="px-6 py-4 border-b" :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center"
                            :class="isDarkMode ? 'bg-blue-600' : 'bg-blue-500'">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-xl font-semibold" :class="themeClasses.textPrimary">
                                {{ providerName || t('chat.healthcareProvider') }}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Messages Container -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-4 space-y-4"
                :class="themeClasses.background">
                <div v-if="isLoading" class="text-sm" :class="themeClasses.textSecondary">
                    {{ t('common.loading') }}
                </div>

                <div v-for="message in messages" :key="message.id"
                    :class="['flex', message.isUser ? 'justify-end' : 'justify-start']">
                    <div :class="[
                        'max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg',
                        message.isUser
                            ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                            : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200'),
                        message.isUser ? '' : themeClasses.textPrimary
                    ]">
                        <p v-if="message.fileName" class="text-xs mb-1 opacity-80">
                            📎 {{ message.fileName }}
                        </p>
                        <p class="text-sm">{{ message.text }}</p>
                        <p class="text-xs mt-1 opacity-70">{{ message.time }}</p>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full">
                    <svg class="w-16 h-16 mb-4 opacity-30" :class="themeClasses.textSecondary" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p class="text-lg font-medium" :class="themeClasses.textSecondary">
                        {{ t('chat.noMessages') }}
                    </p>
                    <p class="text-sm" :class="themeClasses.textSecondary">
                        {{ noProviderAssigned ? t('chat.noProviderAssigned') : t('chat.startConversation') }}
                    </p>
                </div>
            </div>

            <!-- Message Input -->
            <div class="px-6 py-4 border-t" :class="[themeClasses.cardBackground, themeClasses.border]">
                <form @submit.prevent="sendMessage" class="flex items-end gap-3">
                    <div class="flex flex-col gap-1">
                        <input ref="fileInputRef" type="file" class="hidden" @change="onFileSelected" />
                        <button type="button" @click="triggerFilePicker" :disabled="noProviderAssigned || isSending"
                            class="px-3 py-3 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="[themeClasses.border, themeClasses.inputBackground, themeClasses.textPrimary]"
                            :title="t('chat.attachFile')">
                            📎
                        </button>
                    </div>
                    <textarea v-model="newMessage" @keydown.enter.exact.prevent="sendMessage" rows="1"
                        :placeholder="t('chat.typePlaceholder')" :disabled="noProviderAssigned || isSending"
                        class="flex-1 px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="[
                            themeClasses.inputBackground,
                            themeClasses.textPrimary,
                            themeClasses.border
                        ]" />
                    <button type="submit"
                        :disabled="(!newMessage.trim() && !selectedFile) || noProviderAssigned || isSending"
                        class="px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="isDarkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
                <p v-if="selectedFile" class="text-xs mt-2" :class="themeClasses.textSecondary">
                    {{ t('chat.attachedFile') }}: {{ selectedFile.name }}
                    <button type="button" @click="clearSelectedFile" class="ml-2 underline">{{ t('chat.removeFile')
                        }}</button>
                </p>
                <p class="text-xs mt-2" :class="themeClasses.textSecondary">
                    {{ t('chat.sendHint') }}
                </p>
                <p v-if="errorMessage" class="text-xs mt-2 text-red-500">
                    {{ errorMessage }}
                </p>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useLanguage } from '../composables/useLanguage'
import { fetchCurrentUserProfile, fetchUserChatHistory, sendUserChatMessage, sendUserChatMessageWithAttachment } from '../services/userChatService'

const { isDarkMode, themeClasses } = useTheme()
const { t } = useLanguage()

const newMessage = ref('')
const messages = ref([])
const messagesContainer = ref(null)
const isLoading = ref(false)
const isSending = ref(false)
const errorMessage = ref('')
const noProviderAssigned = ref(false)
const currentUserId = ref(null)
const fileInputRef = ref(null)
const selectedFile = ref(null)

const providerName = ref(null)

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
}

const loadProfile = async () => {
    try {
        const json = await fetchCurrentUserProfile()
        const userData = json?.data?.user || json?.data || json?.user || json
        currentUserId.value = userData?.id || userData?._id || null
        providerName.value = userData?.provider || userData?.providerName || userData?.assignedProvider || null
        noProviderAssigned.value = !userData?.providerId
    } catch (err) {
        console.error('Error loading user data:', err)
        errorMessage.value = err.message || 'Failed to load user data'
    }
}

const loadMessages = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const response = await fetchUserChatHistory(currentUserId.value)
        messages.value = response?.messages || []
        noProviderAssigned.value = noProviderAssigned.value || (response?.messages?.length === 0 && response?.message?.toLowerCase?.().includes('no healthcare provider'))
        scrollToBottom()
    } catch (error) {
        errorMessage.value = error.message || 'Failed to load messages'
    } finally {
        isLoading.value = false
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
    if ((!newMessage.value.trim() && !selectedFile.value) || noProviderAssigned.value || isSending.value) return

    isSending.value = true
    errorMessage.value = ''
    const text = newMessage.value.trim()
    const file = selectedFile.value
    newMessage.value = ''
    clearSelectedFile()

    try {
        const response = file
            ? await sendUserChatMessageWithAttachment(text, file, currentUserId.value)
            : await sendUserChatMessage(text, currentUserId.value)

        if (response?.message) {
            messages.value.push(response.message)
            scrollToBottom()
        } else {
            await loadMessages()
        }
    } catch (error) {
        errorMessage.value = error.message || 'Failed to send message'
        newMessage.value = text
        selectedFile.value = file
    } finally {
        isSending.value = false
    }
}

onMounted(async () => {
    await loadProfile()
    await loadMessages()
})
</script>