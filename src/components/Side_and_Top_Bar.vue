<template>
    <div>
        <!-- Mobile sidebar -->
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-900/80" />
                </TransitionChild>

                <div class="fixed inset-0 flex">
                    <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                        enter-from="-translate-x-full" enter-to="translate-x-0"
                        leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                        leave-to="-translate-x-full">
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                                leave-to="opacity-0">
                                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button"
                                        class="-m-2.5 p-2.5 transition-all duration-150 ease-in-out transform hover:scale-110 active:scale-95 rounded-full hover:bg-white/10"
                                        @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <ArrowLeftIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </TransitionChild>
                            <!-- Mobile Sidebar content -->
                            <div class="flex grow flex-col gap-y-5 overflow-y-auto pb-4"
                                :class="themeClasses.cardBackground">
                                <!-- Header -->
                                <div class="flex h-16 shrink-0 items-center px-6 border-b" :class="themeClasses.border">
                                    <div class="flex items-center gap-3">
                                        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-500/30 shrink-0">
                                            <ShieldCheckIcon v-if="isAdmin()" class="h-5 w-5 text-white" />
                                            <BookOpenIcon v-else class="h-5 w-5 text-white" />
                                        </div>
                                        <h1 class="text-base font-bold tracking-tight" :class="themeClasses.textPrimary">{{ $t('nav.title') }}</h1>
                                    </div>
                                </div>
                                <nav class="flex flex-1 flex-col px-4">
                                    <ul role="list" class="flex flex-1 flex-col gap-y-6">
                                        <li>
                                            <p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">{{ t('nav.menu') }}</p>
                                            <ul role="list" class="space-y-1">
                                                <li v-for="item in navigation" :key="item.name">
                                                    <router-link :to="item.to" :class="[
                                                        isActiveRoute(item.to)
                                                            ? 'bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-400'
                                                            : 'text-gray-400 hover:bg-gray-500/10 hover:text-white border-l-2 border-transparent',
                                                        'group flex gap-x-3 rounded-r-md pl-2 pr-3 py-2.5 text-sm font-medium items-center transition-all duration-150 ease-in-out active:scale-95'
                                                    ]" @click="sidebarOpen = false">
                                                        <div class="relative shrink-0">
                                                            <component :is="item.icon" :class="[
                                                                'size-5 transition-colors duration-150',
                                                                isActiveRoute(item.to) ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'
                                                            ]" aria-hidden="true" />
                                                            <span
                                                                v-if="unreadCount > 0 && (item.to === '/chat' || item.to === '/admin/chats')"
                                                                class="absolute -top-1 -right-1 flex h-2.5 w-2.5"
                                                            >
                                                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                                            </span>
                                                        </div>
                                                        {{ item.name }}
                                                    </router-link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li v-if="isAiSupportRoute && !isAdmin()" class="min-h-0 px-2 mt-2">
                                            <div class="flex items-center justify-between mb-2">
                                                <button @click.prevent="toggleAiHistoryPanel" class="flex items-center gap-2 px-2 py-1 rounded-md transition-colors" :class="isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'">
                                                    <span class="text-[15px] font-medium" :class="themeClasses.textPrimary">{{ t('aiSupport.conversationHistory', '歷史') }}</span>
                                                    <svg class="h-4 w-4 transition-transform duration-200" :class="[aiShowHistoryPanel ? 'rotate-0' : '-rotate-90', isDarkMode ? 'text-gray-400' : 'text-gray-500']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                <div class="relative">
                                                    <button @click.prevent="aiConfirmDeleteAll = !aiConfirmDeleteAll"
                                                        :disabled="aiHistoryLoading || aiChatList.length === 0"
                                                        class="p-1.5 rounded-md transition-colors"
                                                        :class="aiHistoryLoading || aiChatList.length === 0
                                                            ? 'opacity-40 cursor-not-allowed hidden'
                                                            : (isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-800')"
                                                        :title="t('aiSupport.deleteAll')">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                    <div v-if="aiConfirmDeleteAll" @click.self="aiConfirmDeleteAll = false" class="fixed inset-0 z-40" style="background: transparent;"></div>
                                                    <div v-if="aiConfirmDeleteAll" class="absolute right-0 mt-2 w-56 p-2.5 rounded-xl shadow-lg z-50 border"
                                                        :class="[isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']">
                                                        <div class="text-xs mb-2 text-center font-medium" :class="themeClasses.textPrimary">{{ t('aiSupport.deleteAllConfirm') }}</div>
                                                        <div class="flex justify-center gap-2 mt-3">
                                                            <button @click.prevent="aiConfirmDeleteAll = false" class="px-3 py-1.5 text-xs rounded-md font-medium transition-colors" 
                                                                :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
                                                                {{ t('common.cancel') }}
                                                            </button>
                                                            <button @click.prevent="deleteAllAiChats(true)" class="px-3 py-1.5 text-xs rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm">
                                                                {{ t('aiSupport.yesDelete') }}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                
                                            <div v-if="aiShowHistoryPanel" class="flex flex-col min-h-0">
                                                <div v-if="aiHistoryLoading" class="text-xs px-2 text-gray-500 mb-2">{{ t('common.loading') }}</div>
                                                <div v-if="aiHistoryError" class="text-xs px-2 text-red-500 mb-2">{{ aiHistoryError }}</div>
                                                <div v-if="!aiHistoryLoading && aiChatList.length === 0" class="text-xs px-2 text-gray-500 mb-2">{{ t('aiSupport.noPastConversations') }}</div>
                
                                                <div class="max-h-72 lg:max-h-[300px] overflow-y-auto ai-sidebar-scroll pb-2">
                                                    <div class="space-y-0.5">
                                                        <template v-for="(chat, idx) in aiChatList" :key="chat._id || chat.id">
                                                            <!-- Group Headers -->
                                                            <div v-if="idx === 0" class="flex items-center gap-3 px-2 py-1.5 mt-1 mb-1">
                                                                <span class="text-[12px] font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ t('aiSupport.today', '今天') }}</span>
                                                                <div class="h-px flex-1" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'"></div>
                                                            </div>
                                                            <div v-if="idx === 1 && aiChatList.length > 1" class="flex items-center gap-3 px-2 py-1.5 mt-3 mb-1">
                                                                <span class="text-[12px] font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ t('aiSupport.earlier', '較早') }}</span>
                                                                <div class="h-px flex-1" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'"></div>
                                                            </div>
                
                                                            <div class="group relative flex items-center justify-between cursor-pointer transition-all duration-200"
                                                                :class="[
                                                                    idx === 0 
                                                                        ? (isDarkMode ? 'bg-gray-800 rounded-xl' : 'bg-gray-100/70 rounded-xl') 
                                                                        : 'rounded-xl',
                                                                    (isDarkMode && idx !== 0 ? 'hover:bg-gray-800/50' : (!isDarkMode && idx !== 0 ? 'hover:bg-gray-50' : ''))
                                                                ]"
                                                                @click.prevent="openAiChat(chat)">
                                                                <div class="flex-1 min-w-0 px-3 py-2.5">
                                                                    <div class="text-[14px] truncate" :class="[idx === 0 ? (isDarkMode ? 'text-gray-200' : 'text-gray-900') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')]">
                                                                        {{ aiChatPreviews[idx] || chat.title || 'Untitled' }}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div class="relative shrink-0 pr-2">
                                                                    <button
                                                                        @click.stop="aiConfirmDeleteId = aiConfirmDeleteId === parseAiId(chat._id || chat.id) ? null : parseAiId(chat._id || chat.id)"
                                                                        class="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                        :class="isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700/80' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'"
                                                                        :title="t('aiSupport.delete')">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                    
                                                                    <div v-if="aiConfirmDeleteId === parseAiId(chat._id || chat.id)" @click.stop="aiConfirmDeleteId = null" class="fixed inset-0 z-40" style="background: transparent;"></div>
                                                                    <div v-if="aiConfirmDeleteId === parseAiId(chat._id || chat.id)" class="absolute right-0 bottom-full mb-1.5 w-48 p-2.5 rounded-xl shadow-xl z-50 border"
                                                                        :class="[isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']">
                                                                        <div class="text-[10px] sm:text-xs mb-2 text-center font-medium" :class="themeClasses.textPrimary">{{ t('aiSupport.deleteConversationConfirm') }}</div>
                                                                        <div class="flex justify-center gap-2 mt-2.5">
                                                                            <button @click.stop="aiConfirmDeleteId = null" class="px-3 py-1.5 text-[10px] rounded-md font-medium transition-colors" 
                                                                                :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
                                                                                {{ t('common.cancel') }}
                                                                            </button>
                                                                            <button @click.stop="deleteAiChat(chat, true)" class="px-3 py-1.5 text-[10px] rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm">
                                                                                {{ t('aiSupport.delete') }}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </div>
                
                                                    <div v-if="aiShowPagination" class="mt-4 px-2 flex items-center justify-between gap-1 max-w-full">
                                                        <button :disabled="aiHistoryPage <= 1" @click.prevent="loadAiChatList(aiHistoryPage - 1)"
                                                            class="px-2.5 py-1.5 text-[11px] font-medium rounded-full border flex items-center justify-center transition-colors"
                                                            :class="[isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50', aiHistoryPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'active:scale-95']">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                            {{ t('aiSupport.prev') }}
                                                        </button>
                                                        <span class="text-[10px] font-semibold px-2 py-1 rounded-full" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ aiHistoryPage }} / {{ aiTotalPages }}</span>
                                                        <button :disabled="aiHistoryPage >= aiTotalPages" @click.prevent="loadAiChatList(aiHistoryPage + 1)"
                                                            class="px-2.5 py-1.5 text-[11px] font-medium rounded-full border flex items-center justify-center transition-colors"
                                                            :class="[isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50', aiHistoryPage >= aiTotalPages ? 'opacity-40 cursor-not-allowed' : 'active:scale-95']">
                                                            {{ t('aiSupport.next') }}
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="mt-auto border-t pt-4" :class="themeClasses.border">
                                            <p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">{{ t('nav.settingsSection') }}</p>
                                            <ul class="space-y-1">
                                                <li>
                                                    <router-link to="/setting"
                                                        class="group flex gap-x-3 rounded-r-md pl-2 pr-3 py-2.5 text-sm font-medium items-center transition-all duration-150 ease-in-out active:scale-95"
                                                        :class="isActiveRoute('/setting')
                                                            ? 'bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-400'
                                                            : 'text-gray-400 hover:bg-gray-500/10 hover:text-white border-l-2 border-transparent'" @click="sidebarOpen = false">
                                                        <Cog6ToothIcon class="size-5 shrink-0" aria-hidden="true" />
                                                        {{ t('nav.formatSettings') }}
                                                    </router-link>
                                                </li>
                                                <li>
                                                    <router-link to="/user"
                                                        class="group flex gap-x-3 rounded-r-md pl-2 pr-3 py-2.5 text-sm font-medium items-center transition-all duration-150 ease-in-out active:scale-95"
                                                        :class="isActiveRoute('/user')
                                                            ? 'bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-400'
                                                            : 'text-gray-400 hover:bg-gray-500/10 hover:text-white border-l-2 border-transparent'" @click="sidebarOpen = false">
                                                        <UsersIcon class="size-5 shrink-0" aria-hidden="true" />
                                                        {{ t('nav.userSettings') }}
                                                    </router-link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Desktop sidebar -->
        <div :class="[
            'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col transition-transform duration-300 ease-in-out',
            isDesktopSidebarHidden ? '-translate-x-full' : 'translate-x-0'
        ]">
            <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r pb-4"
                :class="[themeClasses.cardBackground, themeClasses.border]">
                <!-- Sidebar header -->
                <div class="flex h-16 shrink-0 items-center px-5 border-b" :class="themeClasses.border">
                    <div class="flex items-center gap-3">
                        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-500/30 shrink-0">
                            <ShieldCheckIcon v-if="isAdmin()" class="h-5 w-5 text-white" />
                            <BookOpenIcon v-else class="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 class="text-sm font-bold tracking-tight leading-tight" :class="themeClasses.textPrimary">{{ $t('nav.title') }}</h1>
                            <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-full" :class="isAdmin() ? 'bg-rose-500/15 text-rose-400' : 'bg-indigo-500/15 text-indigo-400'">
                                {{ isAdmin() ? t('nav.roleAdmin') : t('nav.roleUser') }}
                            </span>
                        </div>
                    </div>
                </div>
                <nav class="flex flex-1 flex-col px-4">
                    <ul role="list" class="flex flex-1 flex-col gap-y-6">
                        <li>
                            <p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">{{ t('nav.menu') }}</p>
                            <ul role="list" class="space-y-1">
                                <li v-for="item in navigation" :key="item.name">
                                    <router-link :to="item.to" :class="[
                                        isActiveRoute(item.to)
                                            ? 'bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-400'
                                            : 'text-gray-400 hover:bg-gray-500/10 hover:text-white border-l-2 border-transparent',
                                        'group flex gap-x-3 rounded-r-md pl-2 pr-3 py-2.5 text-sm font-medium items-center transition-all duration-150 ease-in-out active:scale-95'
                                    ]">
                                        <div class="relative shrink-0">
                                            <component :is="item.icon" :class="[
                                                'size-5 transition-colors duration-150',
                                                isActiveRoute(item.to) ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'
                                            ]" aria-hidden="true" />
                                            <span
                                                v-if="unreadCount > 0 && (item.to === '/chat' || item.to === '/admin/chats')"
                                                class="absolute -top-1 -right-1 flex h-2.5 w-2.5"
                                            >
                                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                            </span>
                                        </div>
                                        {{ item.name }}
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                        <li v-if="isAiSupportRoute && !isAdmin()" class="min-h-0 px-2 mt-2">
                            <div class="flex items-center justify-between mb-2">
                                <button @click.prevent="toggleAiHistoryPanel" class="flex items-center gap-2 px-2 py-1 rounded-md transition-colors" :class="isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'">
                                    <span class="text-[15px] font-medium" :class="themeClasses.textPrimary">{{ t('aiSupport.conversationHistory', '歷史') }}</span>
                                    <svg class="h-4 w-4 transition-transform duration-200" :class="[aiShowHistoryPanel ? 'rotate-0' : '-rotate-90', isDarkMode ? 'text-gray-400' : 'text-gray-500']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div class="relative">
                                    <button @click.prevent="aiConfirmDeleteAll = !aiConfirmDeleteAll"
                                        :disabled="aiHistoryLoading || aiChatList.length === 0"
                                        class="p-1.5 rounded-md transition-colors"
                                        :class="aiHistoryLoading || aiChatList.length === 0
                                            ? 'opacity-40 cursor-not-allowed hidden'
                                            : (isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-800')"
                                        :title="t('aiSupport.deleteAll')">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <div v-if="aiConfirmDeleteAll" @click.self="aiConfirmDeleteAll = false" class="fixed inset-0 z-40" style="background: transparent;"></div>
                                    <div v-if="aiConfirmDeleteAll" class="absolute right-0 mt-2 w-56 p-2.5 rounded-xl shadow-lg z-50 border"
                                        :class="[isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']">
                                        <div class="text-xs mb-2 text-center font-medium" :class="themeClasses.textPrimary">{{ t('aiSupport.deleteAllConfirm') }}</div>
                                        <div class="flex justify-center gap-2 mt-3">
                                            <button @click.prevent="aiConfirmDeleteAll = false" class="px-3 py-1.5 text-xs rounded-md font-medium transition-colors" 
                                                :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
                                                {{ t('common.cancel') }}
                                            </button>
                                            <button @click.prevent="deleteAllAiChats(true)" class="px-3 py-1.5 text-xs rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm">
                                                {{ t('aiSupport.yesDelete') }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="aiShowHistoryPanel" class="flex flex-col min-h-0">
                                <div v-if="aiHistoryLoading" class="text-xs px-2 text-gray-500 mb-2">{{ t('common.loading') }}</div>
                                <div v-if="aiHistoryError" class="text-xs px-2 text-red-500 mb-2">{{ aiHistoryError }}</div>
                                <div v-if="!aiHistoryLoading && aiChatList.length === 0" class="text-xs px-2 text-gray-500 mb-2">{{ t('aiSupport.noPastConversations') }}</div>

                                <div class="max-h-72 lg:max-h-[300px] overflow-y-auto ai-sidebar-scroll pb-2">
                                    <div class="space-y-0.5">
                                        <template v-for="(chat, idx) in aiChatList" :key="chat._id || chat.id">
                                            <!-- Group Headers -->
                                            <div v-if="idx === 0" class="flex items-center gap-3 px-2 py-1.5 mt-1 mb-1">
                                                <span class="text-[12px] font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ t('aiSupport.today', '今天') }}</span>
                                                <div class="h-px flex-1" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'"></div>
                                            </div>
                                            <div v-if="idx === 1 && aiChatList.length > 1" class="flex items-center gap-3 px-2 py-1.5 mt-3 mb-1">
                                                <span class="text-[12px] font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ t('aiSupport.earlier', '較早') }}</span>
                                                <div class="h-px flex-1" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'"></div>
                                            </div>

                                            <div class="group relative flex items-center justify-between cursor-pointer transition-all duration-200"
                                                :class="[
                                                    idx === 0 
                                                        ? (isDarkMode ? 'bg-gray-800 rounded-xl' : 'bg-gray-100/70 rounded-xl') 
                                                        : 'rounded-xl',
                                                    (isDarkMode && idx !== 0 ? 'hover:bg-gray-800/50' : (!isDarkMode && idx !== 0 ? 'hover:bg-gray-50' : ''))
                                                ]"
                                                @click.prevent="openAiChat(chat)">
                                                <div class="flex-1 min-w-0 px-3 py-2.5">
                                                    <div class="text-[14px] truncate" :class="[idx === 0 ? (isDarkMode ? 'text-gray-200' : 'text-gray-900') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')]">
                                                        {{ aiChatPreviews[idx] || chat.title || 'Untitled' }}
                                                    </div>
                                                </div>
                                                
                                                <div class="relative shrink-0 pr-2">
                                                    <button
                                                        @click.stop="aiConfirmDeleteId = aiConfirmDeleteId === parseAiId(chat._id || chat.id) ? null : parseAiId(chat._id || chat.id)"
                                                        class="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                        :class="isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700/80' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'"
                                                        :title="t('aiSupport.delete')">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                    
                                                    <div v-if="aiConfirmDeleteId === parseAiId(chat._id || chat.id)" @click.stop="aiConfirmDeleteId = null" class="fixed inset-0 z-40" style="background: transparent;"></div>
                                                    <div v-if="aiConfirmDeleteId === parseAiId(chat._id || chat.id)" class="absolute right-0 bottom-full mb-1.5 w-48 p-2.5 rounded-xl shadow-xl z-50 border"
                                                        :class="[isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']">
                                                        <div class="text-[10px] sm:text-xs mb-2 text-center font-medium" :class="themeClasses.textPrimary">{{ t('aiSupport.deleteConversationConfirm') }}</div>
                                                        <div class="flex justify-center gap-2 mt-2.5">
                                                            <button @click.stop="aiConfirmDeleteId = null" class="px-3 py-1.5 text-[10px] rounded-md font-medium transition-colors" 
                                                                :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
                                                                {{ t('common.cancel') }}
                                                            </button>
                                                            <button @click.stop="deleteAiChat(chat, true)" class="px-3 py-1.5 text-[10px] rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm">
                                                                {{ t('aiSupport.delete') }}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>

                                    <div v-if="aiShowPagination" class="mt-4 px-2 flex items-center justify-between gap-1 max-w-full">
                                        <button :disabled="aiHistoryPage <= 1" @click.prevent="loadAiChatList(aiHistoryPage - 1)"
                                            class="px-2.5 py-1.5 text-[11px] font-medium rounded-full border flex items-center justify-center transition-colors"
                                            :class="[isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50', aiHistoryPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'active:scale-95']">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            {{ t('aiSupport.prev') }}
                                        </button>
                                        <span class="text-[10px] font-semibold px-2 py-1 rounded-full" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ aiHistoryPage }} / {{ aiTotalPages }}</span>
                                        <button :disabled="aiHistoryPage >= aiTotalPages" @click.prevent="loadAiChatList(aiHistoryPage + 1)"
                                            class="px-2.5 py-1.5 text-[11px] font-medium rounded-full border flex items-center justify-center transition-colors"
                                            :class="[isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50', aiHistoryPage >= aiTotalPages ? 'opacity-40 cursor-not-allowed' : 'active:scale-95']">
                                            {{ t('aiSupport.next') }}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="mt-auto border-t pt-4" :class="themeClasses.border">
                            <p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">{{ t('nav.settingsSection') }}</p>
                            <ul class="space-y-1">
                                <li>
                                    <router-link to="/setting"
                                        class="group flex gap-x-3 rounded-r-md pl-2 pr-3 py-2.5 text-sm font-medium items-center transition-all duration-150 ease-in-out active:scale-95"
                                        :class="isActiveRoute('/setting')
                                            ? 'bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-400'
                                            : 'text-gray-400 hover:bg-gray-500/10 hover:text-white border-l-2 border-transparent'">
                                        <Cog6ToothIcon class="size-5 shrink-0" aria-hidden="true" />
                                        {{ t('nav.formatSettings') }}
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/user"
                                        class="group flex gap-x-3 rounded-r-md pl-2 pr-3 py-2.5 text-sm font-medium items-center transition-all duration-150 ease-in-out active:scale-95"
                                        :class="isActiveRoute('/user')
                                            ? 'bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-400'
                                            : 'text-gray-400 hover:bg-gray-500/10 hover:text-white border-l-2 border-transparent'">
                                        <UsersIcon class="size-5 shrink-0" aria-hidden="true" />
                                        {{ t('nav.userSettings') }}
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Top bar -->
        <div :class="[
            'fixed top-0 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-3 border-b px-3 sm:px-5 transition-all duration-300 ease-in-out backdrop-blur-md shadow-sm',
            isDarkMode ? 'bg-gray-900/90 border-gray-700/60' : 'bg-white/90 border-gray-200/80',
            isDesktopSidebarHidden ? 'lg:pl-6' : 'lg:pl-80'
        ]">
            <!-- Mobile menu button -->
            <button type="button" @click="sidebarOpen = true"
                class="shrink-0 -m-1.5 p-2 lg:hidden rounded-xl transition-all duration-200 ease-in-out active:scale-90"
                :class="[isDarkMode ? 'hover:bg-gray-700/80 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900']">
                <span class="sr-only">Open sidebar</span>
                <Bars3Icon class="h-5 w-5" aria-hidden="true" />
            </button>

            <!-- Desktop sidebar toggle -->
            <button type="button" @click="toggleDesktopSidebar"
                class="hidden lg:flex shrink-0 -m-1.5 items-center justify-center p-2 rounded-xl transition-all duration-200 ease-in-out active:scale-90"
                :class="[isDarkMode ? 'hover:bg-gray-700/80 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900']">
                <span class="sr-only">Toggle sidebar</span>
                <Bars3Icon v-if="isDesktopSidebarHidden" class="h-5 w-5" aria-hidden="true" />
                <ArrowLeftIcon v-else class="h-5 w-5" aria-hidden="true" />
            </button>

            <!-- Separator -->
            <div class="h-6 w-px shrink-0" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" aria-hidden="true" />

            <!-- Breadcrumb: page icon + title -->
            <div v-if="currentPageTitle" class="flex items-center gap-2 min-w-0">
                <div class="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    :class="isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-50'">
                    <component :is="currentPageIcon" class="h-4 w-4 text-indigo-500" aria-hidden="true" />
                </div>
                <span class="text-sm font-semibold truncate" :class="themeClasses.textPrimary">{{ currentPageTitle }}</span>
            </div>

            <!-- Flex spacer -->
            <div class="flex flex-1 items-center justify-end gap-x-1 sm:gap-x-2 min-w-0">

                <!-- Assigned Provider (for user role only) -->
                <div v-if="!isAdmin() && providerName" class="hidden md:flex items-center gap-2 mr-1 min-w-0 px-3 py-1.5 rounded-xl border shrink-0"
                    :class="isDarkMode ? 'border-gray-700/60 bg-gray-800/60' : 'border-gray-200 bg-gray-50'">
                    <svg class="w-3.5 h-3.5 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div class="flex flex-col min-w-0 leading-tight">
                        <span class="text-[9px] font-semibold uppercase tracking-widest"
                            :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">{{ t('nav.assignedProvider') }}</span>
                        <span class="text-xs font-semibold truncate max-w-28"
                            :class="isDarkMode ? 'text-indigo-300' : 'text-indigo-700'">{{ providerName }}</span>
                    </div>
                </div>

                <!-- Theme Toggle -->
                <button
                    type="button"
                    @click="setTheme(isDarkMode ? 'light' : 'dark')"
                    class="shrink-0 -m-1 p-2 rounded-xl transition-all duration-200 ease-in-out active:scale-90"
                    :class="isDarkMode ? 'hover:bg-gray-700/80 text-gray-400 hover:text-yellow-400' : 'hover:bg-gray-100 text-gray-500 hover:text-indigo-600'"
                    :title="isDarkMode ? t('nav.switchToLight') : t('nav.switchToDark')"
                >
                    <SunIcon v-if="isDarkMode" class="h-5 w-5" aria-hidden="true" />
                    <MoonIcon v-else class="h-5 w-5" aria-hidden="true" />
                </button>

                <!-- Thin separator -->
                <div class="h-5 w-px shrink-0" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" aria-hidden="true" />

                <!-- Notification Button -->
                <div ref="notificationPanelRef" class="relative shrink-0">
                    <button
                        type="button"
                        @click.stop="toggleNotificationPanel"
                        class="relative -m-1 flex items-center p-2 rounded-xl transition-all duration-200 ease-in-out active:scale-90"
                        :class="isDarkMode ? 'hover:bg-gray-700/80 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'"
                        :aria-label="unreadCount > 0 ? t('nav.chatNotification') : t('nav.notifications')"
                        :title="unreadCount > 0 ? t('nav.newMessages') : t('nav.notifications')"
                    >
                        <div class="relative">
                            <BellIcon
                                class="h-5 w-5 transition-colors duration-200"
                                :class="unreadCount > 0 && !hasViewedNotifications ? 'animate-bell-shake text-blue-500' : ''"
                                aria-hidden="true"
                            />
                            <span v-if="unreadCount > 0 && !hasViewedNotifications" class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 items-center justify-center text-[8px] font-bold text-white leading-none">
                                    {{ unreadCount > 9 ? '9+' : unreadCount }}
                                </span>
                            </span>
                        </div>
                    </button>

                    <!-- Notification Panel -->
                    <transition
                        enter-active-class="transition ease-out duration-150"
                        enter-from-class="transform opacity-0 scale-95 -translate-y-1"
                        enter-to-class="transform opacity-100 scale-100 translate-y-0"
                        leave-active-class="transition ease-in duration-100"
                        leave-from-class="transform opacity-100 scale-100 translate-y-0"
                        leave-to-class="transform opacity-0 scale-95 -translate-y-1"
                    >
                        <div
                            v-if="showNotificationPanel"
                            class="absolute top-12 right-0 w-80 rounded-2xl border shadow-2xl z-30 overflow-hidden"
                            :class="isDarkMode ? 'bg-gray-800/95 border-gray-700/60 backdrop-blur-md' : 'bg-white/95 border-gray-200 backdrop-blur-md'"
                        >
                            <!-- Panel header -->
                            <div class="flex items-center justify-between px-4 py-3 border-b" :class="isDarkMode ? 'border-gray-700/60' : 'border-gray-100'">
                                <div class="flex items-center gap-2">
                                    <BellIcon class="w-4 h-4" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                                    <span class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ t('nav.notifications') }}</span>
                                </div>
                                <span v-if="unreadCount > 0" class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">
                                    <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                    {{ t('nav.newCount', { count: unreadCount }) }}
                                </span>
                            </div>

                            <!-- Unread message card -->
                            <div v-if="unreadCount > 0" class="p-3">
                                <button
                                    type="button"
                                    @click="openNotificationsChat"
                                    class="w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-150 text-left group"
                                    :class="isDarkMode ? 'hover:bg-gray-700/60 bg-gray-700/30' : 'hover:bg-gray-50 bg-blue-50/60'"
                                >
                                    <div class="shrink-0 relative">
                                        <img v-if="unreadIcon" :src="unreadIcon" alt="Sender" class="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30" />
                                        <div v-else class="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center ring-2 ring-blue-500/20 shrink-0">
                                            <span class="text-white font-bold text-sm">{{ (unreadSender || 'S').charAt(0).toUpperCase() }}</span>
                                        </div>
                                        <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2" :class="isDarkMode ? 'border-gray-800' : 'border-white'"></span>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center justify-between gap-1">
                                            <p class="font-semibold text-sm truncate" :class="themeClasses.textPrimary">
                                                {{ unreadSender || (isAdmin() ? 'Patient' : (providerName || t('chat.healthcareProvider'))) }}
                                            </p>
                                            <p v-if="unreadTimeText" class="text-[10px] shrink-0" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
                                                {{ unreadTimeText }}
                                            </p>
                                        </div>
                                        <p class="text-xs mt-0.5 line-clamp-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                                            {{ unreadLastText || t('chat.noMessages') }}
                                        </p>
                                    </div>
                                    <svg class="w-4 h-4 shrink-0 mt-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Empty state -->
                            <div v-else class="flex flex-col items-center justify-center py-8 px-4">
                                <div class="h-12 w-12 rounded-full flex items-center justify-center mb-3" :class="isDarkMode ? 'bg-gray-700/60' : 'bg-gray-100'">
                                    <BellIcon class="w-6 h-6" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
                                </div>
                                <p class="text-sm font-medium" :class="themeClasses.textPrimary">{{ t('nav.allCaughtUp') }}</p>
                                <p class="text-xs mt-0.5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">{{ t('nav.noNewNotifications') }}</p>
                                <button
                                    v-if="isAdmin()"
                                    type="button"
                                    @click="openNotificationsChat"
                                    class="mt-3 text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
                                >
                                    {{ t('admin.patientMessagesTitle') }} →
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>

                <!-- Language Switcher -->
                <Menu as="div" class="relative shrink-0">
                    <MenuButton
                        class="-m-1 flex items-center p-2 rounded-xl transition-all duration-200 ease-in-out active:scale-90"
                        :class="isDarkMode ? 'hover:bg-gray-700/80 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'"
                        :title="currentLanguageName">
                        <span class="flex items-center gap-1.5">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                            </svg>
                            <span class="text-xs font-medium hidden md:block">{{ currentLanguageName }}</span>
                            <ChevronDownIcon class="h-3.5 w-3.5 hidden md:block transition-transform duration-150 ease-in-out ui-open:rotate-180" aria-hidden="true" />
                        </span>
                    </MenuButton>
                    <transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <MenuItems
                            class="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-xl py-1.5 shadow-xl ring-1 focus:outline-none overflow-hidden"
                            :class="[isDarkMode ? 'bg-gray-800 ring-gray-700/60 border border-gray-700/40' : 'bg-white ring-gray-200 border border-gray-100']">
                            <MenuItem v-for="lang in languages" :key="lang.code" v-slot="{ active }">
                            <button @click="changeLanguage(lang.code)" :class="[
                                active ? (isDarkMode ? 'bg-gray-700/70' : 'bg-gray-50') : '',
                                currentLanguage === lang.code ? (isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700') : themeClasses.textPrimary,
                                'flex items-center w-full px-3 py-2 text-sm transition-all duration-150 ease-in-out'
                            ]">
                                <span class="text-base mr-2.5">{{ lang.flag }}</span>
                                <span class="flex-1 font-medium">{{ lang.name }}</span>
                                <svg v-if="currentLanguage === lang.code" class="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                            </MenuItem>
                        </MenuItems>
                    </transition>
                </Menu>

                <!-- Thin separator -->
                <div class="h-5 w-px shrink-0" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" aria-hidden="true" />

                <!-- Profile Dropdown -->
                <Menu as="div" class="relative shrink-0">
                    <MenuButton
                        class="-m-1 flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200 ease-in-out active:scale-90 group"
                        :class="isDarkMode ? 'hover:bg-gray-700/80' : 'hover:bg-gray-100'">
                        <!-- Avatar -->
                        <div class="relative">
                            <img v-if="userData?.icon" :src="userData.icon" alt="User" class="w-8 h-8 rounded-full object-cover ring-2" :class="isDarkMode ? 'ring-gray-600' : 'ring-gray-200'" />
                            <div v-else class="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 flex items-center justify-center ring-2" :class="isDarkMode ? 'ring-gray-600' : 'ring-gray-200'">
                                <span class="text-white font-bold text-sm">{{ userName.charAt(0).toUpperCase() }}</span>
                            </div>

                        </div>
                        <!-- Name + role badge (hidden on small screens) -->
                        <div class="hidden sm:flex flex-col items-start min-w-0">
                            <span class="text-xs font-semibold leading-tight truncate max-w-24" :class="themeClasses.textPrimary">{{ userName }}</span>
                            <span class="text-[10px] leading-tight font-medium" :class="isAdmin() ? 'text-rose-400' : 'text-indigo-400'">
                                {{ isAdmin() ? t('nav.roleAdmin') : t('nav.roleUser') }}
                            </span>
                        </div>
                        <ChevronDownIcon class="h-3.5 w-3.5 hidden sm:block transition-transform duration-150 ui-open:rotate-180 shrink-0" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" aria-hidden="true" />
                    </MenuButton>

                    <transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <MenuItems
                            class="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-xl shadow-xl ring-1 focus:outline-none overflow-hidden"
                            :class="isDarkMode ? 'bg-gray-800 ring-gray-700/60 border border-gray-700/40' : 'bg-white ring-gray-200 border border-gray-100'">

                            <!-- User info header -->
                            <div class="px-4 py-3 border-b" :class="isDarkMode ? 'border-gray-700/60' : 'border-gray-100'">
                                <div class="flex items-center gap-3">
                                    <div class="relative shrink-0">
                                        <img v-if="userData?.icon" :src="userData.icon" alt="User" class="w-9 h-9 rounded-full object-cover" />
                                        <div v-else class="w-9 h-9 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                                            <span class="text-white font-bold">{{ userName.charAt(0).toUpperCase() }}</span>
                                        </div>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-sm font-semibold truncate" :class="themeClasses.textPrimary">{{ userName }}</p>
                                        <span class="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                            :class="isAdmin() ? 'bg-rose-500/15 text-rose-400' : 'bg-indigo-500/15 text-indigo-400'">
                                            {{ isAdmin() ? t('nav.roleAdministrator') : t('nav.roleUser') }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Menu items -->
                            <div class="py-1.5">
                                <MenuItem v-slot="{ active }">
                                    <button @click="handleLogOut" :class="[
                                        active ? (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600') : themeClasses.textPrimary,
                                        'flex items-center w-full gap-2.5 px-4 py-2.5 text-sm font-medium transition-all duration-150'
                                    ]">
                                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                        </svg>
                                        {{ t('auth.logout') }}
                                    </button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useLanguage } from '../composables/useLanguage'
import { clearAllCaches, useUserStore, isAdmin } from '../stores/userStore'
import { fetchAichatList, deleteAichat } from '../services/grokService'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import {
    Bars3Icon,
    ArrowLeftIcon,
    HomeIcon,
    UsersIcon,
    Cog6ToothIcon,
    BellIcon,
    CircleStackIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    CalendarDaysIcon,
    ChartPieIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    ShieldCheckIcon,
    BookOpenIcon,
    SunIcon,
    MoonIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const { isDarkMode, themeClasses, setTheme } = useTheme()
const { currentLanguage, languages, changeLanguage, t } = useLanguage()
const API_URL = import.meta.env.VITE_API_URL || ''

const emit = defineEmits(['update:sidebarState'])

const userStore = useUserStore()
const navigation = computed(() => {
    // If Admin, show only admin navigation
    if (isAdmin()) {
        return [
            { name: t('nav.admin'), to: '/admin', icon: ChartPieIcon },
            { name: t('nav.userManagement'), to: '/admin/users', icon: UsersIcon },
            { name: t('admin.patientMessagesTitle'), to: '/admin/chats', icon: ChatBubbleOvalLeftEllipsisIcon },
            { name: t('booking.adminTitle'), to: '/admin/bookings', icon: CalendarDaysIcon }
        ]
    }

    // Regular user navigation
    return [
        { name: t('nav.home'), to: '/home', icon: HomeIcon },
        { name: t('nav.dataSettings'), to: '/data-setting', icon: CircleStackIcon },
        { name: t('nav.aiSupport'), to: '/ai-support', icon: SparklesIcon },
        { name: t('nav.chat'), to: '/chat', icon: ChatBubbleLeftRightIcon },
        { name: t('nav.bookingSystem'), to: '/booking-system', icon: CalendarDaysIcon }
    ]
})

// Map routes to page titles and icons for topbar breadcrumb
const currentPageIcon = computed(() => {
    const map = {
        '/home': HomeIcon,
        '/data-setting': CircleStackIcon,
        '/ai-support': SparklesIcon,
        '/chat': ChatBubbleLeftRightIcon,
        '/booking-system': CalendarDaysIcon,
        '/setting': Cog6ToothIcon,
        '/user': UsersIcon,
        '/admin': ChartPieIcon,
        '/admin/users': UsersIcon,
        '/admin/chats': ChatBubbleOvalLeftEllipsisIcon,
        '/admin/bookings': CalendarDaysIcon,
    }
    return map[route.path] || HomeIcon
})

const currentPageTitle = computed(() => {
    const map = {
        '/home': t('nav.home'),
        '/data-setting': t('nav.dataSettings'),
        '/ai-support': t('nav.aiSupport'),
        '/chat': t('nav.chat'),
        '/booking-system': t('nav.bookingSystem'),
        '/setting': t('nav.formatSettings'),
        '/user': t('nav.userSettings'),
        '/admin': t('nav.admin'),
        '/admin/users': t('nav.userManagement'),
        '/admin/chats': t('admin.patientMessagesTitle'),
        '/admin/bookings': t('booking.adminTitle'),
    }
    return map[route.path] || ''
})

// State
const sidebarOpen = ref(false)
const isDesktopSidebarHidden = ref(false)
const userData = ref(null)
const unreadCount = ref(0)
const unreadSender = ref('')
const unreadIcon = ref('')
const unreadLastText = ref('')
const unreadTimestamp = ref('')
const showNotificationPanel = ref(false)
const notificationPanelRef = ref(null)
const hasViewedNotifications = ref(false)
let unreadPollTimer = null

const userName = computed(() => userData.value?.name || 'User')

// Provider name - check multiple possible field names
const providerName = computed(() => {
    const user = userData.value
    return user?.provider || user?.providerName || user?.assignedProvider || user?.healthcare_provider || null
})

const currentLanguageName = computed(() => {
    const lang = languages.find(l => l.code === currentLanguage.value)
    return lang?.name || 'English'
})

const unreadTimeText = computed(() => {
    if (!unreadTimestamp.value) return ''
    const parsed = new Date(unreadTimestamp.value)
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleString()
})

const isAiSupportRoute = computed(() => route.path === '/ai-support')

const aiShowHistoryPanel = ref(true)
const aiConfirmDeleteAll = ref(false)
const aiConfirmDeleteId = ref(null)
const aiChatList = ref([])
const aiHistoryLoading = ref(false)
const aiHistoryError = ref('')
const aiHistoryPage = ref(1)
const aiHistoryPerPage = ref(5)
const aiHistoryTotal = ref(0)

const aiTotalPages = computed(() => {
    const total = aiHistoryTotal.value || 0
    const perPage = aiHistoryPerPage.value || 5
    return Math.max(1, Math.ceil(total / perPage))
})

const aiShowPagination = computed(() => aiTotalPages.value > 1)

const parseAiId = (idCandidate) => {
    if (!idCandidate) return null
    if (typeof idCandidate === 'string') return idCandidate
    try {
        if (idCandidate.toString && typeof idCandidate.toString === 'function') return idCandidate.toString()
    } catch (e) { }
    if (idCandidate && typeof idCandidate === 'object' && idCandidate.$oid) return idCandidate.$oid
    return null
}

const formatAiTime = (timestamp) => {
    if (!timestamp) return ''
    const d = (timestamp instanceof Date) ? timestamp : new Date(timestamp)
    if (isNaN(d.getTime())) return ''
    const pad = (n) => (n < 10 ? '0' + n : '' + n)
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const getAiChatPreview = (chat) => {
    if (!chat) return ''
    let msg = ''
    if (chat.lastMessage) {
        if (typeof chat.lastMessage === 'string') msg = chat.lastMessage
        else msg = chat.lastMessage.content || chat.lastMessage.text || ''
    } else if (Array.isArray(chat.messages) && chat.messages.length > 0) {
        const last = chat.messages[chat.messages.length - 1]
        msg = last?.content || ''
    }
    msg = (msg || '').toString().replace(/[ \t]+/g, ' ').trim()
    return msg.length > 80 ? msg.slice(0, 80) : msg
}

const aiChatPreviews = computed(() => (aiChatList.value || []).map(c => getAiChatPreview(c)))

const toggleAiHistoryPanel = async () => {
    aiShowHistoryPanel.value = !aiShowHistoryPanel.value
    if (aiShowHistoryPanel.value && aiChatList.value.length === 0) {
        await loadAiChatList(1)
    }
}

const loadAiChatList = async (page = 1) => {
    if (!isAiSupportRoute.value || isAdmin()) return
    aiHistoryLoading.value = true
    aiHistoryError.value = ''
    try {
        const res = await fetchAichatList(page, aiHistoryPerPage.value)
        if (res && res.success) {
            aiChatList.value = res.data.chats || []
            aiHistoryPage.value = res.data.pagination.currentPage || 1
            aiHistoryPerPage.value = res.data.pagination.perPage || aiHistoryPerPage.value
            aiHistoryTotal.value = res.data.pagination.total || 0
        } else {
            aiHistoryError.value = res?.message || 'Failed to load chats'
        }
    } catch (e) {
        aiHistoryError.value = e.message || 'Failed to load chats'
    } finally {
        aiHistoryLoading.value = false
    }
}

const openAiChat = async (chat) => {
    const id = parseAiId(chat?._id || chat?.id)
    if (!id) return
    sidebarOpen.value = false
    await router.push({ path: '/ai-support', query: { chatId: id, _t: Date.now().toString() } })
}

const deleteAiChat = async (chat, skipConfirm = false) => {
    const id = parseAiId(chat?._id || chat?.id)
    if (!id) return
    if (!skipConfirm) return
    aiConfirmDeleteId.value = null
    aiHistoryLoading.value = true
    aiHistoryError.value = ''
    try {
        const res = await deleteAichat(id)
        if (res && res.success) {
            aiHistoryTotal.value = Math.max(0, (aiHistoryTotal.value || 0) - 1)
            aiChatList.value = (aiChatList.value || []).filter(c => parseAiId(c._id || c.id) !== id)
            if (aiChatList.value.length === 0 && aiHistoryPage.value > 1) aiHistoryPage.value = aiHistoryPage.value - 1
            await loadAiChatList(aiHistoryPage.value)
        } else {
            aiHistoryError.value = res?.message || 'Failed to delete chat'
        }
    } catch (e) {
        aiHistoryError.value = e.message || 'Failed to delete chat'
    } finally {
        aiHistoryLoading.value = false
    }
}

const deleteAllAiChats = async (skipConfirm = false) => {
    if (!skipConfirm) return
    aiConfirmDeleteAll.value = false
    aiHistoryLoading.value = true
    aiHistoryError.value = ''
    try {
        if (!(aiHistoryTotal.value > 0)) await loadAiChatList(1)
        const per = Math.max(1, aiHistoryPerPage.value)
        const pages = Math.ceil((aiHistoryTotal.value || 0) / per) || 1
        const ids = []
        for (let p = 1; p <= pages; p++) {
            const res = await fetchAichatList(p, per)
            if (res && res.success && Array.isArray(res.data.chats)) {
                res.data.chats.forEach(c => {
                    const id = parseAiId(c._id || c.id)
                    if (id) ids.push(id)
                })
            }
        }
        if (ids.length > 0) await Promise.allSettled(ids.map(id => deleteAichat(id)))
        aiChatList.value = []
        aiHistoryTotal.value = 0
        aiHistoryPage.value = 1
        await loadAiChatList(1)
    } catch (e) {
        aiHistoryError.value = e.message || 'Failed to delete chats'
    } finally {
        aiHistoryLoading.value = false
    }
}

// Helper to check active route for styling
const isActiveRoute = (path) => route.path === path

const toggleDesktopSidebar = () => {
    isDesktopSidebarHidden.value = !isDesktopSidebarHidden.value
    emit('update:sidebarState', isDesktopSidebarHidden.value)
}

const toggleNotificationPanel = async () => {
    if (showNotificationPanel.value) { showNotificationPanel.value = false; return }
    showNotificationPanel.value = true
    hasViewedNotifications.value = true
    await loadUnreadCount()
}

const openNotificationsChat = async () => {
    if (isAdmin()) {
        showNotificationPanel.value = false
        router.push('/admin/chats')
        return
    }
    showNotificationPanel.value = false
    router.push('/chat')
}

const handleGlobalClick = (event) => {
    const panel = notificationPanelRef.value
    if (!panel) return
    if (!panel.contains(event.target)) {
        showNotificationPanel.value = false
    }
}

const openMobileSidebarEvent = () => {
    sidebarOpen.value = true
    // Ensure the AI history panel is expanded if we are on the AI support route
    if (isAiSupportRoute.value && !isAdmin() && !aiShowHistoryPanel.value) {
        toggleAiHistoryPanel()
    }
}

const loadUnreadCount = async () => {
    const initialCount = unreadCount.value

    try {
        const endpoints = isAdmin()
            ? ['/api/admin-chat/unread', '/api/admin/user-chat/unread', '/api/user-chat/unread']
            : ['/api/user-chat/unread']

        let loadedFromEndpoint = false

        for (const endpoint of endpoints) {
            let response
            try {
                response = await fetch(`${API_URL}${endpoint}`, { credentials: 'include' })
            } catch (err) {
                // Network error (ERR_INTERNET_DISCONNECTED etc.) - skip this endpoint silently
                console.warn(`Failed to fetch unread count from ${endpoint}:`, err.message)
                continue
            }

            if (!response.ok) {
                if (response.status === 404) continue
                break
            }

            const json = await response.json().catch(() => ({}))
            const count = json?.count ?? json?.data?.count ?? json?.unreadCount ?? json?.data?.unreadCount ?? 0
            const newCount = Number.isFinite(Number(count)) ? Number(count) : 0
            
            unreadCount.value = newCount

            // If we have MORE notifications than before (compared to initial count), reset the viewed flag
            if (newCount > initialCount) {
                // Only reset if panel is CLOSED. If open, user is viewing it.
                if (!showNotificationPanel.value) {
                     hasViewedNotifications.value = false
                }
            }

            const lastMessage = json?.lastMessage || json?.data?.lastMessage || null
            unreadLastText.value = lastMessage?.text || json?.lastMessageText || json?.data?.lastMessageText || ''
            unreadSender.value = lastMessage?.senderName || lastMessage?.sender || json?.senderName || json?.data?.senderName || ''
            unreadIcon.value = lastMessage?.senderIcon || lastMessage?.icon || json?.senderIcon || json?.data?.senderIcon || json?.icon || json?.data?.icon || ''
            unreadTimestamp.value = lastMessage?.createdAt || lastMessage?.time || json?.lastMessageCreatedAt || json?.data?.lastMessageCreatedAt || ''

            loadedFromEndpoint = true

            if (unreadCount.value > 0 && !unreadSender.value && !isAdmin()) {
                unreadSender.value = providerName.value || t('chat.healthcareProvider')
            }

            if (!isAdmin() || unreadLastText.value || unreadSender.value || unreadCount.value > 0) {
                return
            }
        }

        if (!loadedFromEndpoint && !isAdmin()) {
            unreadCount.value = 0
            unreadLastText.value = ''
            unreadSender.value = ''
            unreadIcon.value = ''
            unreadTimestamp.value = ''
        }
    } catch {
        unreadCount.value = 0
        unreadLastText.value = ''
        unreadSender.value = ''
        unreadIcon.value = ''
        unreadTimestamp.value = ''
    }
}

const handleLogOut = async () => {
    try {
        await fetch(`${API_URL}/api/logout`, { method: 'POST', credentials: 'include' })
    } catch { /* ignore */ }
    clearAllCaches()  // Clear all cached data on logout
    router.push('/')
}

const loadUserData = async () => {
    try {
        const res = await fetch(`${API_URL}/api/user/me`, { credentials: 'include' })
        if (res.ok) {
            const json = await res.json()
            userData.value = json.data?.user || json.data || json.user || json
        }
    } catch { userData.value = null }
}

onMounted(() => {
    loadUserData()
    loadUnreadCount()
    if (isAiSupportRoute.value && !isAdmin()) loadAiChatList(1)
    unreadPollTimer = window.setInterval(loadUnreadCount, 30000)
    window.addEventListener('mousedown', handleGlobalClick)
    window.addEventListener('messagesRead', loadUnreadCount)
    window.addEventListener('open-mobile-sidebar', openMobileSidebarEvent)
    window.addEventListener('userUpdated', (e) => {
        const updated = e?.detail || {}
        const currentId = userStore.user?.id || userStore.user?._id || userData.value?.id || userData.value?._id
        if (updated && currentId && (String(updated.id) === String(currentId) || String(updated._id) === String(currentId)))
            userData.value = updated
    })
})

onUnmounted(() => {
    if (unreadPollTimer) { clearInterval(unreadPollTimer); unreadPollTimer = null }
    window.removeEventListener('mousedown', handleGlobalClick)
    window.removeEventListener('messagesRead', loadUnreadCount)
    window.removeEventListener('open-mobile-sidebar', openMobileSidebarEvent)
})

watch(() => route.path, (newPath) => {
    if (newPath === '/ai-support' && !isAdmin()) {
        loadAiChatList(1)
    }
})
</script>

<style scoped>
.ai-sidebar-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(99, 102, 241, 0.25) transparent;
}
.ai-sidebar-scroll::-webkit-scrollbar {
    width: 5px;
}
.ai-sidebar-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.ai-sidebar-scroll::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 99px;
}
.ai-sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.55);
}
</style>
