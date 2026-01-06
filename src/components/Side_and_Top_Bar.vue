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
                            <div class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4"
                                :class="themeClasses.cardBackground">
                                <div class="flex h-16 shrink-0 items-center">
                                    <h1 class="text-xl font-bold" :class="themeClasses.textPrimary">Health Monitoring
                                        System</h1>
                                </div>
                                <nav class="flex flex-1 flex-col">
                                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" class="-mx-2 space-y-2">
                                                <li v-for="item in navigation" :key="item.name">
                                                    <router-link :to="item.to" :class="[
                                                        'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                        'group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold items-center transition-all duration-150 ease-in-out transform active:scale-95'
                                                    ]" @click="sidebarOpen = false">
                                                        <component :is="item.icon" class="size-6 shrink-0"
                                                            aria-hidden="true" />
                                                        {{ item.name }}
                                                    </router-link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li class="mt-auto">

                                            <router-link to="/setting"
                                                class="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold items-center transition-all duration-150 ease-in-out transform active:scale-95"
                                                :class="isActiveRoute('/setting')
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="sidebarOpen = false">
                                                <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                                                {{ t('nav.formatSettings') }}
                                            </router-link>

                                            <router-link to="/user"
                                                class="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold items-center transition-all duration-150 ease-in-out transform active:scale-95"
                                                :class="isActiveRoute('/user')
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="sidebarOpen = false">
                                                <UsersIcon class="size-6 shrink-0" aria-hidden="true" />
                                                {{ t('nav.userSettings') }}
                                            </router-link>
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
            <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 pb-4"
                :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="flex h-16 shrink-0 items-center">
                    <h1 class="text-xl font-bold mt-8 mb-2" :class="themeClasses.textPrimary">Health Monitoring System
                    </h1>
                </div>
                <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" class="-mx-2 space-y-2">
                                <li v-for="item in navigation" :key="item.name">
                                    <router-link :to="item.to" :class="[
                                        isActiveRoute(item.to)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                        'group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold items-center transition-all duration-150 ease-in-out transform active:scale-95'
                                    ]">
                                        <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                                        {{ item.name }}
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                        <li class="mt-auto">
                            <router-link to="/setting"
                                class="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold items-center transition-all duration-150 ease-in-out transform active:scale-95 text-gray-400 hover:bg-gray-800 hover:text-white">
                                <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                                {{ t('nav.formatSettings') }}
                            </router-link>

                            <router-link to="/user"
                                class="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold items-center transition-all duration-150 ease-in-out transform active:scale-95 text-gray-400 hover:bg-gray-800 hover:text-white">
                                <UsersIcon class="size-6 shrink-0" aria-hidden="true" />
                                {{ t('nav.userSettings') }}
                            </router-link>
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
            <div class="h-6 w-px bg-gray-900/10 lg:block" :class="isDarkMode ? 'bg-gray-600' : 'bg-gray-900/10'"
                aria-hidden="true" />

            <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <!-- Right side of top bar -->
                <div class="flex flex-1 justify-end">
                    <div class="flex items-center gap-x-4 lg:gap-x-6">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useLanguage } from '../composables/useLanguage'
import { clearAllCaches } from '../stores/userStore'
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
} from '@heroicons/vue/24/outline'

// Initialize router for navigation
const router = useRouter()
const route = useRoute()
const { isDarkMode, themeClasses } = useTheme()
const { currentLanguage, languages, changeLanguage, t } = useLanguage()
const API_URL = import.meta.env.VITE_API_URL || ''

const emit = defineEmits(['update:sidebarState'])

const navigation = computed(() => [
    { name: t('nav.home'), to: '/home', icon: HomeIcon },
    { name: t('nav.dataSettings'), to: '/data-setting', icon: HomeIcon },
    { name: t('nav.aiSupport'), to: '/ai-support', icon: HomeIcon },
    { name: t('nav.manualSupport'), to: '/manual-support', icon: HomeIcon },
])

// State
const sidebarOpen = ref(false)
const isDesktopSidebarHidden = ref(false)
const userData = ref(null)

const userName = computed(() => userData.value?.name || 'User')

// Language computed properties
const currentLanguageFlag = computed(() => {
    const lang = languages.find(l => l.code === currentLanguage.value)
    return lang?.flag || '🇺🇸'
})

const currentLanguageName = computed(() => {
    const lang = languages.find(l => l.code === currentLanguage.value)
    return lang?.name || 'English'
})

// Helper to check active route for styling
const isActiveRoute = (path) => route.path === path

const toggleDesktopSidebar = () => {
    isDesktopSidebarHidden.value = !isDesktopSidebarHidden.value
    emit('update:sidebarState', isDesktopSidebarHidden.value)
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
    window.addEventListener('userUpdated', (e) => userData.value = e.detail)
})
</script>
