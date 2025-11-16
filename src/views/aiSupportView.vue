<template>
    <div class="min-h-screen">
        <Sidebar @update:sidebarState="updateSidebarState" />
        <div :class="[
            'transition-all duration-300 ease-in-out',
            sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
        ]">
            <main>
                <div class="px-3 sm:px-4 md:px-6 lg:px-8 pt-4 pb-8">
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold">Data Adding</h1>
                    </div>
                    <div>
                        <p>This is the Data Adding view. Implement your data adding functionality here.</p>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Side_and_Top_Bar.vue'
</script>