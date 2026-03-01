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
                                            <p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">Menu</p>
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
                                        <li class="mt-auto border-t pt-4" :class="themeClasses.border">
                                            <p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">Settings</p>
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
                                {{ isAdmin() ? 'Admin' : 'User' }}
                            </span>
                        </div>
                    </div>
                </div>
                <nav class="flex flex-1 flex-col px-4">
                    <ul role="list" class="flex flex-1 flex-col gap-y-6">
                        <li>
                            <p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">Menu</p>
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
                        <li class="mt-auto border-t pt-4" :class="themeClasses.border">
                            <p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">Settings</p>
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
            'fixed top-0 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b px-4 shadow-sm sm:gap-x-6 sm:px-6 transition-all duration-300 ease-in-out',
            themeClasses.cardBackground,
            themeClasses.border,
            isDesktopSidebarHidden ? 'lg:pl-8' : 'lg:pl-80'
        ]">
            <!-- Mobile menu button -->
            <button type="button" @click="sidebarOpen = true"
                class="-m-2.5 p-2.5 lg:hidden rounded-lg transition-all duration-150 ease-in-out transform hover:scale-110 active:scale-95"
                :class="[themeClasses.textPrimary, isDarkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200']">
                <span class="sr-only">Open sidebar</span>
                <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Desktop sidebar toggle -->
            <button type="button" @click="toggleDesktopSidebar"
                class="hidden lg:block -m-2.5 p-2.5 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-110 active:scale-95"
                :class="[themeClasses.textPrimary, isDarkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200']">
                <span class="sr-only">Toggle sidebar</span>
                <Bars3Icon v-if="isDesktopSidebarHidden" class="h-6 w-6" aria-hidden="true" />
                <ArrowLeftIcon v-else class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Separator -->
            <div class="h-6 w-px" :class="isDarkMode ? 'bg-gray-600' : 'bg-gray-900/10'"
                aria-hidden="true" />

            <!-- Current page title -->
            <div v-if="currentPageTitle" class="hidden sm:flex items-center gap-2">
                <span class="text-sm font-semibold" :class="themeClasses.textPrimary">{{ currentPageTitle }}</span>
            </div>

            <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <!-- Provider Name (for user role group only) -->
                <div v-if="!isAdmin() && providerName" class="flex items-center">
                    <span class="text-sm" :class="themeClasses.textSecondary">
                        {{ t('nav.provider') }}: 
                        <span class="font-medium" :class="themeClasses.textPrimary">{{ providerName }}</span>
                    </span>
                </div>

                <!-- Right side of top bar -->
                <div class="flex flex-1 justify-end">
                    <div class="flex items-center gap-x-4 lg:gap-x-6">
                        <!-- Notification Button -->
                        <div ref="notificationPanelRef" class="relative">
                            <button
                                type="button"
                                @click.stop="toggleNotificationPanel"
                                class="relative -m-1.5 flex items-center p-1.5 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 group"
                                :class="[
                                    isDarkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200',
                                    unreadCount > 0 && !hasViewedNotifications ? 'bg-opacity-10' : ''
                                ]"
                                :aria-label="unreadCount > 0 ? t('nav.chatNotification') || 'Chat Notification' : t('nav.notification') || 'Notification'"
                                :title="unreadCount > 0 ? t('nav.chatNotification') || 'Chat Notification' : t('nav.notification') || 'Notification'"
                            >
                                <div class="relative">
                                    <BellIcon
                                        class="w-6 h-6 transition-colors duration-200"
                                        :class="[
                                            themeClasses.textPrimary,
                                            unreadCount > 0 && !hasViewedNotifications ? 'animate-bell-shake text-blue-500' : ''
                                        ]"
                                        aria-hidden="true"
                                    />
                                    <span
                                        v-if="unreadCount > 0 && !hasViewedNotifications"
                                        class="absolute top-0 right-0 flex h-3 w-3"
                                    >
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                </div>
                            </button>
                            <div
                                v-if="showNotificationPanel"
                                class="absolute top-10 right-0 w-80 text-sm p-4 rounded-xl border shadow-xl z-20 backdrop-blur-sm"
                                :class="[
                                    themeClasses.cardBackground, 
                                    themeClasses.border, 
                                    themeClasses.textSecondary,
                                    isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
                                ]"
                            >
                                <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                                    <span class="font-bold text-base" :class="themeClasses.textPrimary">Notifications</span>
                                    <span v-if="unreadCount > 0" class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                        {{ unreadCount }} New
                                    </span>
                                </div>
                                
                                <div v-if="unreadCount > 0" class="space-y-3">
                                    <button
                                        type="button"
                                        @click="openNotificationsChat"
                                        class="w-full flex items-start gap-3 p-2 rounded-lg transition-colors text-left"
                                        :class="isDarkMode ? 'hover:bg-gray-700/70' : 'hover:bg-gray-50'"
                                    >
                                        <div class="flex-shrink-0">
                                            <img v-if="unreadIcon" :src="unreadIcon" alt="Sender Icon" class="w-8 h-8 rounded-full object-cover" />
                                            <div v-else class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                <span class="text-blue-600 dark:text-blue-300 font-bold text-xs">
                                                    {{ (unreadSender || 'S').charAt(0).toUpperCase() }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="font-semibold text-sm truncate" :class="themeClasses.textPrimary">
                                                {{ unreadSender || (isAdmin() ? 'Patient' : (providerName || t('chat.healthcareProvider'))) }}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                                                {{ unreadLastText || t('chat.noMessages') }}
                                            </p>
                                            <p v-if="unreadTimeText" class="text-[10px] text-gray-400 mt-1">
                                                {{ unreadTimeText }}
                                            </p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0 mt-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div v-else class="py-6 text-center">
                                    <div class="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                                        <BellIcon class="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p class="text-sm text-gray-500">No new messages</p>
                                    <button
                                        v-if="isAdmin()"
                                        type="button"
                                        @click="openNotificationsChat"
                                        class="mt-3 text-blue-600 hover:text-blue-500 text-xs font-medium"
                                    >
                                        {{ t('admin.patientMessagesTitle') }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Language Switcher Button -->
                        <Menu as="div" class="relative">
                            <MenuButton
                                class="-m-1.5 flex items-center p-1.5 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95"
                                :class="[isDarkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200']">
                                <span class="flex items-center gap-x-2">
                                    <svg class="w-5 h-5" :class="themeClasses.textPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                    </svg>
                                    <span class="text-sm font-medium hidden sm:block" :class="themeClasses.textPrimary">{{ currentLanguageName }}</span>
                                    <ChevronDownIcon
                                        class="h-4 w-4 transition-transform duration-150 ease-in-out ui-open:rotate-180"
                                        :class="themeClasses.textSecondary" aria-hidden="true" />
                                </span>
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                                <MenuItems
                                    class="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                                    :class="[themeClasses.cardBackground, themeClasses.border]">
                                    <MenuItem v-for="lang in languages" :key="lang.code" v-slot="{ active }">
                                    <button @click="changeLanguage(lang.code)" :class="[
                                        active ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : '',
                                        currentLanguage === lang.code ? (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50') : '',
                                        'flex items-center w-full px-3 py-2 text-sm transition-all duration-150 ease-in-out transform active:scale-95',
                                        themeClasses.textPrimary
                                    ]">
                                        <span class="text-lg mr-2">{{ lang.flag }}</span>
                                        <span class="flex-1">{{ lang.name }}</span>
                                        <svg v-if="currentLanguage === lang.code" class="w-4 h-4 text-blue-600 animate-fade-in" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>

                        <!-- Profile dropdown -->
                        <Menu as="div" class="relative">
                            <MenuButton
                                class="-m-1.5 flex items-center p-1.5 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95"
                                :class="[isDarkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200']">
                                <span class="flex items-center">
                                    <img v-if="userData?.icon" :src="userData.icon" alt="User Icon" class="w-8 h-8 rounded-full object-cover mr-2 border" :class="themeClasses.border" />
                                    <div v-else class="w-8 h-8 rounded-full flex items-center justify-center mr-2 border bg-gray-100 dark:bg-gray-800" :class="themeClasses.border">
                                        <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <span class="text-sm font-semibold leading-6 hidden sm:block"
                                        :class="themeClasses.textPrimary">{{ userName }}</span>
                                    <span class="text-xs font-semibold leading-6 sm:hidden truncate max-w-20"
                                        :class="themeClasses.textPrimary">{{ userName.split(' ')[0] }}</span>
                                    <ChevronDownIcon
                                        class="ml-2 h-5 w-5 transition-transform duration-150 ease-in-out ui-open:rotate-180"
                                        :class="themeClasses.textSecondary" aria-hidden="true" />
                                </span>
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                                <MenuItems
                                    class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                                    :class="[themeClasses.cardBackground, themeClasses.border]">
                                    <MenuItem v-slot="{ active }">
                                    <button @click="handleLogOut" :class="[
                                        active ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : '',
                                        'flex items-center w-full px-4 py-2 text-left text-sm font-medium leading-6 transition-all duration-150 ease-in-out transform active:scale-95',
                                        themeClasses.textPrimary
                                    ]">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                        </svg>
                                        {{ t('auth.logout') }}
                                    </button>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useLanguage } from '../composables/useLanguage'
import { clearAllCaches, useUserStore, isAdmin } from '../stores/userStore'
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
} from '@heroicons/vue/24/outline'

// Initialize router for navigation
const router = useRouter()
const route = useRoute()
const { isDarkMode, themeClasses } = useTheme()
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

// Map routes to page titles for topbar breadcrumb
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

// Global flag to track if we just cleared notifications and prevent immediate re-fetching that would show them again
const justClearedNotifications = ref(false)

const clearUnread = (suppressMs = 0) => {
    hasViewedNotifications.value = true
    showNotificationPanel.value = false
    if (suppressMs > 0) { justClearedNotifications.value = true; setTimeout(() => { justClearedNotifications.value = false }, suppressMs) }
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

const loadUnreadCount = async () => {
    // Skip loading if we just cleared notifications (to allow backend time to update read status)
    if (justClearedNotifications.value) return

    // Capture initial count BEFORE the try block so it's accessible in catch
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
        const res = await fetch('http://localhost:5000/api/user/me', { credentials: 'include' })
        if (res.ok) {
            const json = await res.json()
            userData.value = json.data?.user || json.data || json.user || json
        }
    } catch { userData.value = null }
}

onMounted(() => {
    loadUserData()
    loadUnreadCount()
    unreadPollTimer = window.setInterval(loadUnreadCount, 30000)
    window.addEventListener('mousedown', handleGlobalClick)
    window.addEventListener('messagesRead', loadUnreadCount)
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
})
</script>
