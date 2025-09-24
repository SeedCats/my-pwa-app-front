<template>
  <div class="min-h-full bg-gray-50">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main>
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 pt-8">

          <!-- Overall Dashboard -->
          <div class="mb-4 sm:mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-full gap-4 sm:gap-6">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
              <h4 class="text-sm sm:text-base font-semibold text-gray-900 mb-2">Weekly Heart Rate</h4>
              <div class="h-64 sm:h-72 md:h-80 lg:h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                <span class="text-gray-400 text-sm">Chart placeholder</span>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <!-- Stat Card 1 -->
            <div
              class="bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div class="p-3 sm:p-4 md:p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="p-2 bg-indigo-50 rounded-lg">
                      <ChartPieIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div class="ml-3 sm:ml-4 flex-1 min-w-0">
                    <dl>
                      <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">Heart Rate</dt>
                      <dd class="flex items-baseline mt-1">
                        <div class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">72</div>
                        <div class="ml-1 sm:ml-2 text-xs text-gray-600">bpm</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stat Card 2 -->
            <div
              class="bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div class="p-3 sm:p-4 md:p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="p-2 bg-green-50 rounded-lg">
                      <DocumentDuplicateIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                  <div class="ml-3 sm:ml-4 flex-1 min-w-0">
                    <dl>
                      <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">Blood Pressure</dt>
                      <dd class="flex items-baseline mt-1">
                        <div class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">120/80</div>
                        <div class="ml-1 sm:ml-2 text-xs text-gray-600">mmHg</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stat Card 3 -->
            <div
              class="bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div class="p-3 sm:p-4 md:p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="p-2 bg-blue-50 rounded-lg">
                      <Battery50Icon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                  <div class="ml-3 sm:ml-4 flex-1 min-w-0">
                    <dl>
                      <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">Oxygen Level</dt>
                      <dd class="flex items-baseline mt-1">
                        <div class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">98%</div>
                        <div class="ml-1 sm:ml-2 text-xs text-gray-600">SpO₂</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stat Card 4 -->
            <div
              class="bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div class="p-3 sm:p-4 md:p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="p-2 bg-purple-50 rounded-lg">
                      <FireIcon class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                    </div>
                  </div>
                  <div class="ml-3 sm:ml-4 flex-1 min-w-0">
                    <dl>
                      <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">Calories</dt>
                      <dd class="flex items-baseline mt-1">
                        <div class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">2,340</div>
                        <div class="ml-1 sm:ml-2 text-xs text-gray-600">kcal</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity Section -->
          <div class="mt-4 sm:mt-6 md:mt-8">
            <div
              class="bg-white shadow-sm rounded-lg hover:shadow-md transition-all duration-200 border border-gray-100">
              <div class="p-4 sm:p-6">
                <h3 class="text-base sm:text-lg md:text-xl font-semibold leading-6 text-gray-900">Recent Activity</h3>
                <div class="mt-3 sm:mt-4 divide-y divide-gray-100">
                  <!-- Activity Item 1 -->
                  <div class="py-3 sm:py-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div class="flex items-center">
                        <CalendarIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        <span class="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600">Last checkup: 2 days ago</span>
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
                        <ClockIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        <span class="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600">Medication taken: Today 08:00
                          AM</span>
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
                        <ArrowTrendingUpIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        <span class="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600">Exercise completed: 30 min
                          walk</span>
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
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
              <h4 class="text-sm sm:text-base font-semibold text-gray-900 mb-4">Weekly Heart Rate</h4>
              <div class="h-48 sm:h-56 bg-gray-50 rounded-lg flex items-center justify-center">
                <span class="text-gray-400 text-sm">Chart placeholder</span>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
              <h4 class="text-sm sm:text-base font-semibold text-gray-900 mb-4">Activity Trends</h4>
              <div class="h-48 sm:h-56 bg-gray-50 rounded-lg flex items-center justify-center">
                <span class="text-gray-400 text-sm">Chart placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Side_and_Top_Bar.vue'
import { ChartPieIcon, DocumentDuplicateIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const sidebarHidden = ref(false)

const updateSidebarState = (state) => {
  sidebarHidden.value = state
}

</script>