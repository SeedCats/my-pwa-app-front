<template>
    <div class="h-full flex flex-col overflow-hidden" :class="themeClasses.background">

        <!-- ── Chat Header ─────────────────────────────────────────────── -->
        <div class="px-4 sm:px-6 lg:px-8 py-2 border-b shrink-0 backdrop-blur-md z-10 flex items-center gap-3"
             :class="[isDarkMode ? 'bg-gray-900/80 border-gray-700/60' : 'bg-white/80 border-gray-200/60']">

            <!-- Provider avatar -->
            <div class="relative shrink-0 group cursor-default">
                <img v-if="receiverIcon" :src="receiverIcon" alt="Provider Icon"
                     class="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-gray-800" />
                <div v-else
                     class="w-8 h-8 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-gray-800"
                     :class="isDarkMode ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-blue-400 to-blue-600'">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>

            </div>

            <!-- Name / subtitle -->
            <div class="flex-1 min-w-0">
                <h1 class="text-[13px] font-bold truncate tracking-tight leading-tight" :class="themeClasses.textPrimary">
                    {{ providerName || t('chat.healthcareProvider') }}
                </h1>
            </div>

            <!-- Refresh / action button -->
            <button @click="loadMessages" :disabled="isLoading"
                    class="p-2 rounded-xl transition-all duration-200 hover:shadow-sm active:scale-95 disabled:opacity-40"
                    :class="isDarkMode ? 'hover:bg-gray-700 text-gray-300 bg-gray-800' : 'hover:bg-gray-100 text-gray-500 bg-gray-50'"
                    :title="t('common.refresh') || 'Refresh'">
                <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
        </div>

        <!-- ── Messages area ───────────────────────────────────────────── -->
        <div class="flex-1 relative overflow-hidden"
             :class="isDarkMode ? 'bg-gray-900' : 'bg-[#f0f2f5]'">

            <!-- Subtle wallpaper pattern -->
            <div class="absolute inset-0 opacity-[0.06] pointer-events-none"
                 style="background-image:url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>

            <div ref="messagesContainer" class="absolute inset-0 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 custom-scrollbar">

                <!-- Loading skeleton -->
                <div v-if="isLoading" class="flex flex-col gap-5 w-full max-w-3xl mx-auto">
                    <div v-for="n in 6" :key="n" class="flex" :class="n % 2 === 0 ? 'justify-end' : 'justify-start'">
                        <div class="rounded-2xl h-11 shadow-sm animate-pulse"
                             :class="[
                                 n % 2 === 0
                                     ? (isDarkMode ? 'bg-blue-600/40' : 'bg-blue-200')
                                     : (isDarkMode ? 'bg-gray-800' : 'bg-white'),
                                 n % 3 === 0 ? 'w-48' : n % 3 === 1 ? 'w-64' : 'w-36'
                             ]" />
                    </div>
                </div>

                <!-- Empty state -->
                <div v-else-if="messages.length === 0"
                     class="flex flex-col items-center justify-center h-full text-center px-8 relative z-10 w-full max-w-sm mx-auto">
                    <div class="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ring-8"
                         :class="isDarkMode ? 'bg-gray-800 ring-gray-800/50 text-blue-400' : 'bg-blue-50 ring-blue-50/50 text-blue-500'">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 tracking-tight" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                        {{ t('chat.noMessages') }}
                    </h3>
                    <p class="text-[15px] leading-relaxed" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                        {{ noProviderAssigned ? t('chat.noProviderAssigned') : t('chat.startConversation') }}
                    </p>
                    <div class="mt-8 flex gap-3 opacity-50">
                        <div class="w-12 h-3 rounded-full bg-gray-400"></div>
                        <div class="w-12 h-3 rounded-full bg-gray-300"></div>
                        <div class="w-12 h-3 rounded-full bg-gray-400"></div>
                    </div>
                </div>

                <!-- Messages -->
                <template v-else>
                    <div class="w-full flex flex-col gap-1 relative z-10">
                        <template v-for="(message, index) in messages" :key="message.id">

                            <!-- Date separator -->
                            <div v-if="index === 0 || !sameDay(messages[index - 1], message)"
                                 class="flex justify-center my-5 z-10 pointer-events-none">
                                <span class="text-[11px] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm border"
                                      :class="isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700/60' : 'bg-white text-gray-500 border-gray-200'">
                                    {{ formatDateLabel(message.time) }}
                                </span>
                            </div>

                            <!-- Message row -->
                            <div class="flex group transition-all"
                                 :class="[
                                     message.isUser ? 'justify-end' : 'justify-start',
                                     (index > 0 && messages[index - 1].isUser === message.isUser && sameDay(messages[index - 1], message)) ? 'mt-0' : 'mt-2'
                                 ]">
                                <div class="flex items-end gap-2 max-w-[82%] sm:max-w-[70%] lg:max-w-[58%] xl:max-w-[52%]"
                                     :class="message.isUser ? 'flex-row-reverse' : 'flex-row'">

                                    <!-- Avatar — only on last message in a consecutive block -->
                                    <div class="w-7 h-7 shrink-0 hidden sm:block">
                                        <template v-if="index === messages.length - 1 || messages[index + 1].isUser !== message.isUser || !sameDay(messages[index + 1], message)">
                                            <template v-if="message.isUser">
                                                <img v-if="senderIcon" :src="senderIcon" alt="Me"
                                                     class="w-7 h-7 rounded-full object-cover shadow-sm ring-1 ring-white/50" />
                                                <div v-else class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                                                     :class="isDarkMode ? 'bg-blue-600' : 'bg-blue-500'">
                                                    U
                                                </div>
                                            </template>
                                            <template v-else>
                                                <img v-if="receiverIcon" :src="receiverIcon" alt="Provider"
                                                     class="w-7 h-7 rounded-full object-cover shadow-sm ring-1 ring-white/50" />
                                                <div v-else class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                                                     style="background:linear-gradient(135deg,#3b82f6,#2563eb)">
                                                    P
                                                </div>
                                            </template>
                                        </template>
                                    </div>

                                    <!-- Bubble -->
                                    <div class="px-4 py-2.5 shadow-sm text-[15px] leading-relaxed relative"
                                         :class="[
                                             message.isUser
                                                 ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                                 : (isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'),
                                             message.isUser ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'
                                         ]">

                                        <!-- Bubble tail -->
                                        <svg v-if="message.isUser && (index === messages.length - 1 || messages[index + 1].isUser !== message.isUser || !sameDay(messages[index + 1], message))"
                                             viewBox="0 0 8 13" width="8" height="13" class="absolute bottom-0 -right-2"
                                             :class="isDarkMode ? 'text-blue-600' : 'text-blue-500'" fill="currentColor">
                                            <path d="M5.188,1H0v11.193l6.467-8.625C7.526,2.156,6.958,1,5.188,1z"/>
                                        </svg>
                                        <svg v-if="!message.isUser && (index === messages.length - 1 || messages[index + 1].isUser !== message.isUser || !sameDay(messages[index + 1], message))"
                                             viewBox="0 0 8 13" width="8" height="13" class="absolute bottom-0 -left-2"
                                             :class="isDarkMode ? 'text-gray-800' : 'text-white'" fill="currentColor">
                                            <path d="M1.533,3.568L8,12.193V1H2.812C1.042,1,0.474,2.156,1.533,3.568z"/>
                                        </svg>

                                        <!-- Text -->
                                        <p v-if="message.text" class="whitespace-pre-wrap" style="word-break:break-word">{{ message.text }}</p>

                                        <!-- File attachment -->
                                        <div v-if="message.fileName" class="mt-2 mb-1">
                                            <button @click="downloadFile(message.id, message.fileName)"
                                                    class="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 group/btn"
                                                    :class="message.isUser
                                                        ? (isDarkMode ? 'bg-blue-700/40 border-blue-400/40 hover:bg-blue-700/60' : 'bg-blue-600/20 border-blue-300/50 hover:bg-blue-600/30')
                                                        : (isDarkMode ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')">
                                                <div class="p-2 rounded-lg shrink-0 transition-transform group-hover/btn:scale-110"
                                                     :class="message.isUser ? 'bg-white/20' : (isDarkMode ? 'bg-gray-600' : 'bg-white shadow-sm')">
                                                    <svg class="w-5 h-5" :class="message.isUser ? 'text-white' : 'text-blue-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div class="flex-1 min-w-0 pr-2">
                                                    <span class="text-sm font-semibold truncate block"
                                                          :class="message.isUser ? 'text-white' : themeClasses.textPrimary">{{ message.fileName }}</span>
                                                    <span class="text-[10px] uppercase tracking-wider opacity-60 mt-0.5 block">Document</span>
                                                </div>
                                            </button>
                                        </div>

                                        <!-- Time -->
                                        <div class="flex items-center justify-end gap-1 mt-1 select-none"
                                             :class="message.isUser ? 'text-blue-100' : 'text-gray-400'">
                                            <span class="text-[10px] font-medium">{{ formatMsgTime(message.time) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </div>

        <!-- ── Input area ─────────────────────────────────────────────── -->
        <div class="px-4 sm:px-6 lg:px-8 py-4 shrink-0 z-10 transition-colors"
             :class="isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-[#f0f2f5] border-t border-gray-200'">

            <!-- File preview -->
            <transition name="fade">
                <div v-if="selectedFile"
                     class="flex items-center gap-3 px-4 py-2.5 mb-3 rounded-xl border shadow-sm w-max max-w-full backdrop-blur-sm"
                     :class="isDarkMode ? 'bg-gray-700/90 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-700'">
                    <div class="p-1.5 rounded-lg" :class="isDarkMode ? 'bg-gray-600' : 'bg-blue-50 text-blue-500'">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div class="flex flex-col min-w-0 flex-1 pr-4">
                        <span class="text-sm font-semibold truncate">{{ selectedFile.name }}</span>
                        <span class="text-[10px] opacity-70">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
                    </div>
                    <button type="button" @click="clearSelectedFile"
                            class="p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors dark:hover:bg-red-500/20">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </transition>

            <form @submit.prevent="sendMessage" class="flex items-end gap-2.5">
                <!-- File attach -->
                <input ref="fileInputRef" type="file" class="hidden" @change="onFileSelected" />
                <button type="button" @click="triggerFilePicker" :disabled="noProviderAssigned || isSending"
                        class="p-3 rounded-full transition-all duration-200 disabled:opacity-40 hover:scale-105 active:scale-95"
                        :class="isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-500 hover:text-blue-500 hover:shadow-sm'"
                        :title="t('chat.attachFile')">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>

                <!-- Text input wrapper -->
                <div class="flex-1 relative flex items-end rounded-2xl shadow-sm border border-transparent focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
                     :class="isDarkMode ? 'bg-gray-700' : 'bg-white'">
                    <textarea v-model="newMessage" @keydown.enter.exact.prevent="sendMessage" rows="1"
                              :placeholder="noProviderAssigned ? (t('chat.noProviderAssigned') || 'No provider assigned') : (t('chat.typePlaceholder') || 'Type a message…')"
                              :disabled="noProviderAssigned || isSending"
                              class="w-full pl-5 pr-4 py-3.5 bg-transparent resize-none focus:outline-none text-[15px] leading-relaxed transition disabled:opacity-50"
                              :class="themeClasses.textPrimary"
                              style="max-height:150px;min-height:50px;" />
                </div>

                <!-- Send -->
                <button type="submit"
                        :disabled="(!newMessage.trim() && !selectedFile) || noProviderAssigned || isSending"
                        class="p-3.5 rounded-full font-bold transition-all duration-200 shadow-sm disabled:shadow-none"
                        :class="(newMessage.trim() || selectedFile) && !noProviderAssigned
                            ? (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95')
                            : (isDarkMode ? 'bg-gray-700 text-gray-500 opacity-50' : 'bg-gray-200 text-gray-400 opacity-50')">
                    <svg v-if="!isSending" class="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                </button>
            </form>

            <!-- Footer hints -->
            <div class="flex items-center justify-between mt-2 px-1">
                <p class="text-[11px] font-medium" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
                    {{ t('chat.sendHint') }}
                </p>
                <p v-if="errorMessage" class="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded">
                    {{ errorMessage }}
                </p>
            </div>
        </div>
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

// ── Helpers ──────────────────────────────────────────────────────────────────

const sameDay = (a, b) => {
    if (!a?.time || !b?.time) return false
    const da = new Date(a.time), db = new Date(b.time)
    return da.toDateString() === db.toDateString()
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

const formatMsgTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    if (Number.isNaN(d.getTime())) return ts
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

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
        
        // Dispatch event to update unread count in top bar
        window.dispatchEvent(new CustomEvent('messagesRead'))
    } catch (error) {
        errorMessage.value = error.message || 'Failed to load messages'
    } finally {
        isLoading.value = false
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

<style scoped>
/* Fade transition for file preview */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

/* Thin custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 9999px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
}
</style>