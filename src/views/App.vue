<template>
  <div id="app">
    <Sidebar v-if="showSidebar" @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out',
      showSidebar ? 'pt-16' : '',
      showSidebar && !sidebarHidden ? 'lg:ml-72' : 'lg:ml-0'
    ]">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import Sidebar from '../components/Side_and_Top_Bar.vue'

const { initializeTheme } = useTheme()
const route = useRoute()

const sidebarHidden = ref(false)

const showSidebar = computed(() => {
  // Show sidebar if the route requires auth
  return route.meta.requiresAuth
})

const updateSidebarState = (state) => {
  sidebarHidden.value = state
}

onMounted(() => {
  initializeTheme()
})
</script>

<style>
</style>