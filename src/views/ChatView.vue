<template>
    <div class="min-h-screen" :class="themeClasses.background">
        <Sidebar @update:sidebarState="updateSidebarState" />
        <div :class="[
            'transition-all duration-300 ease-in-out pt-16',
            sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
        ]">
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
                <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4" :class="themeClasses.background">
                    <div v-for="message in messages" :key="message.id" 
                        :class="['flex', message.isUser ? 'justify-end' : 'justify-start']">
                        <div :class="[
                            'max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg',
                            message.isUser 
                                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200'),
                            message.isUser ? '' : themeClasses.textPrimary
                        ]">
                            <p class="text-sm">{{ message.text }}</p>
                            <p class="text-xs mt-1 opacity-70">{{ message.time }}</p>
                        </div>
                    </div>
                    
                    <!-- Empty state -->
                    <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full">
                        <svg class="w-16 h-16 mb-4 opacity-30" :class="themeClasses.textSecondary" 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p class="text-lg font-medium" :class="themeClasses.textSecondary">
                            {{ t('chat.noMessages') }}
                        </p>
                        <p class="text-sm" :class="themeClasses.textSecondary">
                            {{ t('chat.startConversation') }}
                        </p>
                    </div>
                </div>

                <!-- Message Input -->
                <div class="px-6 py-4 border-t" :class="[themeClasses.cardBackground, themeClasses.border]">
                    <form @submit.prevent="sendMessage" class="flex items-end gap-3">
                        <textarea 
                            v-model="newMessage"
                            @keydown.enter.exact.prevent="sendMessage"
                            rows="1"
                            :placeholder="t('chat.typePlaceholder')"
                            class="flex-1 px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :class="[
                                themeClasses.inputBackground,
                                themeClasses.textPrimary,
                                themeClasses.border
                            ]"
                        />
                        <button 
                            type="submit"
                            :disabled="!newMessage.trim()"
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
                    <p class="text-xs mt-2" :class="themeClasses.textSecondary">
                        {{ t('chat.sendHint') }}
                    </p>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Sidebar from '../components/Side_and_Top_Bar.vue'
import { useTheme } from '../composables/useTheme'
import { useLanguage } from '../composables/useLanguage'

const { isDarkMode, themeClasses } = useTheme()
const { t } = useLanguage()

const sidebarHidden = ref(false)
const updateSidebarState = (state) => sidebarHidden.value = state

const newMessage = ref('')
const messages = ref([])

const API_URL = import.meta.env.VITE_API_URL || ''
const providerName = ref(null)

// Load user data to get provider name
onMounted(async () => {
    try {
        const res = await fetch(`${API_URL}/api/user/me`, { credentials: 'include' })
        if (res.ok) {
            const json = await res.json()
            const userData = json.data?.user || json.data || json.user || json
            providerName.value = userData?.provider || userData?.providerName || userData?.assignedProvider
        }
    } catch (err) {
        console.error('Error loading user data:', err)
    }
})

const sendMessage = () => {
    if (!newMessage.value.trim()) return

    const message = {
        id: Date.now(),
        text: newMessage.value,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isUser: true
    }

    messages.value.push(message)
    newMessage.value = ''

    // Auto-scroll to bottom
    nextTick(() => {
        const container = document.querySelector('.overflow-y-auto')
        if (container) {
            container.scrollTop = container.scrollHeight
        }
    })

    // Simulate provider response (remove this in production)
    setTimeout(() => {
        messages.value.push({
            id: Date.now(),
            text: t('chat.autoResponse'),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isUser: false
        })
        nextTick(() => {
            const container = document.querySelector('.overflow-y-auto')
            if (container) {
                container.scrollTop = container.scrollHeight
            }
        })
    }, 1000)
}
</script>