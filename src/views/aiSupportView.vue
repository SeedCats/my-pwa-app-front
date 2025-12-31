<template>
    <div class="min-h-screen" :class="themeClasses.background">
        <Sidebar @update:sidebarState="updateSidebarState" />
        <div :class="[
            'transition-all duration-300 ease-in-out pt-16',
            sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
        ]">
            <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
                <!-- Header -->
                <div class="mb-6 pt-4">
                    <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">AI Support Chat</h1>
                    <p class="text-sm mt-2" :class="themeClasses.textSecondary">Chat with AI for assistance and support
                    </p>
                </div>

                <!-- Chat Container -->
                <div class="max-w-9xl mx-auto">
                    <div class="relative">
                        <div class="flex items-center justify-between mb-2">
                            <div class="text-lg font-semibold" :class="[themeClasses.textPrimary, isDarkMode ? 'text-white' : 'text-gray-900']">{{ currentTitle }}</div>
                            <div class="flex items-center space-x-2">
                                <button @click.prevent="showSettings = !showSettings" :disabled="isChatBusy" :aria-disabled="isChatBusy" :title="isChatBusy ? 'Settings disabled while AI is responding' : 'AI Settings'" :class="['inline-flex items-center justify-center p-2 rounded-full text-sm transition-shadow duration-200 transform focus:outline-none focus:ring-2', isChatBusy ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : (isDarkMode ? 'bg-white text-gray-900 hover:shadow-md focus:ring-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300')]" aria-label="AI Settings" role="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-current transform transition-transform duration-200 hover:scale-105" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <rect x="3" y="5" width="12" height="2" rx="1"></rect>
                                        <circle cx="18.5" cy="6" r="1.5"></circle>

                                        <rect x="3" y="11" width="18" height="2" rx="1"></rect>
                                        <circle cx="8" cy="12" r="1.5"></circle>

                                        <rect x="3" y="17" width="10" height="2" rx="1"></rect>
                                        <circle cx="17" cy="18" r="1.5"></circle>
                                    </svg>
                                </button>

                                <button @click.prevent="startNewChat" :disabled="isChatBusy" :aria-disabled="isChatBusy" :title="isChatBusy ? 'Please wait until the current response is finished' : 'Start a new chat'" :class="isChatBusy ? 'px-3 py-1 text-sm rounded bg-green-400 text-white cursor-not-allowed' : 'px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700'">New Chat</button>
                            </div>
                        </div>
                        <div class="rounded-lg shadow-sm border" :class="[themeClasses.cardBackground, themeClasses.border]">
                            <!-- Chat Messages -->
                            <div ref="chatContainer" class="h-128 overflow-y-auto p-4 space-y-4"
                                :class="isDarkMode ? 'bg-gray-900' : 'bg-gray-50'">
                                <!-- Welcome Message -->
                                <div v-if="visibleMessages.length === 0"
                                    class="flex items-center justify-center h-full">
                                    <div class="text-center py-8">
                                        <div
                                            class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                        </div>
                                        <h3 class="text-lg font-semibold mb-2" :class="themeClasses.textPrimary">Welcome
                                            to AI Support!</h3>
                                        <p class="text-sm" :class="themeClasses.textSecondary">Start a conversation with
                                            AI. Ask me anything!</p>
                                    </div>
                                </div>

                                <!-- Messages -->
                                <div v-for="(message, index) in visibleMessages" :key="index" :class="[
                                    'flex',
                                    message && message.role === 'user' ? 'justify-end' : 'justify-start'
                                ]">
                                    <div :class="[
                                        'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : themeClasses.cardBackground + ' border ' + themeClasses.border + ' rounded-bl-none',
                                        (message.role !== 'user' && isDarkMode) ? 'text-white' : ''
                                    ]">
                                        <p :class="['text-sm whitespace-pre-wrap', message.role === 'user' ? 'break-words' : 'break-normal', (message.role !== 'user' && isDarkMode) ? 'text-white' : '']">{{
                                            cleanContent(message.content) || (message.role === 'assistant' ? '...' : '')
                                            }}</p>

                                        <!-- Streaming indicator -->
                                        <div v-if="message && message.isStreaming"
                                            class="inline-flex items-center ml-1">
                                            <span class="animate-pulse text-gray-500">▊</span>
                                        </div>

                                        <!-- Tool calls indicator (hidden for user messages; show 'None' when empty) -->
                                        <div v-if="message && message.role !== 'user'" class="mt-2 text-xs opacity-75">
                                            <div class="flex items-center space-x-1">
                                                <span>
                                                    <strong class="mr-1">Used tools:</strong>
                                                    <span>{{ formatToolList(message.toolCalls) }}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Sources / Citations (shown separately, not as main content) -->
                                        <div v-if="message && message.sources && message.sources.length > 0"
                                            class="mt-2 text-xs opacity-75">
                                            <div class="flex items-center space-x-2">
                                                <div>
                                                    <div class="text-xs font-medium">Sources:</div>
                                                    <ul class="list-disc ml-4">
                                                        <li v-for="(s, si) in message.sources" :key="si">
                                                            <a :href="s" target="_blank" rel="noopener noreferrer"
                                                                class="underline text-blue-600">{{ s }}</a>
                                                        </li>
                                                    </ul>
                                                    <div v-if="typeof message.foundSources !== 'undefined' && typeof message.requestedSources !== 'undefined' && message.foundSources < message.requestedSources" class="text-xs mt-1 text-gray-500">
                                                        {{ message.foundSources }} of {{ message.requestedSources }} sources were returned.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p class="text-xs mt-3 opacity-70">
                                            {{ formatTime(message.timestamp) }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Typing Indicator -->
                                <div v-if="isTyping" class="flex justify-start">
                                    <div :class="[
                                        'max-w-xs lg:max-w-md px-4 py-2 rounded-lg rounded-bl-none',
                                        themeClasses.cardBackground,
                                        themeClasses.border,
                                        'border'
                                    ]">
                                        <div class="flex items-center space-x-2">
                                            <div class="flex space-x-1">
                                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style="animation-delay: 0.1s"></div>
                                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style="animation-delay: 0.2s"></div>
                                            </div>
                                            <span class="text-xs text-gray-500">AI is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Chat Input -->
                            <div class="p-4 border-t" :class="themeClasses.border">
                                <!-- Error Message -->
                                <div v-if="errorMessage"
                                    class="mb-3 p-3 rounded-lg text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                    {{ errorMessage }}
                                </div>

                                <input ref="fileInput" type="file" @change="handleFileChange"
                                    accept=".txt,.csv,.json,.md" class="hidden" />

                                <form @submit.prevent="sendMessage" class="flex items-center space-x-3">
                                    <div v-if="selectedFile" class="flex-shrink-0 mr-2">
                                        <div class="inline-flex items-center max-w-xs rounded-full px-3 py-1 text-sm border"
                                            :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-gray-100 border-gray-200 text-gray-800'">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="1.6" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l8.49-8.49a3.5 3.5 0 014.95 4.95L10.83 17.83a2 2 0 01-2.83-2.83l8.49-8.49" />
                                            </svg>
                                            <span class="ml-2 truncate" style="max-width: 200px">{{ selectedFile.name
                                                }}</span>
                                            <button type="button" @click.prevent="removeSelectedFile"
                                                class="ml-3 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-red-500">✕</button>
                                        </div>
                                    </div>

                                    <input v-model="newMessage" type="text" placeholder="Type your message here..."
                                        class="flex-1 px-4 py-2 rounded-lg border transition-colors" :class="[
                                            themeClasses.cardBackground,
                                            themeClasses.border,
                                            isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                                        ]" :disabled="isTyping" @keydown.enter.prevent="sendMessage" />

                                    <button type="button" @click.prevent="openFilePicker" aria-label="Attach file"
                                        :class="[
                                            'inline-flex items-center justify-center px-3 py-2 ml-2 rounded-md transition-colors border focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 hover:bg-gray-100 hover:border-gray-200',
                                            isDarkMode
                                                ? 'bg-white hover:bg-gray-100 border-gray-200 text-gray-800'
                                                : 'bg-transparent text-gray-700'
                                        ]">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="1.8" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l8.49-8.49a3.5 3.5 0 014.95 4.95L10.83 17.83a2 2 0 01-2.83-2.83l8.49-8.49" />
                                        </svg>
                                    </button>

                                    <button type="submit" :disabled="!newMessage.trim() || isTyping"
                                        class="px-6 py-2 rounded-lg font-medium text-white transition-colors flex items-center"
                                        :class="newMessage.trim() && !isTyping
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-gray-400 cursor-not-allowed'">
                                        <svg v-if="isTyping" class="animate-spin -ml-1 mr-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        <svg v-else class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                        </svg>
                                        {{ isTyping ? 'Sending...' : 'Send' }}
                                    </button>
                                </form>

                                <!-- API Key Warning -->
                                <div v-if="!hasApiKey"
                                    class="mt-3 p-3 rounded-lg text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    <div class="flex items-center">
                                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        Please add your API key.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI Settings Modal -->
                <div v-if="showSettings" class="fixed inset-0 z-50 flex items-center justify-center">
                    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showSettings = false"></div>
                    <div :class="['relative w-full max-w-md mx-auto rounded-xl p-5 shadow-xl ring-1 ring-black/6 transform transition-all duration-200', isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900']">

                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-start gap-3">
                                <div :class="['p-2 rounded-md flex items-center justify-center', isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-600']">
                                    <!-- sliders icon -->
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <rect x="3" y="5" width="12" height="2" rx="1"></rect>
                                        <circle cx="18.5" cy="6" r="1.5"></circle>
                                        <rect x="3" y="11" width="18" height="2" rx="1"></rect>
                                        <circle cx="8" cy="12" r="1.5"></circle>
                                        <rect x="3" y="17" width="10" height="2" rx="1"></rect>
                                        <circle cx="17" cy="18" r="1.5"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold">AI Settings</h3>
                                    <p class="text-sm mt-0.5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Adjust model behavior and response style</p>
                                </div>
                            </div>

                            <button @click.prevent="showSettings = false" aria-label="Close settings" class="ml-3 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div v-if="isChatBusy" class="mb-3 p-3 rounded text-sm bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center space-x-3">
                            <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            <div>Settings are locked while AI is processing — changes will apply after the response completes.</div>
                        </div>

                        <div class="space-y-3">
                            <div :class="['p-3 rounded-lg border', isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
                                <label class="flex items-center justify-between text-sm font-medium mb-2">
                                    <span>Temperature</span>
                                    <span class="text-sm font-semibold">{{ stagedSettings.temperature.toFixed(2) }}</span>
                                </label>
                                <input type="range" min="0" max="2" step="0.01" v-model.number="stagedSettings.temperature" :disabled="isChatBusy" :class="['w-full h-2 rounded-lg bg-gray-200 accent-blue-500', isChatBusy ? 'opacity-60 cursor-not-allowed' : '']" />
                                <p class="text-xs mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Controls randomness. Lower = deterministic, higher = more creative.</p>
                            </div>

                            <div :class="['p-3 rounded-lg border', isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
                                <label class="flex items-center justify-between text-sm font-medium mb-2">
                                    <span>Max sources</span>
                                    <span class="text-sm font-semibold">{{ stagedSettings.maxSources }}</span>
                                </label>
                                <input type="range" min="0" max="10" step="1" v-model.number="stagedSettings.maxSources" :disabled="isChatBusy" :class="['w-full h-2 rounded-lg bg-gray-200', isChatBusy ? 'opacity-60 cursor-not-allowed' : '']" />
                                <p class="text-xs mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Limits number of external sources used by AI (0 = none).</p>
                            </div>

                            <div :class="['p-3 rounded-lg border', isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
                                <label class="block text-sm font-medium mb-2">Max tokens</label>
                                <input type="number" min="64" step="1" v-model.number="stagedSettings.maxTokens" :disabled="isChatBusy" :class="['w-full px-3 py-2 rounded-md border', isChatBusy ? 'opacity-60 cursor-not-allowed' : '']" />
                                <p class="text-xs mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Limit tokens used by model for each request (advisory).</p>
                            </div>

                            <div :class="['p-3 rounded-lg border', isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
                                <label class="flex items-center justify-between text-sm font-medium mb-2">
                                    <span>Top-p</span>
                                    <span class="text-sm font-semibold">{{ stagedSettings.topP.toFixed(2) }}</span>
                                </label>
                                <input type="range" min="0" max="1" step="0.01" v-model.number="stagedSettings.topP" :disabled="isChatBusy" :class="['w-full h-2 rounded-lg bg-gray-200', isChatBusy ? 'opacity-60 cursor-not-allowed' : '']" />
                                <p class="text-xs mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Alternative sampling parameter (complements temperature).</p>
                            </div>

                        </div>

                        <div class="mt-4 flex items-center justify-end space-x-2">
                            <button @click.prevent="resetAiSettings" :disabled="isChatBusy" :aria-disabled="isChatBusy" :title="isChatBusy ? 'Locked while AI is processing' : 'Reset'" class="px-4 py-2 rounded-md border text-sm inline-flex items-center justify-center" :class="[ isDarkMode ? 'border-gray-600 text-gray-100 hover:bg-gray-700' : 'border-gray-200 text-gray-800 hover:bg-gray-100', isChatBusy ? 'opacity-60 cursor-not-allowed' : '' ]">Reset</button>
                            <button @click.prevent="applyAiSettings" :disabled="isChatBusy" :aria-disabled="isChatBusy" :title="isChatBusy ? 'Locked while AI is processing' : 'Done'" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm inline-flex items-center justify-center text-sm" :class="isChatBusy ? 'opacity-60 cursor-not-allowed' : ''">Done</button>
                        </div>
                    </div>
                </div>

                <!-- Conversation History Card -->
                <div class="mt-6 max-w-9xl mx-auto">
                    <div class="rounded-lg shadow-sm border p-4"
                        :class="[themeClasses.cardBackground, themeClasses.border]">
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-lg font-semibold" :class="themeClasses.textPrimary">Conversation History
                            </h2>
                            <div class="flex items-center space-x-2">
                                <!-- prettier delete-all with label and inline confirmation -->
                                <div class="relative">
                                    <button
                                        @click.prevent="confirmDeleteAll = !confirmDeleteAll"
                                        :disabled="historyLoading || chatList.length === 0"
                                        :aria-disabled="historyLoading || chatList.length === 0"
                                        title="Delete all conversations"
                                        class="inline-flex items-center px-3 py-1 text-sm rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:from-red-600 hover:to-red-700 transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" />
                                        </svg>
                                        <span class="ml-2 hidden sm:inline font-medium">Delete All</span>
                                    </button>

                                    <div v-if="confirmDeleteAll" class="absolute right-0 mt-2 w-64 p-3 rounded-lg shadow-lg" :class="[themeClasses.cardBackground, themeClasses.border]">
                                        <div class="text-sm mb-2" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                                            <strong>Are you sure?</strong> This will permanently delete <span class="font-semibold">all</span> conversations.
                                        </div>
                                        <div class="flex justify-end space-x-2">
                                            <button @click.prevent="confirmDeleteAll = false" class="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200">Cancel</button>
                                            <button @click.prevent="deleteAllChats(true)" class="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">Yes, delete</button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    @click="toggleHistoryPanel"
                                    class="inline-flex items-center px-3 py-1 text-sm rounded-full transition-transform duration-150 ease-out transform active:scale-95 focus:outline-none btn-ux-fancy"
                                    :class="isDarkMode ? ['bg-white text-gray-900', themeClasses.border] : ['bg-blue-600 text-white', themeClasses.border]"
                                    aria-label="Toggle History"
                                >
                                    <svg v-if="showHistoryPanel" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke-linecap="round" stroke-linejoin="round" />
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M3 3l18 18" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke-linecap="round" stroke-linejoin="round" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span class="ml-2 font-medium">{{ showHistoryPanel ? 'Hide' : 'Show' }}</span>
                                </button>


                            </div>
                        </div>

                        <div v-if="showHistoryPanel">
                            <div v-if="historyLoading" class="text-sm text-gray-500">Loading…</div>
                            <div v-if="historyError" class="text-sm text-red-500">{{ historyError }}</div>
                            <div v-if="!historyLoading && chatList.length === 0" class="text-sm text-gray-500">No past
                                conversations.</div>
                            <ul class="space-y-2">
                                <li v-for="(chat, index) in chatList" :key="chat._id"
                                    class="flex items-start justify-between p-2 rounded border"
                                    :data-editing-id="parseId(chat._id || chat.id)"
                                    :class="[themeClasses.cardBackground, themeClasses.border]">
                                    <div class="flex-1 min-w-0">
                                        <div class="font-medium truncate">
                                            <template v-if="editingId === parseId(chat._id || chat.id)">
                                                <input
                                                    ref="titleInput"
                                                    v-model="editTitle"
                                                    @keydown.enter.prevent="saveEdit(chat)"
                                                    @keydown.esc.prevent="cancelEdit"
                                                    @click.stop
                                                    :class="[isDarkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-800 bg-white border-gray-200', 'w-full px-2 py-1 rounded border text-sm']"
                                                />
                                            </template>
                                            <template v-else>
                                                <span @dblclick="startEditing(chat)" :class="[isDarkMode ? 'text-white' : 'text-gray-900', 'cursor-text']">{{ chat.title || 'Untitled' }}</span>
                                            </template>
                                        </div>
                                        <div class="text-xs text-gray-500">{{ formatTime(chat.updatedAt ||
                                            chat.createdAt) }}</div>
                                        <div class="text-xs text-gray-600 truncate">{{ chatPreviews[index] || '' }}</div>
                                    </div>
                                    <div class="ml-3 flex-shrink-0 flex items-center space-x-2">
                                        <button @click.prevent="startEditing(chat)" title="Rename"
                                            class="px-2 py-1 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200 border">Rename</button>
                                        <button @click.prevent="loadChatIntoConversation(chat._id)"
                                            :disabled="isChatBusy" :aria-disabled="isChatBusy"
                                            :title="isChatBusy ? 'Finish current response before loading another chat' : 'Load'"
                                            :class="isChatBusy ? 'px-2 py-1 text-sm rounded bg-blue-400 text-white cursor-not-allowed' : 'px-2 py-1 text-sm rounded bg-blue-600 text-white'">Load</button>
                                        <button @click.prevent="deleteChat(chat._id)" title="Delete"
                                            class="px-2 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 border">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            </ul>

                            <div v-if="showPagination" class="mt-3 flex items-center justify-between text-sm">
                                <div class="text-gray-500">Showing page {{ historyPage }} of {{ totalPages }}</div>
                                <div class="flex items-center space-x-2">
                                    <button :disabled="historyPage <= 1" @click.prevent="loadChatList(historyPage - 1)" class="inline-flex items-center px-3 py-1 rounded border transition-transform duration-200 transform hover:-translate-x-1 hover:scale-105 active:scale-95 focus:outline-none" :class="[ isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-400' : 'bg-white text-gray-900 border-gray-200 focus:ring-blue-200', historyPage <= 1 ? 'opacity-50 cursor-not-allowed' : '' ]" aria-label="Previous page">
                                        <svg class="h-4 w-4 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.707 14.707a1 1 0 01-1.414 0L7.586 11l3.707-3.707a1 1 0 011.414 1.414L10.414 11l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                                        Prev
                                    </button>
                                    <select v-model.number="historyPage" @change.prevent="loadChatList(historyPage)" :class="isDarkMode ? 'px-2 py-1 border rounded bg-gray-700 text-white border-gray-600' : 'px-2 py-1 border rounded bg-white text-gray-800 border-gray-200'">
                                        <option v-for="p in historyPageOptions" :key="p" :value="p">Page {{ p }}</option>
                                    </select>
                                    <button :disabled="historyPage >= totalPages" @click.prevent="loadChatList(historyPage + 1)" class="inline-flex items-center px-3 py-1 rounded border transition-transform duration-200 transform hover:translate-x-1 hover:scale-105 active:scale-95 focus:outline-none" :class="[ isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-400' : 'bg-white text-gray-900 border-gray-200 focus:ring-blue-200', historyPage >= totalPages ? 'opacity-50 cursor-not-allowed' : '' ]" aria-label="Next page">
                                        Next
                                        <svg class="h-4 w-4 ml-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 5.293a1 1 0 011.414 0L12.414 9l-3.707 3.707a1 1 0 01-1.414-1.414L9.586 9 7.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import Sidebar from '../components/Side_and_Top_Bar.vue'
import { useTheme } from '../composables/useTheme'
import { sendMessageToGrok, sendMessageToGrokWithFile, fetchAichatList, fetchAichatById, createAichat, appendMessagesToAichat, deleteAichat, updateAichatTitle, updateAichatLastMessage } from '../services/grokService' 

const { isDarkMode, themeClasses } = useTheme()

// State
const sidebarHidden = ref(false)
const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const errorMessage = ref('')
const chatContainer = ref(null)
const selectedFile = ref(null)
const fileInput = ref(null)

const showHistoryPanel = ref(true)
const confirmDeleteAll = ref(false)
const chatList = ref([])
const historyLoading = ref(false)
const historyError = ref('')
const historyPage = ref(1)
const historyPerPage = ref(3)
const historyTotal = ref(0)
const chatId = ref(null)
const currentTitle = ref('New Conversation')

const parseId = (idCandidate) => {
    if (!idCandidate) return null
    if (typeof idCandidate === 'string') return idCandidate
    try {
        if (idCandidate.toString && typeof idCandidate.toString === 'function') return idCandidate.toString()
    } catch (e) { }
    if (idCandidate && typeof idCandidate === 'object' && idCandidate.$oid) return idCandidate.$oid
    return null
}

// Computed list of visible messages (filter out undefined and streaming assistant placeholders)
const visibleMessages = computed(() => {
    const base = Array.isArray(messages.value) ? messages.value : []
    return base.filter(m => m && !(m.role === 'assistant' && m.isStreaming))
})

// Computed
const hasApiKey = computed(() => {
    return import.meta.env.VITE_GROK_API_KEY && import.meta.env.VITE_GROK_API_KEY !== 'your_grok_api_key_here'
})

// Whether the chat UI is busy (sending or receiving a streaming response)
const isChatBusy = computed(() => {
    if (isTyping.value) return true
    try {
        return Array.isArray(messages.value) && messages.value.some(m => m && m.role === 'assistant' && m.isStreaming)
    } catch (e) { return false }
})

// Maximum number of sources to keep/use from AI responses. Can be overridden by VITE_MAX_SOURCES env var.
// Default maximum number of sources (can be overridden by env or user setting)
const DEFAULT_MAX_SOURCES = parseInt(import.meta.env.VITE_MAX_SOURCES || '0') || 5

// User-adjustable AI settings (persisted to localStorage)
import { reactive, watch } from 'vue'
const aiSettings = reactive({
    temperature: parseFloat(localStorage.getItem('aiSettings.temperature')) || 1.0,
    maxSources: parseInt(localStorage.getItem('aiSettings.maxSources')) || DEFAULT_MAX_SOURCES,
    maxTokens: parseInt(localStorage.getItem('aiSettings.maxTokens')) || 3000,
    topP: parseFloat(localStorage.getItem('aiSettings.topP')) || 1.0
})

// Staged settings are used inside the modal so changes are not applied until the user clicks Done
const stagedSettings = reactive({
    temperature: aiSettings.temperature,
    maxSources: aiSettings.maxSources,
    maxTokens: aiSettings.maxTokens,
    topP: aiSettings.topP
})

const showSettings = ref(false)

// When opening the modal, copy the persisted settings into the staged object
watch(showSettings, (val) => {
    if (val) {
        stagedSettings.temperature = aiSettings.temperature
        stagedSettings.maxSources = aiSettings.maxSources
        stagedSettings.maxTokens = aiSettings.maxTokens
        stagedSettings.topP = aiSettings.topP
    }
})

// Persist settings when changed
watch(() => ({ ...aiSettings }), (nv) => {
    try { localStorage.setItem('aiSettings', JSON.stringify(nv)) } catch (e) { /* ignore */ }
}, { deep: true })

// Reset staged settings (does not apply until user clicks Done)
const resetAiSettings = () => {
    stagedSettings.temperature = 1.0
    stagedSettings.maxSources = DEFAULT_MAX_SOURCES
    stagedSettings.maxTokens = 3000
    stagedSettings.topP = 1.0
}

// Apply staged settings to the real settings and close the modal
const applyAiSettings = () => {
    aiSettings.temperature = Number(stagedSettings.temperature) || 1.0
    aiSettings.maxSources = Number(stagedSettings.maxSources) >= 0 ? Number(stagedSettings.maxSources) : DEFAULT_MAX_SOURCES
    aiSettings.maxTokens = Math.max(64, Number(stagedSettings.maxTokens) || 3000)
    aiSettings.topP = Number(stagedSettings.topP) || 1.0
    showSettings.value = false
}

const finalMaxSources = computed(() => {
    const v = Number(aiSettings.maxSources)
    return Number.isInteger(v) && v >= 0 ? v : DEFAULT_MAX_SOURCES
})

// Pagination options for history selector
// Use the visible total (max of server-reported total and local cached chatList length)
const totalPages = computed(() => {
    const visibleTotal = Math.max(historyTotal.value || 0, (chatList.value || []).length || 0)
    return Math.max(1, Math.ceil(visibleTotal / historyPerPage.value))
})

const historyPageOptions = computed(() => {
    const total = totalPages.value
    return Array.from({ length: total }, (_, i) => i + 1)
})

// Show pagination when local chat list length exceeds per-page or when totalPages > 1
const showPagination = computed(() => {
    return ((chatList.value || []).length > historyPerPage.value) || (totalPages.value > 1)
})

// Ensure pagination reacts immediately when chatList changes locally
watch(() => (chatList.value || []).length, (len) => {
    try {
        // Keep historyTotal in sync with local list so totalPages updates
        if ((historyTotal.value || 0) < len) historyTotal.value = len
        // Clamp the current page within bounds
        if (historyPage.value > totalPages.value) historyPage.value = totalPages.value
    } catch (e) { console.warn('pagination watch error:', e) }
})

// Methods
const updateSidebarState = (state) => sidebarHidden.value = state

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const d = (timestamp instanceof Date) ? timestamp : new Date(timestamp)
    if (isNaN(d.getTime())) return ''
    const pad = (n) => (n < 10 ? '0' + n : '' + n)
    const year = d.getFullYear()
    const month = pad(d.getMonth() + 1)
    const day = pad(d.getDate())
    const hours = pad(d.getHours())
    const mins = pad(d.getMinutes())
    // Format: YYYY/MM/DD HH:mm
    return `${year}/${month}/${day} ${hours}:${mins}`
}

const toggleHistoryPanel = async () => {
    showHistoryPanel.value = !showHistoryPanel.value
    if (showHistoryPanel.value && chatList.value.length === 0) {
        await loadChatList(1)
    }
}

const loadChatList = async (page = 1) => {
    historyLoading.value = true
    historyError.value = ''
    try {
        const res = await fetchAichatList(page, historyPerPage.value)
        if (res && res.success) {
            chatList.value = res.data.chats || []
            historyPage.value = res.data.pagination.currentPage
            historyPerPage.value = res.data.pagination.perPage
            historyTotal.value = res.data.pagination.total
        } else {
            historyError.value = res && res.message ? res.message : 'Failed to load chats'
        }
    } catch (e) {
        historyError.value = e.message || 'Failed to load chats'
    } finally {
        historyLoading.value = false
    }
}

// Upsert a chat in the local chatList: update existing or insert at top
// options: { insertIfMissing: true } - when false, do not add a new item into the currently visible list; instead update totals
const upsertChatList = (id, { title, lastMessage, updatedAt } = {}, options = { insertIfMissing: true }) => {
    if (!id) return
    const idx = (chatList.value || []).findIndex(c => parseId(c._id || c.id) === id)
    const existing = idx >= 0 ? chatList.value[idx] : null
    const item = {
        _id: id,
        title: title || (existing && (existing.title || 'Untitled')) || 'Untitled',
        messages: existing && Array.isArray(existing.messages) ? existing.messages.slice() : [],
        updatedAt: updatedAt || new Date()
    }
    // update last message preview
    if (lastMessage) {
        // append a lightweight message preview if no messages array or last message differs
        if (!item.messages || item.messages.length === 0) item.messages = [{ content: lastMessage, timestamp: updatedAt || new Date(), role: 'assistant' }]
        else {
            const last = item.messages[item.messages.length - 1]
            if (!last || (last.content || '').toString().trim() !== (lastMessage || '').toString().trim()) {
                item.messages.push({ content: lastMessage, timestamp: updatedAt || new Date(), role: 'assistant' })
            }
        }
    }
    // remove existing
    if (idx >= 0) chatList.value.splice(idx, 1)

    // If already existed, always insert at top (refresh order). If missing, only insert if allowed by options
    if (idx >= 0 || (options && options.insertIfMissing !== false)) {
        chatList.value.unshift(item)
    } else {
        // We didn't insert locally (because it belongs on another page). Ensure historyTotal reflects server-side count
        try {
            historyTotal.value = Math.max(historyTotal.value || 0, (chatList.value || []).length + 1)
        } catch (e) { /* ignore */ }
    }
}

// Delete all conversations (with confirmation). This fetches all pages and deletes every chat found.
const deleteAllChats = async (skipConfirm = false) => {
    if (!skipConfirm) {
        if (!confirm('Are you sure you want to DELETE ALL conversations? This cannot be undone.')) return
    }
    confirmDeleteAll.value = false
    historyLoading.value = true
    historyError.value = ''
    try {
        // Ensure we have the total so we can iterate pages
        if (!(historyTotal.value > 0)) {
            await loadChatList(1)
        }
        const per = Math.max(1, historyPerPage.value)
        const total = Math.max(0, historyTotal.value)
        const pages = Math.ceil(total / per) || 1
        const ids = []
        for (let p = 1; p <= pages; p++) {
            const res = await fetchAichatList(p, per)
            if (res && res.success && Array.isArray(res.data.chats)) {
                res.data.chats.forEach(c => {
                    const id = parseId(c._id || c.id)
                    if (id) ids.push(id)
                })
            }
        }

        if (ids.length === 0) {
            historyLoading.value = false
            return
        }

        const results = await Promise.allSettled(ids.map(id => deleteAichat(id)))
        const failed = results.filter(r => r.status === 'rejected')
        if (failed.length > 0) {
            alert(`Failed to delete ${failed.length} of ${ids.length} conversations. Check console for details.`)
            console.error('Delete failures:', failed)
        }

        // If the current conversation was deleted, clear it
        try {
            if (chatId.value && ids.includes(chatId.value)) {
                chatId.value = null
                messages.value = []
                currentTitle.value = 'New Conversation'
            }
        } catch (e) { console.warn(e) }

        // Refresh the list
        chatList.value = []
        historyTotal.value = 0
        historyPage.value = 1
        await loadChatList(1)
    } catch (e) {
        console.error('deleteAllChats error:', e)
        historyError.value = e.message || 'Failed to delete conversations'
        alert(historyError.value)
    } finally {
        historyLoading.value = false
    }
}

const loadChatIntoConversation = async (id) => {
    if (!id) return
    // Prevent loading another conversation while a response is in progress
    if (isChatBusy.value) {
        try { alert('Please wait until the current response is finished before loading another conversation.') } catch(e) {}
        return
    }
    historyLoading.value = true
    historyError.value = ''
    try {
        const res = await fetchAichatById(id)
        if (res && res.success && res.data) {
            // replace current messages with loaded chat messages
            // Normalize role, clean content, and deduplicate immediate repeats which sometimes occur due to backend replication issues
            const normalizeRole = (r) => {
                try {
                    const s = (r || '').toString().toLowerCase()
                    if (s.startsWith('user')) return 'user'
                    if (s.startsWith('assistant') || s.startsWith('ai')) return 'assistant'
                    if (s.startsWith('system')) return 'system'
                } catch (e) { }
                return (r || '').toString()
            }

            const loaded = Array.isArray(res.data.messages) ? res.data.messages.map(m => ({
                role: normalizeRole(m.role),
                content: cleanContent(m.content || ''),
                timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
            })) : []

            // Remove immediate duplicate messages (same trimmed content) which caused double-rendering/side-swapped issues
            const deduped = []
            for (const msg of loaded) {
                const last = deduped.length ? deduped[deduped.length - 1] : null
                const lastContent = last ? (last.content || '').toString().trim() : null
                const thisContent = (msg.content || '').toString().trim()
                if (last && lastContent === thisContent) {
                    // skip duplicate
                    continue
                }
                deduped.push(msg)
            }

            messages.value = deduped

            // record the loaded chat id so future messages append to it
            chatId.value = parseId(res.data._id || res.data.id)
            // set current title to loaded chat title
            currentTitle.value = res.data.title || 'Untitled'
            // loaded messages replace the current conversation; do not inject a synthetic assistant message
            await scrollToBottom()
            // keep history panel visible after loading a conversation
            showHistoryPanel.value = true
        } else {
            historyError.value = res && res.message ? res.message : 'Failed to load chat'
        }
    } catch (e) {
        historyError.value = e.message || 'Failed to load chat'
    } finally {
        historyLoading.value = false
    }
}

const deleteChat = async (id) => {
    if (!id) return
    const ok = confirm('Delete this conversation? This cannot be undone.')
    if (!ok) return
    historyLoading.value = true
    historyError.value = ''
    try {
        const res = await deleteAichat(id)
        if (res && res.success) {
            // remove from local list
            chatList.value = (chatList.value || []).filter(c => parseId(c._id || c.id) !== parseId(id))
            // if the deleted chat is currently loaded, clear it
            if (parseId(chatId.value) === parseId(id)) {
                chatId.value = null
                messages.value = []
                currentTitle.value = 'New Conversation'
            }
        } else {
            historyError.value = res && res.message ? res.message : 'Failed to delete chat'
        }
    } catch (e) {
        historyError.value = e.message || 'Failed to delete chat'
    } finally {
        historyLoading.value = false
    }
}

// Inline rename state and handlers
const editingId = ref(null)
const editTitle = ref('')
const titleInput = ref(null)

const startEditing = async (chat) => {
    if (!chat) return
    const id = parseId(chat._id || chat.id)
    editingId.value = id
    editTitle.value = chat.title || 'Untitled'
    await nextTick()
    if (titleInput.value && typeof titleInput.value.focus === 'function') titleInput.value.focus()
    // add a document click listener to cancel editing when clicking outside
    document.addEventListener('click', handleDocumentClick)
}

const cancelEdit = () => {
    editingId.value = null
    editTitle.value = ''
    // remove document click listener
    try { document.removeEventListener('click', handleDocumentClick) } catch(e) {}
}

const saveEdit = async (chat) => {
    if (!chat) return
    const id = parseId(chat._id || chat.id)
    if (!id) return cancelEdit()
    const trimmed = (editTitle.value || '').trim()
    if (trimmed === '') {
        alert('Title cannot be empty')
        return
    }
    try {
        const res = await updateAichatTitle(id, trimmed)
        if (res && res.success) {
            const idx = (chatList.value || []).findIndex(c => parseId(c._id || c.id) === id)
            if (idx >= 0) chatList.value[idx].title = trimmed
            // if the currently loaded chat matches, update the displayed currentTitle
            if (parseId(chatId.value) === id) currentTitle.value = trimmed
            editingId.value = null
            editTitle.value = ''
            // remove document click listener
            try { document.removeEventListener('click', handleDocumentClick) } catch(e) {}
        } else {
            alert((res && res.message) ? res.message : 'Failed to rename conversation')
        }
    } catch (e) {
        console.error('Save edit error:', e)
        alert(e.message || 'Failed to rename conversation')
    }
}

const handleDocumentClick = (e) => {
    if (editingId.value === null) return
    const inputEl = titleInput.value
    if (!inputEl) return
    // if the click target is the input or inside it, do nothing
    if (inputEl === e.target || inputEl.contains && inputEl.contains(e.target)) return
    // also ignore clicks inside the chat list item corresponding to the editing id
    try {
        if (e.target && e.target.closest && e.target.closest(`[data-editing-id="${editingId.value}"]`)) return
    } catch (err) { }

    // If the title has been changed, save it on outside click; otherwise cancel editing
    try {
        const chat = (chatList.value || []).find(c => parseId(c._id || c.id) === editingId.value)
        if (!chat) return cancelEdit()
        const trimmed = (editTitle.value || '').trim()
        if (trimmed === '') {
            alert('Title cannot be empty')
            try { if (titleInput.value && typeof titleInput.value.focus === 'function') titleInput.value.focus() } catch(e) {}
            return
        }
        if (trimmed !== (chat.title || 'Untitled')) {
            // commit the change
            saveEdit(chat)
            return
        }
    } catch (err) { console.error('handleDocumentClick error:', err) }

    // otherwise cancel editing
    cancelEdit()
}

onBeforeUnmount(() => {
    try { document.removeEventListener('click', handleDocumentClick) } catch(e) {}
})

const cleanContent = (content) => {
    if (!content) return content
    let t = content.toString()
    // Normalize non-breaking spaces to normal spaces
    t = t.replace(/\u00A0/g, ' ')
    // Remove zero-width spaces and soft hyphens that can cause odd breaks
    t = t.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    // Normalize spacing around slashes (e.g. "5 km /h" -> "5 km/h")
    t = t.replace(/\s*\/\s*/g, '/')
    // Collapse multiple spaces/tabs into a single space (preserve newlines)
    t = t.replace(/[ \t]+/g, ' ')

    // Remove spaces inside contiguous digit sequences (e.g. "202 5" -> "2025")
    try { t = t.replace(/(?<=\d)\s+(?=\d)/g, '') } catch (err) { /* ignore lookbehind issues */ }

    // Collapse spaced acronym fragments like "H K T" or "HK T" -> "HKT"
    t = t.replace(/\b(?:[A-Z]{1,3}\s+){1,3}[A-Z]{1,3}\b/g, (m) => {
        const joined = m.replace(/\s+/g, '')
        return (joined.length >= 2 && joined.length <= 4) ? joined : m
    })

    // Trim leading/trailing spaces on each line while preserving line breaks
    t = t.split('\n').map(line => line.trim()).join('\n')
    return t
}

const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

// Helper: remove inline citation markdown like [[1]](url) or [1](url)
// Preserve spaces and newlines so text doesn't collapse into a single run-on line.
const stripCitations = (text) => {
    if (typeof text !== 'string') return text
    // Replace citations with a single space to preserve separation between tokens
    let t = text.replace(/\[\[\d+\]\]\([^)]*\)/g, ' ')
    t = t.replace(/\[\d+\]\([^)]*\)/g, ' ')
    // Remove leftover numeric bracket markers like [[1]] or [1]
    t = t.replace(/\[\[?\d+\]?\]/g, ' ')

    // Normalize multiple spaces/tabs to single space, but keep newlines intact
    t = t.replace(/[ \t]{2,}/g, ' ')

    // Trim spaces at start/end of each line while preserving line breaks
    t = t.split('\n').map(line => line.trim()).join('\n')

    return t
}

// Append text to aiMessage content safely, inserting a space if needed
const appendChunkContent = (aiMessage, text) => {
    if (!text) return
    // Deduplicate: normalize (remove punctuation, collapse whitespace) and skip if this chunk already appears
    const normalizeForDedupe = (s) => (s || '').toString().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
    const existing = normalizeForDedupe(aiMessage.content)
    const incoming = normalizeForDedupe(text)
    if (incoming && incoming.length > 6) {
        if (existing.endsWith(incoming) || existing.includes(incoming)) return
    }

    // If there's no whitespace between the last char and the first char, insert a space
    const lastChar = (aiMessage.content || '').slice(-1)
    const firstChar = (text || '').charAt(0)
    const needSpace = lastChar && firstChar && !/\s/.test(lastChar) && !/\s/.test(firstChar)

    if (needSpace) aiMessage.content += ' '
    aiMessage.content += text
}

// Format tool list, showing 'None' when empty or only falsy names
const formatToolList = (toolCalls) => {
    if (!toolCalls || toolCalls.length === 0) return 'None'
    const names = toolCalls.map(t => (t && t.toolName) || '').filter(Boolean)
    return names.length > 0 ? names.join(', ') : 'None'
}

// Get a short preview string for a chat, prefer lastMessage if available
const getChatPreview = (chat) => {
    if (!chat) return ''
    let msg = ''
    try {
        if (chat.lastMessage) {
            if (typeof chat.lastMessage === 'string') msg = chat.lastMessage
            else if (chat.lastMessage.content) msg = chat.lastMessage.content
            else if (typeof chat.lastMessage === 'object') {
                // prefer content property, fall back to text
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

// Precompute previews array for template rendering (avoids runtime function lookup issues)
const chatPreviews = computed(() => {
    return (chatList.value || []).map(c => getChatPreview(c))
})

const sendMessage = async () => {
    if (!newMessage.value.trim() || isTyping.value) return

    // prevent re-entrant sends (e.g. duplicate key+submit events)
    isTyping.value = true

    const userMessage = {
        role: 'user',
        content: newMessage.value.trim(),
        timestamp: new Date()
    }

    if (!Array.isArray(messages.value)) messages.value = []
    messages.value.push(userMessage)
    const messageToSend = newMessage.value.trim()
    newMessage.value = ''
    errorMessage.value = ''
    // keep selectedFileVal locally since we will clear the visible preview immediately
    const selectedFileVal = selectedFile.value
    // Clear the visible selected file so the preview disappears from the input area immediately
    selectedFile.value = null
    if (fileInput.value && 'value' in fileInput.value) fileInput.value.value = null

    // Persist user message: create chat if missing, otherwise append user message
    try {
        const serialMsg = { role: userMessage.role, content: userMessage.content, timestamp: (userMessage.timestamp instanceof Date) ? userMessage.timestamp.toISOString() : userMessage.timestamp }
        if (!chatId.value) {
            // create new chat with this initial message and WAIT for id so subsequent assistant append can use it
            try {
                const createRes = await createAichat('New Conversation', [serialMsg])
                if (createRes && createRes.success && createRes.data) {
                    const createdId = parseId(createRes.data.id || createRes.data._id)
                    if (createdId) {
                        chatId.value = createdId

                        // The server may place new chats on a different page. Compute the expected page for the new chat
                        try {
                            const currentLocalCount = (chatList.value || []).length || 0
                            const newTotal = Math.max(historyTotal.value || 0, currentLocalCount) + 1
                            historyTotal.value = newTotal
                            const per = Math.max(1, historyPerPage.value)
                            const newPage = Math.max(1, Math.ceil(newTotal / per))
                            historyPage.value = newPage
                            // load that page so the UI reflects server ordering immediately
                            await loadChatList(newPage)
                        } catch (e) {
                            console.warn('post-create pagination adjust error:', e)
                        }

                        // persist lastMessage to server (best effort)
                        try {
                            const res = await updateAichatLastMessage(createdId, { role: userMessage.role, content: userMessage.content, timestamp: userMessage.timestamp })
                            if (res && res.success === false) {
                                if (res.message && /nothing to update/i.test(res.message)) {
                                    console.info('updateAichatLastMessage create: nothing to update')
                                } else if (res.status === 400) {
                                    console.info('updateAichatLastMessage create returned 400:', res.message)
                                } else {
                                    console.warn('updateAichatLastMessage create error:', res)
                                }
                            }
                        } catch (e) { console.warn('updateAichatLastMessage create error throw:', e) }
                    }
                    currentTitle.value = createRes.data.title || 'New Conversation'
                }
            } catch (e) {
                // non-fatal: log and continue (we'll still send message to AI)
                console.warn('Failed to create chat on server:', e)
            }
        } else {
            try {
                await appendMessagesToAichat(chatId.value, [serialMsg])
                // update history list immediately with user message info, but only insert into the visible list when appropriate
                try {
                    const existsLocally = (chatList.value || []).findIndex(c => parseId(c._id || c.id) === chatId.value) >= 0
                    const shouldInsert = existsLocally || (historyPage.value === totalPages.value)
                    upsertChatList(chatId.value, { lastMessage: userMessage.content, updatedAt: userMessage.timestamp }, { insertIfMissing: shouldInsert })
                } catch (e) { console.warn('update local history error:', e) }
                // persist lastMessage field on server (best effort)
                try {
                    const res = await updateAichatLastMessage(chatId.value, { role: userMessage.role, content: userMessage.content, timestamp: userMessage.timestamp })
                    if (res && res.success === false) {
                        if (res.message && /nothing to update/i.test(res.message)) {
                            console.info('updateAichatLastMessage append user: nothing to update')
                        } else if (res.status === 400) {
                            console.info('updateAichatLastMessage append user returned 400:', res.message, res.body)
                        } else {
                            console.warn('updateAichatLastMessage append user error:', res)
                        }
                    }
                } catch (e) { console.warn('updateAichatLastMessage append user error throw:', e) }
            } catch (e) {
                if (e && /unauthor|no token/i.test(e.message || '')) {
                    console.info('Append user message failed: unauthenticated (ignored)')
                } else {
                    console.warn('Append user message failed:', e)
                }
            }
        }
    } catch (e) {
        console.warn('Persist user message error:', e)
    }

    await scrollToBottom()

    try {
        // Prepare conversation history for context
        const conversationHistory = messages.value.slice(-10) // Keep last 10 messages for context
            .filter(msg => msg.role !== 'system')
            .map(msg => ({
                role: msg.role,
                content: msg.content
            }))

        // We'll collect streaming chunks privately and only push the assistant message when complete.
        // use user-configured max sources
        // const MAX_SOURCES_TO_KEEP = 5 // keep this conservative; user can configure if needed
        let streamingBuffer = ''
        const streamingToolCalls = []
        const streamingSources = []
        // temporary object used with appendChunkContent to preserve spacing and de-duplication
        const tempAi = { content: '' }

        try {
            // shared chunk handler for streaming parts
            const handleChunk = (chunk) => {
                console.log('Received chunk in view:', chunk)
                if (chunk.type === 'text-delta') {
                    appendChunkContent(tempAi, stripCitations(chunk.text || ''))
                    streamingBuffer = tempAi.content
                } else if (chunk.type === 'tool-call') {
                    streamingToolCalls.push({ toolName: chunk.toolName, args: chunk.args })
                } else if (chunk.type === 'source') {
                    // limit number of sources and deduplicate
                    try {
                        if (chunk.url && streamingSources.length < finalMaxSources.value) {
                            const url = chunk.url.trim()
                            if (!streamingSources.includes(url)) streamingSources.push(url)
                        }
                    } catch (e) { console.warn('handleChunk source push error:', e) }
                }
            }

            let response = null
            // Build options from current applied AI settings
            const sdkOptions = {
                temperature: Number(aiSettings.temperature) || 1.0,
                maxTokens: Number(aiSettings.maxTokens) || 2500,
                topP: Number(aiSettings.topP) || 1.0,
                // Include requested maximum search results in providerOptions for xAI (maxSearchResults)
                providerOptions: {
                    xai: {
                        searchParameters: {
                            mode: 'auto',
                            returnCitations: true,
                            maxSearchResults: Number(finalMaxSources.value) || 0
                        }
                    }
                },
                // keep this for UI/backwards-compat
                maxSources: finalMaxSources.value
            }

            console.log('SDK options being passed to Grok:', sdkOptions)

            if (selectedFileVal) {
                response = await sendMessageToGrokWithFile(selectedFileVal, messageToSend, conversationHistory, handleChunk, sdkOptions)
            } else {
                response = await sendMessageToGrok(messageToSend, conversationHistory, handleChunk, sdkOptions)
            }

            console.log('Grok response:', response)

            // Determine final content: prefer streamingBuffer, fall back to response.message
            const urlLike = (str) => typeof str === 'string' && /^(https?:\/\/|www\.)/.test(str.trim())
            let finalContent = streamingBuffer && streamingBuffer.trim() !== '' ? streamingBuffer : ''
            if ((!finalContent || finalContent.trim() === '') && response && response.message) {
                const cleaned = stripCitations(response.message)
                if (cleaned && (!urlLike(cleaned) || streamingSources.length === 0)) {
                    finalContent = cleaned
                } else {
                    try {
                        if (response.message) {
                            const url = response.message.trim()
                            if (!streamingSources.includes(url) && streamingSources.length < finalMaxSources.value) streamingSources.push(url)
                        }
                    } catch (e) { console.warn('response message push error:', e) }
                }
            }

            const foundSourcesCount = streamingSources.length

            const aiMessage = {
                role: 'assistant',
                content: finalContent,
                timestamp: new Date(),
                toolCalls: response?.toolCalls?.length ? response.toolCalls : streamingToolCalls,
                hasTools: (response?.toolCalls?.length || streamingToolCalls.length) > 0,
                sources: streamingSources.slice(0, finalMaxSources.value),
                requestedSources: finalMaxSources.value,
                foundSources: foundSourcesCount,
                isStreaming: false
            }

                if (!Array.isArray(messages.value)) messages.value = []
                // avoid pushing duplicate assistant messages (same content as last assistant message)
                const last = messages.value.length ? messages.value[messages.value.length - 1] : null
                const incomingText = (aiMessage.content || '').toString().trim()
                if (!(last && last.role === 'assistant' && (last.content || '').toString().trim() === incomingText)) {
                    messages.value.push(aiMessage)
                } else {
                    // if duplicate, update timestamp/tool info on last message instead
                    last.timestamp = aiMessage.timestamp
                    last.toolCalls = aiMessage.toolCalls
                    last.hasTools = aiMessage.hasTools
                    last.sources = aiMessage.sources
                }

                // Update history list immediately to show AI message preview and updated time
                try {
                    if (chatId.value) {
                        try {
                            const existsLocally = (chatList.value || []).findIndex(c => parseId(c._id || c.id) === chatId.value) >= 0
                            const shouldInsert = existsLocally || (historyPage.value === totalPages.value)
                            upsertChatList(chatId.value, { lastMessage: aiMessage.content, updatedAt: aiMessage.timestamp, title: currentTitle.value }, { insertIfMissing: shouldInsert })
                        } catch (e) { console.warn('update local history error:', e) }
                    }
                } catch (e) { console.warn('upsertChatList error:', e) }

                // Persist assistant message by appending to the server chat
                // If chatId isn't available (earlier create failed), create the chat now including both user and assistant messages so AI output is stored.
                ;(async () => {
                    try {
                        const serialAssistant = {
                            role: aiMessage.role,
                            content: aiMessage.content,
                            timestamp: (aiMessage.timestamp instanceof Date) ? aiMessage.timestamp.toISOString() : aiMessage.timestamp
                        }

                        if (chatId.value) {
                            await appendMessagesToAichat(chatId.value, [serialAssistant])
                            // persist lastMessage field on server (best effort)
                            try {
                                const res = await updateAichatLastMessage(chatId.value, { role: aiMessage.role, content: aiMessage.content, timestamp: aiMessage.timestamp })
                                if (res && res.success === false) {
                                    if (res.message && /nothing to update/i.test(res.message)) {
                                        console.info('updateAichatLastMessage append assistant: nothing to update')
                                    } else if (res.status === 400) {
                                        console.info('updateAichatLastMessage append assistant returned 400:', res.message, res.body)
                                    } else {
                                        console.warn('updateAichatLastMessage append assistant error:', res)
                                    }
                                }
                            } catch (e) { console.warn('updateAichatLastMessage append assistant error throw:', e) }
                        } else {
                            const serialUser = {
                                role: userMessage.role,
                                content: userMessage.content || messageToSend,
                                timestamp: (userMessage.timestamp instanceof Date) ? userMessage.timestamp.toISOString() : userMessage.timestamp
                            }
                            try {
                                const createRes2 = await createAichat('New Conversation', [serialUser, serialAssistant])
                                if (createRes2 && createRes2.success && createRes2.data) {
                                    const createdId2 = parseId(createRes2.data.id || createRes2.data._id)
                                    if (createdId2) {
                                        chatId.value = createdId2
                                        upsertChatList(createdId2, { title: createRes2.data.title || 'New Conversation', lastMessage: aiMessage.content, updatedAt: aiMessage.timestamp })
                                        // persist lastMessage field on server for the newly created chat (best effort)
                                        try {
                                const res = await updateAichatLastMessage(createdId2, { role: aiMessage.role, content: aiMessage.content, timestamp: aiMessage.timestamp })
                                if (res && res.success === false) {
                                    if (res.message && /nothing to update/i.test(res.message)) {
                                        console.info('updateAichatLastMessage create2: nothing to update')
                                    } else if (res.status === 400) {
                                        console.info('updateAichatLastMessage create2 returned 400:', res.message, res.body)
                                    } else {
                                        console.warn('updateAichatLastMessage create2 error:', res)
                                    }
                                }
                            } catch (err) { console.warn('updateAichatLastMessage create2 error throw:', err) }
                                    }
                                    currentTitle.value = createRes2.data.title || 'New Conversation'
                                }
                            } catch (e2) {
                                console.warn('Failed to create chat with assistant message:', e2)
                            }
                        }
                            } catch (e) {
                        if (e && /unauthor|no token/i.test(e.message || '')) {
                            console.info('Persist assistant message failed: unauthenticated (ignored)')
                        } else {
                            console.warn('Persist assistant message failed:', e)
                        }
                    }
                })()

                // clear selected file after successful push
            selectedFile.value = null

        } catch (error) {
            console.error('Error sending message:', error)
            errorMessage.value = error.message || 'Failed to get AI response. Please try again.'
            // Do not insert a generic assistant error message into the chat UI; show `errorMessage` instead.
        }
        // also clear the hidden file input so the same file can be selected again
        if (fileInput.value && 'value' in fileInput.value) fileInput.value.value = null

    } catch (error) {
        console.error('API error:', error)
        errorMessage.value = error.message || 'Failed to send message. Please try again.'
        // Do not insert a generic assistant error message into the chat; rely on `errorMessage` shown above the input.
    } finally {
        isTyping.value = false
        await scrollToBottom()
    }
}

const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (f) selectedFile.value = f
}

const openFilePicker = () => {
    if (fileInput.value && typeof fileInput.value.click === 'function') fileInput.value.click()
}

const removeSelectedFile = () => {
    selectedFile.value = null
    if (fileInput.value && 'value' in fileInput.value) fileInput.value.value = null
}

const startNewChat = async () => {
    // Prevent starting a new chat if a message/response is in progress
    if (isChatBusy.value) {
        try { alert('Please wait until the current response is finished before starting a new chat.') } catch (e) {}
        return
    }
    // Start a fresh conversation immediately (no pop-up confirmation)
    messages.value = []
    chatId.value = null
    selectedFile.value = null
    errorMessage.value = ''
    currentTitle.value = 'New Conversation'
    await nextTick()
    await scrollToBottom()
}

onMounted(() => {
    // Check if API key is configured
    if (!hasApiKey.value) {
        console.warn('API key not configured. Please add VITE_GROK_API_KEY to your .env file.')
    }
    // Auto-load history when the panel is shown by default
    if (showHistoryPanel.value) {
        loadChatList(1).catch(e => console.warn('Failed to load chat history on mount:', e))
    }
})
</script>

<style scoped>
.animate-bounce {
    animation: bounce 1.4s infinite ease-in-out both;
}

.animate-bounce:nth-child(1) {
    animation-delay: -0.32s;
}

.animate-bounce:nth-child(2) {
    animation-delay: -0.16s;
}

/* Small click animation and consistent button look for history header */
.btn-ux {
    transition: transform 120ms ease, box-shadow 120ms ease;
}
.btn-ux:active {
    transform: scale(0.96);
    box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}

/* Fancy pill buttons for history header */
.btn-ux-fancy {
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    box-shadow: 0 6px 18px rgba(13, 42, 148, 0.06);
}
.btn-ux-fancy:hover {
    transform: translateY(-2px);
}
.btn-ux-fancy:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.18);
}
</style>