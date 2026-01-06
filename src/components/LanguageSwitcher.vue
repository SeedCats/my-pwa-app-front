<template>
  <div class="relative">
    <!-- Language Switcher Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      :class="themeClasses?.textPrimary"
    >
      <span class="text-lg">{{ currentLangFlag }}</span>
      <span class="text-sm font-medium hidden sm:inline">{{ currentLangName }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50"
        :class="[themeClasses?.cardBackground, themeClasses?.border]"
      >
        <div class="py-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLanguage(lang.code)"
            class="w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors"
            :class="[
              currentLanguage === lang.code
                ? 'bg-blue-50 dark:bg-blue-900/30'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700',
              themeClasses?.textPrimary
            ]"
          >
            <span class="text-lg">{{ lang.flag }}</span>
            <span>{{ lang.name }}</span>
            <svg
              v-if="currentLanguage === lang.code"
              class="w-4 h-4 ml-auto text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../composables/useLanguage'

// Props to accept theme classes
const props = defineProps({
  themeClasses: {
    type: Object,
    default: () => ({})
  }
})

// Use language composable
const { currentLanguage, languages, changeLanguage } = useLanguage()

// Local state
const isOpen = ref(false)

// Computed properties
const currentLangFlag = computed(() => {
  const lang = languages.find(l => l.code === currentLanguage.value)
  return lang?.flag || '🇺🇸'
})

const currentLangName = computed(() => {
  const lang = languages.find(l => l.code === currentLanguage.value)
  return lang?.name || 'English'
})

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (langCode) => {
  changeLanguage(langCode)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative')
  if (!dropdown) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
