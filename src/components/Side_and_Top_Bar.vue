<template>
    <div class="flex pt-4 flex-col">
        <!-- Mobile sidebar -->
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
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
                                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </TransitionChild>

                            <!-- Sidebar component, swap this element with another sidebar if you like -->
                            <div
                                class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                                <div class="flex h-24 shrink-0 items-center">
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-100 to-teal-300 bg-clip-text text-transparent">
                                            Health Monitoring System
                                        </span>
                                    </div>
                                </div>

                                <nav class="flex flex-1 flex-col">
                                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" class="-mx-2 space-y-1">
                                                <li v-for="item in navigation" :key="item.name">
                                                    <a :href="item.href"
                                                        :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                                        <component :is="item.icon" class="size-6 shrink-0"
                                                            aria-hidden="true" />
                                                        {{ item.name }}
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li class="mt-auto">
                                            <a href="#"
                                                class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">
                                                <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                                                Settings
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- sidebar for desktop -->
        <TransitionRoot as="template" :show="!isDesktopSidebarHidden">
            <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <!-- Sidebar component, swap this element with another sidebar if you like -->
                <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                    <div class="flex h-24 shrink-0 items-center">
                        <div class="flex flex-col">
                            <span
                                class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-100 to-teal-300 bg-clip-text text-transparent">
                                Health Monitoring System
                            </span>
                        </div>
                    </div>
                    <nav class="flex flex-1 flex-col">
                        <ul role="list" class="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" class="-mx-2 space-y-7">
                                    <li v-for="item in navigation" :key="item.name">
                                        <a :href="item.href"
                                            :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                            <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                                            {{ item.name }}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class="mt-auto">
                                <a href="#"
                                    class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">
                                    <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </TransitionRoot>

        <!-- Main content -->
        <div :class="[
            'fixed top-0 right-0 left-0 z-40 transition-all duration-300 ease-in-out',
            isDesktopSidebarHidden ? 'lg:left-0' : 'lg:left-72'
        ]">
            <div
                class="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <!-- Mobile menu button -->
                <button type="button"
                    class="-m-2.5 p-2.5 text-gray-700 lg:hidden rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95"
                    @click="sidebarOpen = true">
                    <span class="sr-only">Open sidebar</span>
                    <Bars3Icon class="size-5" aria-hidden="true" />
                </button>

                <!-- Desktop menu button -->
                <button type="button"
                    class="hidden lg:block -m-2.5 p-2.5 text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-95"
                    @click="toggleDesktopSidebar">
                    <span class="sr-only">Open sidebar</span>
                    <Bars3Icon class="size-5" aria-hidden="true" />
                </button>
                
                <!-- Breadcrumbs -->
                <!--Only shows in desktop big screen (hidden lg:block)  -->
                <nav class="hidden lg:block" aria-label="Breadcrumb">
                    <ol role="list" class="flex items-center space-x-4">
                        <li>
                            <div>
                                <a href="#" class="text-gray-400 hover:text-gray-500">
                                    <HomeIcon class="size-5 shrink-0" aria-hidden="true" />
                                    <span class="sr-only">Home</span>
                                </a>
                            </div>
                        </li>
                        <li v-for="page in pages" :key="page.name">
                            <div class="flex items-center">
                                <ChevronRightIcon class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
                                <a :href="page.href" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    :aria-current="page.current ? 'page' : undefined">{{ page.name }}</a>
                            </div>
                        </li>
                    </ol>
                </nav>

                <!-- Separator -->
                <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

                <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <form class="grid flex-1 grid-cols-1" action="#" method="GET"></form>

                    <div class="flex items-center gap-x-4 lg:gap-x-6">
                        <!-- Separator -->
                        <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

                        <!-- Profile dropdown -->
                        <Menu as="div" class="relative">
                            <MenuButton
                                class="-m-1.5 flex items-center p-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100 active:bg-gray-200">
                                <span class="sr-only">Open user menu</span>
                                <span class="flex items-center group">
                                    <span
                                        class="text-sm font-semibold text-gray-900 transition-colors duration-200 group-hover:text-gray-600"
                                        aria-hidden="true">
                                        Tom Cook
                                    </span>
                                    <ChevronDownIcon
                                        class="ml-2 size-5 text-gray-400 transition-transform duration-200 group-hover:rotate-180"
                                        aria-hidden="true" />
                                </span>
                            </MenuButton>

                            <transition enter-active-class="transition ease-out duration-200"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-150"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                                <MenuItems
                                    class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                    <a :href="item.href" :class="[
                                        active ? 'bg-gray-50' : '',
                                        'block px-3 py-1 text-sm text-gray-900 transition-colors duration-200 hover:bg-gray-100'
                                    ]">
                                        {{ item.name }}
                                    </a>
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
import { ref } from 'vue'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'

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
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline'

const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: '1', href: '#', icon: UsersIcon, current: false },
    { name: '2', href: '#', icon: FolderIcon, current: false },
    { name: '3', href: '#', icon: CalendarIcon, current: false },
    { name: '4', href: '#', icon: DocumentDuplicateIcon, current: false },
    { name: '5', href: '#', icon: ChartPieIcon, current: false },
]
const userNavigation = [
    { name: 'Sign out', href: '#' },
]

const sidebarOpen = ref(false)
const isDesktopSidebarHidden = ref(false)

const emit = defineEmits(['update:sidebarState'])

function toggleDesktopSidebar() {
    isDesktopSidebarHidden.value = !isDesktopSidebarHidden.value
    emit('update:sidebarState', isDesktopSidebarHidden.value)
}

const pages = [
    { name: 'Projects', href: '#', current: false },
    { name: 'Project Nero', href: '#', current: true },
    { name: 'Project Nero', href: '#', current: true },
    { name: 'Project Nero', href: '#', current: true },
]

</script>