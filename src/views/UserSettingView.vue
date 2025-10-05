<template>
  <div class="min-h-full bg-gray-50">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main>
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 pt-16">
          <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
          <div class="mt-6">
            <!-- Settings content goes here -->
            <p>This is the settings page. You can add your settings components here.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Side_and_Top_Bar.vue'
</script>