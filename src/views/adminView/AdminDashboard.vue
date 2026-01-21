<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out pt-16',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        <div class="p-6">
          <h1 class="text-2xl font-bold mb-4">{{ $t('nav.admin') }}</h1>
          <p class="mb-6">Basic administrative panel. Use the links below to manage the system.</p>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <router-link to="/admin/users" class="p-4 rounded-md border hover:shadow">
              <h2 class="font-semibold">{{ $t('nav.userManagement') }}</h2>
              <p class="text-sm text-gray-500">Manage user accounts, roles and status</p>
            </router-link>

            <!-- Add more admin cards here in the future -->
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../../components/Side_and_Top_Bar.vue'
import { useTheme } from '../../composables/useTheme'

const sidebarHidden = ref(false)
const updateSidebarState = (state) => sidebarHidden.value = state

const { themeClasses } = useTheme()
</script>
