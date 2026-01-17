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
                    <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('aiSupport.title') }}</h1>
                    <p class="text-sm mt-2" :class="themeClasses.textSecondary">{{ $t('aiSupport.subtitle') }}
                    </p>
                </div>

                <!-- Chat Container -->
                <div class="max-w-9xl mx-auto">
                    <div class="relative">
                        <div class="flex items-center justify-between mb-2 gap-2">
                            <div v-if="showTitle" class="text-base sm:text-lg font-semibold truncate" :class="[themeClasses.textPrimary, isDarkMode ? 'text-white' : 'text-gray-900']">{{ currentTitle }}</div>
                            <div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0" :class="showTitle ? '' : 'ml-auto'">
                                <button @click.prevent="showSettings = !showSettings" :disabled="isChatBusy" :aria-disabled="isChatBusy" :title="isChatBusy ? $t('aiSupport.settingsDisabled') : $t('aiSupport.settings')" :class="['inline-flex items-center justify-center p-2 rounded-full text-sm transition-shadow duration-200 transform focus:outline-none focus:ring-2', isChatBusy ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : (isDarkMode ? 'bg-white text-gray-900 hover:shadow-md focus:ring-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300')]" :aria-label="$t('aiSupport.settings')" role="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-current transform transition-transform duration-200 hover:scale-105" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <rect x="3" y="5" width="12" height="2" rx="1"></rect>
                                        <circle cx="18.5" cy="6" r="1.5"></circle>

                                        <rect x="3" y="11" width="18" height="2" rx="1"></rect>
                                        <circle cx="8" cy="12" r="1.5"></circle>

                                        <rect x="3" y="17" width="10" height="2" rx="1"></rect>
                                        <circle cx="17" cy="18" r="1.5"></circle>
                                    </svg>
                                </button>

                                <button @click.prevent="startNewChat" :disabled="isChatBusy" :aria-disabled="isChatBusy" :title="isChatBusy ? $t('aiSupport.waitForResponse') : $t('aiSupport.newChat')" :class="isChatBusy ? 'px-3 py-1 text-sm rounded bg-green-400 text-white cursor-not-allowed' : 'px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700'">{{ $t('aiSupport.newChat') }}</button>
                            </div>
                        </div>
                        <div class="rounded-lg shadow-sm border" :class="[themeClasses.cardBackground, themeClasses.border]">
                            <!-- Chat Messages -->
                            <div ref="chatContainer" class="h-[60vh] sm:h-[70vh] lg:h-128 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4"
                                :class="isDarkMode ? 'bg-gray-900' : 'bg-gray-50'">
                                <!-- Welcome Message -->
                                <div v-if="visibleMessages.length === 0"
                                    class="flex items-center justify-center h-full">
                                    <div class="text-center py-8 max-w-2xl mx-auto">
                                        <div
                                            class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                        </div>
                                        <h3 class="text-lg font-semibold mb-2" :class="themeClasses.textPrimary">{{ $t('aiSupport.welcome') }}</h3>
                                        <p class="text-sm mb-6" :class="themeClasses.textSecondary">{{ $t('aiSupport.welcomeDesc') }}</p>
                                        
                                        <!-- Suggested Prompts -->
                                        <div v-if="suggestedPrompts.length > 0" class="mt-6">
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <button
                                                    v-for="(prompt, idx) in suggestedPrompts"
                                                    :key="idx"
                                                    @click="usePrompt(prompt)"
                                                    class="group text-left p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
                                                    :class="isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750' : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50'"
                                                >
                                                    <div class="flex items-start">
                                                        <svg class="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                        <span class="text-sm" :class="isDarkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'">{{ prompt }}</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Messages -->
                                <div v-for="(message, index) in visibleMessages" :key="index" :class="[
                                    'flex',
                                    message && message.role === 'user' ? 'justify-end' : 'justify-start'
                                ]">
                                    <div :class="[
                                        'max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg',
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : themeClasses.cardBackground + ' border ' + themeClasses.border + ' rounded-bl-none',
                                        (message.role !== 'user' && isDarkMode) ? 'text-white' : ''
                                    ]">
                                        <!-- File attachment indicator for user messages -->
                                        <div v-if="message.role === 'user' && message.fileName" class="mb-2 pb-2 border-b border-blue-400 flex items-center">
                                            <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span class="text-xs font-medium truncate">📎 {{ message.fileName }}</span>
                                        </div>
                                        <p :class="['text-sm whitespace-pre-wrap', message.role === 'user' ? 'break-words' : 'break-normal', (message.role !== 'user' && isDarkMode) ? 'text-white' : '']">{{
                                            cleanContent(message.content) || (message.role === 'assistant' ? '...' : '')
                                            }}</p>

                                        <!-- Streaming indicator -->
                                        <div v-if="message && message.isStreaming"
                                            class="inline-flex items-center ml-1">
                                            <span class="animate-pulse text-gray-500">▊</span>
                                        </div>

                                        <!-- Sources / Citations (shown separately, not as main content) -->
                                        <div v-if="message && message.sources && message.sources.length > 0"
                                            class="mt-3 pt-3 border-t overflow-hidden" :class="isDarkMode ? 'border-gray-600' : 'border-gray-300'">
                                            <div class="text-xs font-semibold mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                                                <svg class="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                {{ $t('aiSupport.sources') }}
                                            </div>
                                            <ul class="space-y-1.5">
                                                <li v-for="(source, si) in message.sources" :key="si" class="flex items-start break-words">
                                                    <span class="text-xs mr-1.5 mt-0.5 flex-shrink-0" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">•</span>
                                                    <a :href="source.url || source" 
                                                       target="_blank" 
                                                       rel="noopener noreferrer"
                                                       class="text-xs underline hover:no-underline flex-1 break-all overflow-wrap-anywhere"
                                                       :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                                                       style="word-break: break-word; overflow-wrap: anywhere;">
                                                        <span v-if="source.title" class="break-words">{{ source.title }}</span>
                                                        <span v-else class="break-all">{{ source.url || source }}</span>
                                                        <span v-if="source.title && source.url" class="text-gray-500 ml-1 whitespace-nowrap">({{ getDomain(source.url) }})</span>
                                                    </a>
                                                </li>
                                            </ul>
                                            <div v-if="typeof message.foundSources !== 'undefined' && typeof message.requestedSources !== 'undefined' && message.foundSources < message.requestedSources" 
                                                 class="text-xs mt-2 italic" 
                                                 :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">
                                                {{ message.foundSources }} of {{ message.requestedSources }} sources found
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
                                        'max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg rounded-bl-none',
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
                                            <span class="text-xs text-gray-500">{{ $t('aiSupport.thinking') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Chat Input -->
                            <div class="p-2 sm:p-4 border-t" :class="themeClasses.border">
                                <!-- Error Message -->
                                <div v-if="errorMessage"
                                    class="mb-3 p-3 rounded-lg text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                    {{ errorMessage }}
                                </div>

                                <input ref="fileInput" type="file" @change="handleFileChange"
                                    accept=".txt,.csv,.json,.md" class="hidden" />

                                <form @submit.prevent="sendMessage" class="flex items-center gap-1 sm:gap-2">
                                    <div v-if="selectedFile" class="flex-shrink-0">
                                        <div class="inline-flex items-center max-w-[120px] sm:max-w-xs rounded-full px-2 py-1 text-xs border"
                                            :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-gray-100 border-gray-200 text-gray-800'">
                                            <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="1.6" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l8.49-8.49a3.5 3.5 0 014.95 4.95L10.83 17.83a2 2 0 01-2.83-2.83l8.49-8.49" />
                                            </svg>
                                            <span class="ml-1 sm:ml-2 truncate text-xs">{{ selectedFile.name
                                                }}</span>
                                            <button type="button" @click.prevent="removeSelectedFile"
                                                class="ml-1 sm:ml-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 flex-shrink-0">✕</button>
                                        </div>
                                    </div>

                                    <input v-model="newMessage" type="text" :placeholder="$t('aiSupport.typingPlaceholder')"
                                        class="flex-1 min-w-0 px-3 py-2 rounded-lg border transition-colors text-sm" :class="[
                                            themeClasses.cardBackground,
                                            themeClasses.border,
                                            isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                                        ]" :disabled="isTyping" @keydown.enter.prevent="sendMessage" />

                                    <button type="button" @click.prevent="openFilePicker" :aria-label="$t('aiSupport.attachFile')"
                                        :class="[
                                            'flex-shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-blue-500/30',
                                            isDarkMode
                                                ? 'bg-white hover:bg-gray-100 border-gray-200 text-gray-800'
                                                : 'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300'
                                        ]">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="1.8" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l8.49-8.49a3.5 3.5 0 014.95 4.95L10.83 17.83a2 2 0 01-2.83-2.83l8.49-8.49" />
                                        </svg>
                                    </button>

                                    <button type="submit" :disabled="!newMessage.trim() || isTyping"
                                        class="flex-shrink-0 w-10 h-10 sm:w-auto sm:px-5 sm:py-2 rounded-lg font-medium text-white transition-colors inline-flex items-center justify-center"
                                        :class="newMessage.trim() && !isTyping
                                            ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                                            : 'bg-gray-400 cursor-not-allowed'">
                                        <svg v-if="isTyping" class="animate-spin h-5 w-5 sm:h-4 sm:w-4 sm:mr-2"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        <svg v-else class="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                        </svg>
                                        <span class="hidden sm:inline">{{ isTyping ? $t('aiSupport.sending') : $t('aiSupport.send') }}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI Settings Modal -->
                <div v-if="showSettings" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showSettings = false"></div>
                    <div :class="['relative w-full max-w-md mx-auto rounded-xl p-4 sm:p-5 shadow-xl ring-1 ring-black/6 transform transition-all duration-200 max-h-[90vh] overflow-y-auto', isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900']">

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
                                    <h3 class="text-lg font-semibold">{{ $t('aiSupport.settings') }}</h3>
                                    <p class="text-sm mt-0.5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ $t('aiSupport.settingsDescription') }}</p>
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
                            <div>{{ $t('aiSupport.settingsDisabled') }}</div>
                        </div>

                        <div class="space-y-3">
                            <div :class="['p-3 rounded-lg border', isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
                                <label class="flex items-center justify-between text-sm font-medium mb-2">
                                    <span>{{ $t('aiSupport.temperature') }}</span>
                                    <span class="text-sm font-semibold">{{ stagedSettings.temperature.toFixed(2) }}</span>
                                </label>
                                <input type="range" min="0" max="2" step="0.01" v-model.number="stagedSettings.temperature" :disabled="isChatBusy" :class="['w-full h-2 rounded-lg bg-gray-200 accent-blue-500', isChatBusy ? 'opacity-60 cursor-not-allowed' : '']" />
                                <p class="text-xs mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ $t('aiSupport.temperatureDesc') }}</p>
                            </div>

                            <div :class="['p-3 rounded-lg border', isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
                                <label class="flex items-center justify-between text-sm font-medium mb-2">
                                    <span>{{ $t('aiSupport.maxSources') }}</span>
                                    <span class="text-sm font-semibold">{{ stagedSettings.maxSources }}</span>
                                </label>
                                <input type="range" min="0" max="10" step="1" v-model.number="stagedSettings.maxSources" :disabled="isChatBusy" :class="['w-full h-2 rounded-lg bg-gray-200', isChatBusy ? 'opacity-60 cursor-not-allowed' : '']" />
                                <p class="text-xs mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ $t('aiSupport.maxSourcesDesc') }}</p>
                            </div>

                            <div :class="['p-3 rounded-lg border', isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
                                <label class="block text-sm font-medium mb-2">{{ $t('aiSupport.maxTokens') }}</label>
                                <input type="number" min="64" step="1" v-model.number="stagedSettings.maxTokens" :disabled="isChatBusy" :class="['w-full px-3 py-2 rounded-md border', isChatBusy ? 'opacity-60 cursor-not-allowed' : '']" />
                                <p class="text-xs mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ $t('aiSupport.maxTokensDesc') }}</p>
                            </div>

                            <div :class="['p-3 rounded-lg border', isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
                                <label class="flex items-center justify-between text-sm font-medium mb-2">
                                    <span>{{ $t('aiSupport.topP') }}</span>
                                    <span class="text-sm font-semibold">{{ stagedSettings.topP.toFixed(2) }}</span>
                                </label>
                                <input type="range" min="0" max="1" step="0.01" v-model.number="stagedSettings.topP" :disabled="isChatBusy" :class="['w-full h-2 rounded-lg bg-gray-200', isChatBusy ? 'opacity-60 cursor-not-allowed' : '']" />
                                <p class="text-xs mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ $t('aiSupport.topPDesc') }}</p>
                            </div>

                        </div>

                        <div class="mt-4 flex items-center justify-end space-x-2">
                            <button @click.prevent="resetAiSettings" :disabled="isChatBusy" :aria-disabled="isChatBusy" :title="isChatBusy ? $t('aiSupport.settingsDisabled') : $t('aiSupport.reset')" class="px-4 py-2 rounded-md border text-sm inline-flex items-center justify-center" :class="[ isDarkMode ? 'border-gray-600 text-gray-100 hover:bg-gray-700' : 'border-gray-200 text-gray-800 hover:bg-gray-100', isChatBusy ? 'opacity-60 cursor-not-allowed' : '' ]">{{ $t('aiSupport.reset') }}</button>
                            <button @click.prevent="applyAiSettings" :disabled="isChatBusy" :aria-disabled="isChatBusy" :title="isChatBusy ? $t('aiSupport.settingsDisabled') : $t('aiSupport.done')" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm inline-flex items-center justify-center text-sm" :class="isChatBusy ? 'opacity-60 cursor-not-allowed' : ''">{{ $t('aiSupport.done') }}</button>
                        </div>
                    </div>
                </div>

                <!-- Conversation History Card -->
                <div class="mt-6 max-w-9xl mx-auto">
                    <div class="rounded-lg shadow-sm border p-4"
                        :class="[themeClasses.cardBackground, themeClasses.border]">
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ $t('aiSupport.conversationHistory') }}
                            </h2>
                            <div class="flex items-center space-x-2">
                                <!-- prettier delete-all with label and inline confirmation -->
                                <div class="relative">
                                    <button
                                        @click.prevent="confirmDeleteAll = !confirmDeleteAll"
                                        :disabled="historyLoading || chatList.length === 0 || isChatBusy"
                                        :aria-disabled="historyLoading || chatList.length === 0 || isChatBusy"
                                        :title="isChatBusy ? $t('aiSupport.waitForResponse') : $t('aiSupport.deleteAll')"
                                        class="inline-flex items-center px-3 py-1 text-sm rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:from-red-600 hover:to-red-700 transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" />
                                        </svg>
                                        <span class="ml-2 hidden sm:inline font-medium">{{ $t('aiSupport.deleteAll') }}</span>
                                    </button>

                                    <!-- Backdrop for click-outside -->
                                    <div v-if="confirmDeleteAll" 
                                         @click.self="confirmDeleteAll = false" 
                                         class="fixed inset-0 z-40" 
                                         style="background: transparent;"></div>

                                    <div v-if="confirmDeleteAll" 
                                         @click.stop
                                         class="absolute right-0 mt-2 w-64 p-3 rounded-lg shadow-lg z-50" 
                                         :class="[themeClasses.cardBackground, themeClasses.border]">
                                        <div class="text-sm mb-2" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                                            {{ $t('aiSupport.deleteAllConfirm') }}
                                        </div>
                                        <div class="flex justify-end space-x-2">
                                            <button @click.prevent="confirmDeleteAll = false" class="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200">{{ $t('common.cancel') }}</button>
                                            <button @click.prevent="deleteAllChats(true)" class="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">{{ $t('aiSupport.yesDelete') }}</button>
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
                                    <span class="ml-2 font-medium">{{ showHistoryPanel ? $t('aiSupport.hide') : $t('aiSupport.show') }}</span>
                                </button>


                            </div>
                        </div>

                        <div v-if="showHistoryPanel">
                            <div v-if="historyLoading" class="text-sm text-gray-500">{{ $t('common.loading') }}</div>
                            <div v-if="historyError" class="text-sm text-red-500">{{ historyError }}</div>
                            <div v-if="!historyLoading && chatList.length === 0" class="text-sm text-gray-500">{{ $t('aiSupport.noPastConversations') }}</div>
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
                                        <div class="text-xs truncate" :class="isDarkMode ? 'text-white' : 'text-gray-600'">{{ chatPreviews[index] || '' }}</div>
                                    </div>
                                    <div class="ml-3 flex-shrink-0 flex items-center space-x-2">
                                        <button @click.prevent="startEditing(chat)" :title="$t('aiSupport.rename')"
                                            class="px-2 py-1 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200 border">{{$t('aiSupport.rename')}}</button>
                                        <button @click.prevent="loadChatIntoConversation(chat._id)"
                                            :disabled="isChatBusy" :aria-disabled="isChatBusy"
                                            :title="isChatBusy ? 'Finish current response before loading another chat' : 'Load'"
                                            :class="isChatBusy ? 'px-2 py-1 text-sm rounded bg-blue-400 text-white cursor-not-allowed' : 'px-2 py-1 text-sm rounded bg-blue-600 text-white'">Load</button>
                                        <div class="relative">
                                            <button @click.prevent="confirmDeleteId = parseId(chat._id || chat.id)" 
                                                :disabled="isChatBusy" 
                                                :aria-disabled="isChatBusy"
                                                :title="isChatBusy ? $t('aiSupport.waitForResponse') : $t('common.delete')"
                                                :class="isChatBusy ? 'px-2 py-1 text-sm rounded bg-red-100 text-red-400 cursor-not-allowed border opacity-50' : 'px-2 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 border'">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            
                                            <!-- Backdrop for click-outside -->
                                            <div v-if="confirmDeleteId === parseId(chat._id || chat.id)" 
                                                 @click.self="confirmDeleteId = null" 
                                                 class="fixed inset-0 z-40" 
                                                 style="background: transparent;"></div>

                                            <!-- Confirmation popup for single delete -->
                                            <div v-if="confirmDeleteId === parseId(chat._id || chat.id)" 
                                                 @click.stop
                                                 class="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg shadow-lg z-50" 
                                                 :class="[themeClasses.cardBackground, themeClasses.border]">
                                                <div class="text-sm mb-2" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                                                    {{ $t('aiSupport.deleteConversationConfirm') }}
                                                </div>
                                                <div class="flex justify-end space-x-2">
                                                    <button @click.prevent="confirmDeleteId = null" 
                                                            class="px-3 py-1 text-sm rounded" 
                                                            :class="isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'">{{ $t('common.cancel') }}</button>
                                                    <button @click.prevent="deleteChat(chat._id, true)" 
                                                            class="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">{{ $t('aiSupport.delete') }}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <div v-if="showPagination" class="mt-3 flex items-center justify-between text-sm">
                                <div class="text-gray-500">{{ $t('aiSupport.showingPage', { page: historyPage, total: totalPages }) }}</div>
                                <div class="flex items-center space-x-2">
                                    <button :disabled="historyPage <= 1" @click.prevent="loadChatList(historyPage - 1)" class="inline-flex items-center px-3 py-1 rounded border transition-transform duration-200 transform hover:-translate-x-1 hover:scale-105 active:scale-95 focus:outline-none" :class="[ isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-400' : 'bg-white text-gray-900 border-gray-200 focus:ring-blue-200', historyPage <= 1 ? 'opacity-50 cursor-not-allowed' : '' ]" :aria-label="$t('aiSupport.prev')">
                                        <svg class="h-4 w-4 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.707 14.707a1 1 0 01-1.414 0L7.586 11l3.707-3.707a1 1 0 011.414 1.414L10.414 11l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                                        {{ $t('aiSupport.prev') }}
                                    </button>
                                    <select v-model.number="historyPage" @change.prevent="loadChatList(historyPage)" :class="isDarkMode ? 'px-2 py-1 border rounded bg-gray-700 text-white border-gray-600' : 'px-2 py-1 border rounded bg-white text-gray-800 border-gray-200'">
                                        <option v-for="p in historyPageOptions" :key="p" :value="p">{{ $t('aiSupport.pageLabel', { p }) }}</option>
                                    </select>
                                    <button :disabled="historyPage >= totalPages" @click.prevent="loadChatList(historyPage + 1)" class="inline-flex items-center px-3 py-1 rounded border transition-transform duration-200 transform hover:translate-x-1 hover:scale-105 active:scale-95 focus:outline-none" :class="[ isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-400' : 'bg-white text-gray-900 border-gray-200 focus:ring-blue-200', historyPage >= totalPages ? 'opacity-50 cursor-not-allowed' : '' ]" :aria-label="$t('aiSupport.next')">
                                        {{ $t('aiSupport.next') }}
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
import { useI18n } from 'vue-i18n'
import { getCachedBmiData, getCachedHeartRateDates, getCachedStressDates, setCachedBmiData, setCachedHeartRateDates, setCachedStressDates } from '../stores/userStore'
import { getHeartRateRecords, getHeartRateDates } from '../services/heartRateService'
import { getStressStats } from '../services/stressService' 
import { getLatestBMIRecord } from '../services/bmiService' 

const { isDarkMode, themeClasses } = useTheme()
const { t } = useI18n()

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
const confirmDeleteId = ref(null)
const chatList = ref([])
const historyLoading = ref(false)
const historyError = ref('')
const historyPage = ref(1)
const historyPerPage = ref(3)
const historyTotal = ref(0)
const chatId = ref(null)
const currentTitle = ref(t('aiSupport.newConversation'))
const showTitle = ref(false)

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

// Generate suggested prompts based on user health data
const suggestedPrompts = computed(() => {
    const bmiData = getCachedBmiData()
    const heartRateDates = getCachedHeartRateDates()
    const stressDates = getCachedStressDates()
    
    // Only show prompts if there's actual health data available
    const hasBmiData = bmiData && bmiData.bmi
    const hasHeartRateData = heartRateDates && heartRateDates.length > 0
    const hasStressData = stressDates && stressDates.length > 0
    
    if (!hasBmiData && !hasHeartRateData && !hasStressData) {
        return [] // No prompts if no health data
    }
    
    const bmiPrompts = []
    const heartRatePrompts = []
    const stressPrompts = []
    
    // Generate 2 BMI-related prompts if BMI data exists
    if (hasBmiData) {
        const bmi = parseFloat(bmiData.bmi)
        
        if (bmi < 18.5) {
            bmiPrompts.push(t('aiSupport.prompts.bmi.underweight.0'))
            bmiPrompts.push(t('aiSupport.prompts.bmi.underweight.1'))
        } else if (bmi >= 18.5 && bmi < 25) {
            bmiPrompts.push(t('aiSupport.prompts.bmi.normal.0'))
            bmiPrompts.push(t('aiSupport.prompts.bmi.normal.1'))
        } else if (bmi >= 25 && bmi < 30) {
            bmiPrompts.push(t('aiSupport.prompts.bmi.overweight.0'))
            bmiPrompts.push(t('aiSupport.prompts.bmi.overweight.1'))
        } else if (bmi >= 30) {
            bmiPrompts.push(t('aiSupport.prompts.bmi.obese.0'))
            bmiPrompts.push(t('aiSupport.prompts.bmi.obese.1'))
        }
    }
    
    // Generate 2 heart rate-related prompts if heart rate data exists
    if (hasHeartRateData) {
        heartRatePrompts.push(t('aiSupport.prompts.heartRate.0'))
        heartRatePrompts.push(t('aiSupport.prompts.heartRate.1'))
    }

    // Generate 2 stress-related prompts if stress data exists
    if (hasStressData) {
        stressPrompts.push(t('aiSupport.prompts.stress.0'))
        stressPrompts.push(t('aiSupport.prompts.stress.1'))
    }
    
    // Combine prompts: BMI + Heart Rate + Stress (max 4 shown)
    const allPrompts = [...bmiPrompts, ...heartRatePrompts, ...stressPrompts]
    
    return allPrompts.slice(0, 6) // Show max 6 prompts
})

// Use a suggested prompt
const usePrompt = async (prompt) => {
    if (isChatBusy.value) return
    
    // Determine if this is a heart rate prompt, stress prompt, or BMI prompt
    const heartRateKeywords = ['heart rate', 'cardiovascular', 'resting heart', '心率', '靜止心率', '心跳']
    const stressKeywords = ['stress', 'stress score', 'pressure', 'tension', '壓力', '壓力指數']
    const isHeartRatePrompt = heartRateKeywords.some(keyword => 
        prompt.toLowerCase().includes(keyword) || prompt.includes(keyword)
    )
    const isStressPrompt = stressKeywords.some(keyword => 
        prompt.toLowerCase().includes(keyword) || prompt.includes(keyword)
    )
    
    // Build health data context to append to the prompt
    const healthContext = []
    const bmiData = getCachedBmiData()
    const heartRateDates = getCachedHeartRateDates()
    const stressDates = getCachedStressDates()
    
    // small helper to compute heart rate stats
    const computeHeartStats = (hourly) => {
        const hrs = (hourly || []).filter(h => h.avg > 0)
        if (!hrs.length) return { resting: 0, min: 0, max: 0, avg: 0 }
        const avgs = hrs.map(h => h.avg)
        const min = Math.min(...avgs)
        const max = Math.max(...avgs)
        const avg = Math.round(avgs.reduce((s, v) => s + v, 0) / avgs.length)
        const resting = Math.min(...hrs.map(h => h.min))
        return { resting, min, max, avg }
    }

    if (isHeartRatePrompt) {
        // For heart rate prompts, fetch and include all heart rate statistics
        if (heartRateDates && heartRateDates.length > 0) {
            try {
                const response = await getHeartRateRecords({ date: heartRateDates[0] })
                if (response.success && response.data.records.length > 0) {
                    const record = response.data.records[0]
                    const stats = computeHeartStats(record.hourlyData)
                    // Include all heart rate metrics
                    healthContext.push(`Resting Heart Rate: ${stats.resting} bpm`)
                    healthContext.push(`Max Heart Rate: ${stats.max} bpm`)
                    healthContext.push(`Min Heart Rate: ${stats.min} bpm`)
                    healthContext.push(`Average Heart Rate: ${stats.avg} bpm`)
                }
            } catch (error) {
                console.error('Failed to fetch heart rate stats:', error)
            }
        }
    } else if (isStressPrompt) {
        // For stress prompts, fetch and include basic stress statistics
        if (stressDates && stressDates.length > 0) {
            try {
                const response = await getStressStats({ date: stressDates[0] })
                if (response && response.success && response.data) {
                    // Support different API shapes (stats inside data.stats or directly under data)
                    const s = response.data.stats || response.data || {}
                    const sMin = s.min ?? s.minValue ?? s.minStress ?? null
                    const sMax = s.max ?? s.maxValue ?? s.maxStress ?? null
                    const sAvg = s.avg ?? s.average ?? s.mean ?? null

                    if (sAvg !== null && typeof sAvg !== 'undefined') healthContext.push(`Average Stress: ${sAvg} ${t('home.stress.unit')}`)
                    if (sMax !== null && typeof sMax !== 'undefined') healthContext.push(`Max Stress: ${sMax} ${t('home.stress.unit')}`)
                    if (sMin !== null && typeof sMin !== 'undefined') healthContext.push(`Min Stress: ${sMin} ${t('home.stress.unit')}`)
                }
            } catch (error) {
                console.error('Failed to fetch stress stats:', error)
            }
        }
    } else {
        // For BMI prompts, only include BMI data
        if (bmiData && bmiData.bmi) {
            healthContext.push(`BMI: ${bmiData.bmi}`)
            if (bmiData.weight) healthContext.push(`Weight: ${bmiData.weight}kg`)
            if (bmiData.height) healthContext.push(`Height: ${bmiData.height}cm`)
        }
    }
    
    // For stress prompts, send only the suggested prompt (no appended data)
    const messageWithData = isStressPrompt
        ? prompt
        : (healthContext.length > 0
            ? `${prompt}\n\nMy data: ${healthContext.join(', ')}`
            : prompt)

    newMessage.value = messageWithData
    // Send the message immediately
    await sendMessage()
}

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
const totalPages = computed(() => {
    const total = historyTotal.value || 0
    const perPage = historyPerPage.value || 3
    return Math.max(1, Math.ceil(total / perPage))
})

const historyPageOptions = computed(() => {
    const total = totalPages.value
    return Array.from({ length: total }, (_, i) => i + 1)
})

// Show pagination when local chat list length exceeds per-page or when totalPages > 1
const showPagination = computed(() => {
    return ((chatList.value || []).length > historyPerPage.value) || (totalPages.value > 1)
})

// Ensure pagination reacts immediately when historyTotal changes
watch(historyTotal, () => {
    try {
        // Clamp the current page within bounds
        if (historyPage.value > totalPages.value) historyPage.value = totalPages.value
    } catch (e) { console.warn('pagination watch error:', e) }
})

// Methods
const updateSidebarState = (state) => sidebarHidden.value = state

const getDomain = (url) => {
    try {
        const urlObj = new URL(url)
        return urlObj.hostname.replace(/^www\./, '')
    } catch (e) {
        return url
    }
}

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

// Delete all conversations (with confirmation). This fetches all pages and deletes every chat found.
const deleteAllChats = async (skipConfirm = false) => {
    if (!skipConfirm) {
        if (!confirm(t('aiSupport.deleteAllConfirm'))) return
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
        try { alert(t('aiSupport.waitForResponse')) } catch(e) {}
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
                timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
                toolCalls: m.toolCalls || [],
                sources: m.sources || [],
                foundSources: m.foundSources,
                requestedSources: m.requestedSources
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
            showTitle.value = true
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

const deleteChat = async (id, skipConfirm = false) => {
    if (!id) return
    if (!skipConfirm) {
        // Should not reach here anymore since we use custom popup
        const ok = confirm(t('aiSupport.deleteConversationConfirm'))
        if (!ok) return
    }
    confirmDeleteId.value = null // Close the confirmation popup
    historyLoading.value = true
    historyError.value = ''
    try {
        const res = await deleteAichat(id)
        if (res && res.success) {
            // Decrement total count
            historyTotal.value = Math.max(0, (historyTotal.value || 0) - 1)
            
            // Remove from local list
            chatList.value = (chatList.value || []).filter(c => parseId(c._id || c.id) !== parseId(id))
            
            // If current page becomes empty and we're not on page 1, go to previous page
            if (chatList.value.length === 0 && historyPage.value > 1) {
                historyPage.value = historyPage.value - 1
                await loadChatList(historyPage.value)
            } else {
                // Reload current page to show updated list
                await loadChatList(historyPage.value)
            }
            
            // If the deleted chat is currently loaded, clear it
            if (parseId(chatId.value) === parseId(id)) {
                chatId.value = null
                messages.value = []
                currentTitle.value = 'New Conversation'
                showTitle.value = false
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
    
    // Remove AI function call patterns (e.g., ai:function _call name="browse_page"><parameter name="url">...</>)
    // This removes XML-like AI function call syntax that shouldn't be displayed to users
    // Remove complete parameter tags with content: <parameter name="...">...</parameter>
    t = t.replace(/<\s*parameter\s+name\s*=\s*[^>]*>[\s\S]*?<\s*\/\s*parameter\s*>/gi, '')
    // Remove opening parameter tags
    t = t.replace(/<\s*parameter\s+name\s*=\s*[^>]*>/gi, '')
    // Remove closing tags: </parameter>, </x>, </x ai _call >, </xai:function_call>, etc
    t = t.replace(/<\s*\/\s*parameter\s*>/gi, '')
    t = t.replace(/<\s*\/\s*x\s*>/gi, '')
    t = t.replace(/<\s*\/\s*x\s*ai\s*_?\s*call\s*>/gi, '')
    t = t.replace(/<\s*\/\s*xai\s*:\s*function\s*_?\s*call\s*>/gi, '')
    // Remove ai:function call patterns (handle spaces within the pattern)
    t = t.replace(/ai\s*:\s*function\s*_?\s*call\s+[^>]*>/gi, '')
    t = t.replace(/<\s*ai\s*:\s*function\s*_?\s*call[^>]*>/gi, '')
    t = t.replace(/<\s*xai\s*:\s*function\s*_?\s*call[^>]*>/gi, '')
    // Remove incomplete or malformed function call tags
    t = t.replace(/ai\s*:\s*function\s+_?\s*call\s+name\s*=\s*[^>]*/gi, '')
    
    // Normalize non-breaking spaces to normal spaces
    t = t.replace(/\u00A0/g, ' ')
    
    // Remove zero-width spaces and soft hyphens that can cause odd breaks
    t = t.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    
    // Collapse multiple spaces/tabs into a single space (preserve newlines)
    t = t.replace(/[ \t]+/g, ' ')
    
    // Remove spaces before punctuation (comma, period, exclamation, question, colon, semicolon)
    t = t.replace(/\s+([,.!?:;])/g, '$1')
    
    // Fix spacing around degree symbols (e.g. "19 °C" -> "19°C")
    t = t.replace(/\s*(°)\s*/g, '$1')
    
    // Remove spaces inside numbers (e.g. "202 6" -> "2026")
    t = t.replace(/(\d)\s+(\d)/g, '$1$2')
    
    // Fix hyphens with spaces (e.g. "real -time" -> "real-time", "10 - 20" -> "10-20")
    t = t.replace(/\s+-\s+/g, '-')
    t = t.replace(/(\w)\s+-/g, '$1-')
    t = t.replace(/-\s+(\w)/g, '-$1')
    
    // Remove spaces around slashes (e.g. "km /h" -> "km/h")
    t = t.replace(/\s*\/\s*/g, '/')
    
    // Fix common domain spacing issues (e.g. "h ko.gov.hk" -> "hko.gov.hk")
    t = t.replace(/\b([a-z])\s+([a-z]{1,3})\.(gov|com|org|net|edu)/gi, '$1$2.$3')
    
    // Fix possessive apostrophes with spaces (e.g. "Hong Kong 's" -> "Hong Kong's")
    t = t.replace(/\s+'/g, "'")
    t = t.replace(/'\s+([st])\b/g, "'$1")
    
    // Trim leading/trailing spaces on each line while preserving line breaks
    t = t.split('\n').map(line => line.trim()).join('\n')
    
    // Remove leading and trailing blank lines
    t = t.replace(/^\s*\n+/, '').replace(/\n+\s*$/, '')
    
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
        timestamp: new Date(),
        fileName: selectedFile.value ? selectedFile.value.name : null
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
        const serialMsg = { 
            role: userMessage.role, 
            content: userMessage.content, 
            timestamp: (userMessage.timestamp instanceof Date) ? userMessage.timestamp.toISOString() : userMessage.timestamp,
            toolCalls: userMessage.toolCalls || [],
            sources: userMessage.sources || []
        }
        // Double-check: only create new chat if chatId is truly null/empty
        const currentChatId = chatId.value
        if (!currentChatId || currentChatId === null || currentChatId === undefined || currentChatId === '') {
            // create new chat with this initial message and WAIT for id so subsequent assistant append can use it
            try {
                const createRes = await createAichat('New Conversation', [serialMsg])
                if (createRes && createRes.success && createRes.data) {
                    const createdId = parseId(createRes.data.id || createRes.data._id)
                    if (createdId) {
                        chatId.value = createdId

                        // Update total count for pagination and navigate to page 1 to show the new conversation
                        try {
                            historyTotal.value = (historyTotal.value || 0) + 1
                            // Navigate to page 1 to show the new conversation
                            historyPage.value = 1
                            await loadChatList(1)
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
                    showTitle.value = true
                }
            } catch (e) {
                // non-fatal: log and continue (we'll still send message to AI)
                console.warn('Failed to create chat on server:', e)
            }
        } else {
            try {
                await appendMessagesToAichat(chatId.value, [serialMsg])
                // Navigate to page 1 and reload to ensure the updated conversation is visible
                try {
                    historyPage.value = 1
                    await loadChatList(1)
                } catch (e) { console.warn('reload chat list after user message error:', e) }
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
                            const title = chunk.title || url
                            // Check if this URL already exists
                            if (!streamingSources.find(s => s.url === url)) {
                                streamingSources.push({ url, title })
                            }
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

            if (selectedFileVal) {
                response = await sendMessageToGrokWithFile(selectedFileVal, messageToSend, conversationHistory, handleChunk, sdkOptions)
            } else {
                response = await sendMessageToGrok(messageToSend, conversationHistory, handleChunk, sdkOptions)
            }

            // Determine final content: prefer streamingBuffer, fall back to response.message
            const urlLike = (str) => typeof str === 'string' && /^(https?:\/\/|www\.)/.test(str.trim())
            let finalContent = streamingBuffer && streamingBuffer.trim() !== '' ? streamingBuffer : ''
            if ((!finalContent || finalContent.trim() === '') && response && response.message) {
                const cleaned = stripCitations(response.message)
                if (cleaned && (!urlLike(cleaned) || streamingSources.length === 0)) {
                    finalContent = cleaned
                }
            }

            // Merge sources from response if available (for non-streaming or additional sources)
            if (response && response.sources && Array.isArray(response.sources)) {
                response.sources.forEach(src => {
                    if (streamingSources.length >= finalMaxSources.value) return
                    const url = typeof src === 'string' ? src : src.url
                    const title = typeof src === 'string' ? src : (src.title || src.url)
                    if (url && !streamingSources.find(s => s.url === url)) {
                        streamingSources.push({ url, title })
                    }
                })
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

                // Persist assistant message by appending to the server chat
                // If chatId isn't available (earlier create failed), create the chat now including both user and assistant messages so AI output is stored.
                try {
                    const serialAssistant = {
                        role: aiMessage.role,
                        content: aiMessage.content,
                        timestamp: (aiMessage.timestamp instanceof Date) ? aiMessage.timestamp.toISOString() : aiMessage.timestamp,
                        toolCalls: aiMessage.toolCalls || [],
                        sources: aiMessage.sources || [],
                        foundSources: aiMessage.foundSources,
                        requestedSources: aiMessage.requestedSources
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
                                timestamp: (userMessage.timestamp instanceof Date) ? userMessage.timestamp.toISOString() : userMessage.timestamp,
                                toolCalls: userMessage.toolCalls || [],
                                sources: userMessage.sources || []
                            }
                            try {
                                const createRes2 = await createAichat('New Conversation', [serialUser, serialAssistant])
                                if (createRes2 && createRes2.success && createRes2.data) {
                                    const createdId2 = parseId(createRes2.data.id || createRes2.data._id)
                                    if (createdId2) {
                                        chatId.value = createdId2
                                        
                                        // Update total count for pagination and navigate to page 1 to show the new conversation
                                        try {
                                            historyTotal.value = (historyTotal.value || 0) + 1
                                            // Navigate to page 1 to show the new conversation
                                            historyPage.value = 1
                                            await loadChatList(1)
                                        } catch (e) {
                                            console.warn('post-create2 pagination adjust error:', e)
                                        }
                                        
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
                                    showTitle.value = true
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

                // Update history list after persisting assistant message
                try {
                    if (chatId.value) {
                        historyPage.value = 1
                        await loadChatList(1)
                    }
                } catch (e) { console.warn('reload chat list after assistant message error:', e) }

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
        errorMessage.value = error.message || t('aiSupport.sendFailed')
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
        try { alert(t('aiSupport.waitForResponse')) } catch (e) {}
        return
    }
    // Start a fresh conversation immediately (no pop-up confirmation)
    messages.value = []
    chatId.value = null
    selectedFile.value = null
    errorMessage.value = ''
    currentTitle.value = 'New Conversation'
    showTitle.value = true
    
    // Also clear any file input
    if (fileInput.value && 'value' in fileInput.value) {
        fileInput.value.value = null
    }
    
    await nextTick()
    await scrollToBottom()
}

// Load health data for suggested prompts if not already cached
const loadHealthData = async () => {
    try {
        // Load BMI data if not cached
        if (!getCachedBmiData()) {
            try {
                const { success, data } = await getLatestBMIRecord()
                if (success && data) {
                    const bmiResult = {
                        bmi: data.bmi,
                        category: data.category,
                        height: data.height,
                        weight: data.weight,
                        age: data.age || null,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt
                    }
                    setCachedBmiData(bmiResult)
                }
            } catch (error) {
                // No BMI data available
            }
        }

        // Load heart rate dates if not cached
        if (!getCachedHeartRateDates()) {
            try {
                const response = await getHeartRateDates()
                if (response.success && response.data.dates && response.data.dates.length > 0) {
                    setCachedHeartRateDates(response.data.dates)
                }
            } catch (error) {
                // No heart rate data available
            }
        }

        // Load stress dates if not cached (so suggested stress prompts appear without a full page refresh)
        if (!getCachedStressDates()) {
            try {
                const sResp = await getStressDates()
                if (sResp && sResp.success && Array.isArray(sResp.data.dates) && sResp.data.dates.length > 0) {
                    setCachedStressDates(sResp.data.dates)
                }
            } catch (error) {
                // No stress data available
            }
        }
    } catch (error) {
        console.error('Error loading health data:', error)
    }
}

// Force reload stress dates (used when data updates elsewhere)
const forceReloadStressDates = async () => {
    try {
        const sResp = await getStressDates()
        if (sResp && sResp.success && Array.isArray(sResp.data.dates) && sResp.data.dates.length > 0) {
            setCachedStressDates(sResp.data.dates)
        } else {
            // If no dates returned, clear cached value to avoid stale prompts
            setCachedStressDates([])
        }
    } catch (error) {
        console.error('Failed to reload stress dates:', error)
    }
}

onMounted(() => {
    // Scroll to top when entering the page
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Load health data for suggested prompts
    loadHealthData()

    // Listen for updates from Data Setting or other views so prompts refresh automatically
    window.addEventListener('stressDataUpdated', forceReloadStressDates)
    // Also refresh cached health data when heart rate or BMI data changes
    window.addEventListener('heartRateDataUpdated', loadHealthData)
    window.addEventListener('bmiDataUpdated', loadHealthData)
    
    // Auto-load history when the panel is shown by default
    if (showHistoryPanel.value) {
        loadChatList(1).catch(e => console.warn('Failed to load chat history on mount:', e))
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('stressDataUpdated', forceReloadStressDates)
    window.removeEventListener('heartRateDataUpdated', loadHealthData)
    window.removeEventListener('bmiDataUpdated', loadHealthData)
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