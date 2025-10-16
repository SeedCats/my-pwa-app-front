<template>
  <div :class="themeClasses.background">
    <div class="min-h-full" :class="themeClasses.background">
      <Sidebar @update:sidebarState="updateSidebarState" />
      <div :class=" [
        'transition-all duration-300 ease-in-out',
        sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
      ]">
        <main>
          <div class="px-3 sm:px-4 md:px-6 lg:px-8">

            <!-- Overall Dashboard -->
            <div class="mb-4 sm:mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-full gap-4 sm:gap-6">
              <div class="rounded-lg shadow-sm p-4 sm:p-6 border transition-all duration-200" :class="[themeClasses.cardBackground, themeClasses.border]">
                <h4 class="text-sm sm:text-base font-semibold mb-2" :class="themeClasses.textPrimary">Weekly Heart Rate</h4>
                <div class="h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg flex items-center justify-center" :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-50'">
                  <span class="text-sm" :class="themeClasses.textSecondary">Chart placeholder</span>
                </div>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <!-- Stat Card 1 -->
              <div class="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="p-3 sm:p-4 md:p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="p-2 rounded-lg" :class="isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'">
                        <ChartPieIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div class="ml-3 sm:ml-4 flex-1 min-w-0">
                      <dl>
                        <dt class="text-xs sm:text-sm font-medium truncate" :class="themeClasses.textSecondary">Heart Rate</dt>
                        <dd class="flex items-baseline mt-1">
                          <div class="text-lg sm:text-xl md:text-2xl font-semibold" :class="themeClasses.textPrimary">72</div>
                          <div class="ml-1 sm:ml-2 text-xs" :class="themeClasses.textSecondary">bpm</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Stat Card 2 -->
              <div class="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="p-3 sm:p-4 md:p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="p-2 rounded-lg" :class="isDarkMode ? 'bg-green-900/30' : 'bg-green-50'">
                        <DocumentDuplicateIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                      </div>
                    </div>
                    <div class="ml-3 sm:ml-4 flex-1 min-w-0">
                      <dl>
                        <dt class="text-xs sm:text-sm font-medium truncate" :class="themeClasses.textSecondary">Blood Pressure</dt>
                        <dd class="flex items-baseline mt-1">
                          <div class="text-lg sm:text-xl md:text-2xl font-semibold" :class="themeClasses.textPrimary">120/80</div>
                          <div class="ml-1 sm:ml-2 text-xs" :class="themeClasses.textSecondary">mmHg</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Stat Card 3 -->
              <div class="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="p-3 sm:p-4 md:p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="p-2 rounded-lg" :class="isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'">
                        <Battery50Icon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                      </div>
                    </div>
                    <div class="ml-3 sm:ml-4 flex-1 min-w-0">
                      <dl>
                        <dt class="text-xs sm:text-sm font-medium truncate" :class="themeClasses.textSecondary">Oxygen Level</dt>
                        <dd class="flex items-baseline mt-1">
                          <div class="text-lg sm:text-xl md:text-2xl font-semibold" :class="themeClasses.textPrimary">98%</div>
                          <div class="ml-1 sm:ml-2 text-xs" :class="themeClasses.textSecondary">SpO₂</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Stat Card 4 -->
              <div class="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="p-3 sm:p-4 md:p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="p-2 rounded-lg" :class="isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'">
                        <FireIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                      </div>
                    </div>
                    <div class="ml-3 sm:ml-4 flex-1 min-w-0">
                      <dl>
                        <dt class="text-xs sm:text-sm font-medium truncate" :class="themeClasses.textSecondary">Calories</dt>
                        <dd class="flex items-baseline mt-1">
                          <div class="text-lg sm:text-xl md:text-2xl font-semibold" :class="themeClasses.textPrimary">2,340</div>
                          <div class="ml-1 sm:ml-2 text-xs" :class="themeClasses.textSecondary">kcal</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity Section -->
            <div class="mt-4 sm:mt-6 md:mt-8">
              <div class="shadow-sm rounded-lg hover:shadow-md transition-all duration-200 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="p-4 sm:p-6">
                  <h3 class="text-base sm:text-lg md:text-xl font-semibold leading-6" :class="themeClasses.textPrimary">Recent Activity</h3>
                  <div class="mt-3 sm:mt-4 divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-100'">
                    <!-- Activity Item 1 -->
                    <div class="py-3 sm:py-4">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="flex items-center">
                          <span class="ml-2 sm:ml-3 text-xs sm:text-sm" :class="themeClasses.textSecondary">Last checkup: 2 days ago</span>
                        </div>
                        <span class="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium">
                          View details →
                        </span>
                      </div>
                    </div>

                    <!-- Activity Item 2 -->
                    <div class="py-3 sm:py-4">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="flex items-center">
                          <span class="ml-2 sm:ml-3 text-xs sm:text-sm" :class="themeClasses.textSecondary">Medication taken: Today 08:00 AM</span>
                        </div>
                        <span class="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium">
                          View history →
                        </span>
                      </div>
                    </div>

                    <!-- Activity Item 3 -->
                    <div class="py-3 sm:py-4">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="flex items-center">
                          <span class="ml-2 sm:ml-3 text-xs sm:text-sm" :class="themeClasses.textSecondary">Exercise completed: 30 min walk</span>
                        </div>
                        <span class="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium">
                          View progress →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts Section -->
            <div class="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div class="rounded-lg shadow-sm p-4 sm:p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <h4 class="text-sm sm:text-base font-semibold mb-4" :class="themeClasses.textPrimary">Weekly Heart Rate</h4>
                <div class="h-48 sm:h-56 rounded-lg flex items-center justify-center" :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-50'">
                  <span class="text-sm" :class="themeClasses.textSecondary">Chart placeholder</span>
                </div>
              </div>

              <div class="rounded-lg shadow-sm p-4 sm:p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <h4 class="text-sm sm:text-base font-semibold mb-4" :class="themeClasses.textPrimary">Activity Trends</h4>
                <div class="h-48 sm:h-56 rounded-lg flex items-center justify-center" :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-50'">
                  <span class="text-sm" :class="themeClasses.textSecondary">Chart placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Side_and_Top_Bar.vue'
import { useTheme } from '../composables/useTheme'
import { ChartPieIcon, DocumentDuplicateIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { FireIcon } from '@heroicons/vue/24/solid'
import { Battery50Icon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const sidebarHidden = ref(false)
const { isDarkMode, themeClasses } = useTheme()

const updateSidebarState = (state) => {
  sidebarHidden.value = state
}
</script>