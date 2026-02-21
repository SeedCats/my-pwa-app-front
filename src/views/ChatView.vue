<template>
    <div class="min-h-screen" :class="themeClasses.background">
        <main class="h-[calc(100vh-4rem)] flex flex-col">
            <!-- Chat Header -->
            <div class="px-6 py-4 border-b" :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <img v-if="receiverIcon" :src="receiverIcon" alt="Provider Icon" class="w-10 h-10 rounded-full object-cover" />
                        <div v-else class="w-10 h-10 rounded-full flex items-center justify-center"
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
                    <div class="flex items-end gap-2" :class="message.isUser ? 'flex-row-reverse' : 'flex-row'">
                        <!-- Avatar dot -->
                        <template v-if="message.isUser">
                            <img v-if="senderIcon" :src="senderIcon" alt="User Icon" class="w-6 h-6 rounded-full shrink-0 mb-0.5 object-cover" />
                            <div v-else class="w-6 h-6 rounded-full shrink-0 mb-0.5 flex items-center justify-center text-[10px] font-bold text-white"
                                :class="isDarkMode ? 'bg-blue-600' : 'bg-blue-500'">
                                U
                            </div>
                        </template>
                        <template v-else>
                            <img v-if="receiverIcon" :src="receiverIcon" alt="Provider Icon" class="w-6 h-6 rounded-full shrink-0 mb-0.5 object-cover" />
                            <div v-else class="w-6 h-6 rounded-full shrink-0 mb-0.5 flex items-center justify-center text-[10px] font-bold text-white"
                                :class="isDarkMode ? 'bg-blue-600' : 'bg-blue-500'">
                                A
                            </div>
                        </template>

                        <div :class="[
                            'max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg',
                            message.isUser
                                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200'),
                            message.isUser ? '' : themeClasses.textPrimary
                        ]">
                            <p v-if="message.text" class="text-sm">{{ message.text }}</p>
                            <div v-if="message.fileName" class="mt-2 mb-1">
                                <button @click="downloadFile(message.id, message.fileName)" 
                                    class="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition-colors border"
                                    :class="message.isUser 
                                        ? (isDarkMode ? 'bg-blue-700/50 border-blue-500 hover:bg-blue-700' : 'bg-blue-600 border-blue-400 hover:bg-blue-700') 
                                        : (isDarkMode ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : 'bg-white border-gray-300 hover:bg-gray-50')">
                                    <div class="p-1.5 rounded-lg shrink-0" :class="message.isUser ? 'bg-white/20' : (isDarkMode ? 'bg-gray-500' : 'bg-blue-50')">
                                        <svg class="w-4 h-4" :class="message.isUser ? 'text-white' : 'text-blue-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium truncate flex-1" :class="message.isUser ? 'text-white' : themeClasses.textPrimary">
                                        {{ message.fileName }}
                                    </span>
                                </button>
                            </div>
                            <p class="text-xs mt-1 opacity-70">{{ message.time }}</p>
                        </div>
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
                <!-- File preview -->
                <div v-if="selectedFile"
                     class="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-sm border"
                     :class="[isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700']">
                    <svg class="w-4 h-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span class="truncate flex-1 font-medium">{{ selectedFile.name }}</span>
                    <button type="button" @click="clearSelectedFile" class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-500 hover:text-red-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form @submit.prevent="sendMessage" class="flex items-end gap-2">
                    <!-- File attach -->
                    <input ref="fileInputRef" type="file" class="hidden" @change="onFileSelected" />
                    <button type="button" @click="triggerFilePicker" :disabled="noProviderAssigned || isSending"
                        class="p-2.5 rounded-xl border transition-all duration-150 disabled:opacity-40 hover:scale-105 active:scale-95"
                        :class="[themeClasses.border, themeClasses.inputBackground, themeClasses.textSecondary]"
                        :title="t('chat.attachFile')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>

                    <!-- Text input -->
                    <textarea v-model="newMessage" @keydown.enter.exact.prevent="sendMessage" rows="1"
                        :placeholder="t('chat.typePlaceholder')" :disabled="noProviderAssigned || isSending"
                        class="flex-1 px-4 py-2.5 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition disabled:opacity-50"
                        :class="[
                            themeClasses.inputBackground,
                            themeClasses.textPrimary,
                            themeClasses.border
                        ]"
                        style="max-height:120px;min-height:42px;" />

                    <!-- Send -->
                    <button type="submit"
                        :disabled="(!newMessage.trim() && !selectedFile) || noProviderAssigned || isSending"
                        class="p-2.5 rounded-xl font-medium transition-all duration-150 disabled:opacity-40 hover:scale-105 active:scale-95"
                        :class="isDarkMode
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'">
                        <svg v-if="!isSending" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                    </button>
                </form>
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
import { fetchCurrentUserProfile, fetchUserChatHistory, sendUserChatMessage, sendUserChatMessageWithAttachment, downloadUserChatFile } from '../services/userChatService'

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
const receiverIcon = ref(null)
const senderIcon = ref(null)

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
        senderIcon.value = userData?.icon || null
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
        receiverIcon.value = response?.receiverIcon || null
        
        noProviderAssigned.value = noProviderAssigned.value || (response?.messages?.length === 0 && response?.message?.toLowerCase?.().includes('no healthcare provider'))
        scrollToBottom()
        
        // Dispatch event to update unread count in top bar
        window.dispatchEvent(new CustomEvent('messagesRead'))
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

const downloadFile = async (messageId, fileName) => {
    try {
        await downloadUserChatFile(messageId, fileName)
    } catch (error) {
        console.error('Error downloading file:', error)
        errorMessage.value = error.message || 'Failed to download file'
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