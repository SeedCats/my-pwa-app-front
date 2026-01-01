<template>
    <div class="min-h-screen" :class="themeClasses.background">
        <Sidebar @update:sidebarState="updateSidebarState" />
        <div :class="[
            'transition-all duration-300 ease-in-out pt-16',
            sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
        ]">
            <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
                        <!-- Header -->
                        <div class="mb-4 pt-4">
                            <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">Data Setting</h1>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- BMI Input Segment -->
                            <div class="rounded-lg shadow-sm p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                                <div class="flex items-center justify-between mb-6">
                                    <h2 class="text-xl font-semibold" :class="themeClasses.textPrimary">BMI Information</h2>
                                    <span v-if="isUpdateMode" class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        Existing Data
                                    </span>
                                </div>
                                
                                <!-- Loading existing data indicator -->
                                <div v-if="isLoadingData" class="flex items-center justify-center py-4 mb-4">
                                    <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span :class="themeClasses.textSecondary">Loading existing data...</span>
                                </div>
                                
                                <div class="space-y-4">
                                    <!-- Age Input -->
                                    <div>
                                        <label class="block text-sm font-medium mb-2" :class="themeClasses.textSecondary">Age</label>
                                        <input 
                                            v-model="bmiForm.age" 
                                            type="number" 
                                            placeholder="Enter your age"
                                            class="w-full px-4 py-2 rounded-lg border transition-colors no-spinner"
                                            :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400']"
                                        />
                                    </div>

                                    <!-- Height Input -->
                                    <div>
                                        <label class="block text-sm font-medium mb-2" :class="themeClasses.textSecondary">Height (cm)</label>
                                        <input 
                                            v-model="bmiForm.height" 
                                            type="number" 
                                            placeholder="Enter your height in cm"
                                            class="w-full px-4 py-2 rounded-lg border transition-colors no-spinner"
                                            :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400']"
                                        />
                                    </div>

                                    <!-- Weight Input -->
                                    <div>
                                        <label class="block text-sm font-medium mb-2" :class="themeClasses.textSecondary">Weight (kg)</label>
                                        <input 
                                            v-model="bmiForm.weight" 
                                            type="number" 
                                            placeholder="Enter your weight in kg"
                                            class="w-full px-4 py-2 rounded-lg border transition-colors no-spinner"
                                            :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400']"
                                        />
                                    </div>

                                    <!-- BMI Result Display -->
                                    <div v-if="calculatedBMI" class="mt-6 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                                        <div class="text-center">
                                            <p class="text-sm" :class="themeClasses.textSecondary">Your BMI</p>
                                            <p class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ calculatedBMI }}</p>
                                            <p class="text-sm mt-2" :class="[bmiCategoryColor]">{{ bmiCategory }}</p>
                                        </div>
                                    </div>

                                    <!-- Submit Status Message -->
                                    <div v-if="submitStatus" class="mt-4 p-3 rounded-lg text-sm" :class="[
                                        submitStatus.type === 'success' 
                                            ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                            : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ submitStatus.message }}
                                    </div>

                                    <!-- Submit Button -->
                                    <button 
                                        @click="submitBMIData"
                                        :disabled="isLoading || !calculatedBMI"
                                        class="w-full mt-6 px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center"
                                        :class="isLoading || !calculatedBMI 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : isUpdateMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'"
                                    >
                                        <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {{ isLoading ? (isUpdateMode ? 'Updating...' : 'Saving...') : (isUpdateMode ? 'Update' : 'Save') }}
                                    </button>

                                    <!-- Delete BMI Button -->
                                    <button 
                                        v-if="isUpdateMode"
                                        @click="deleteBMIData"
                                        :disabled="isDeletingBMI"
                                        class="w-full mt-3 px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <svg v-if="isDeletingBMI" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <svg v-else class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                        </svg>
                                        {{ isDeletingBMI ? 'Deleting...' : 'Delete BMI Data' }}
                                    </button>

                                    <!-- BMI Delete Status Message -->
                                    <div v-if="deleteBMIStatus" class="mt-3 p-3 rounded-lg text-sm" :class="[
                                        deleteBMIStatus.type === 'success' 
                                            ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                            : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ deleteBMIStatus.message }}
                                    </div>
                                </div>
                            </div>

                            <!-- File Upload Segment -->
                            <div class="rounded-lg shadow-sm p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                                <h2 class="text-xl font-semibold mb-6" :class="themeClasses.textPrimary">Upload CSV File for Heart Rate Data</h2>
                                
                                <div class="space-y-4">
                                    <!-- File Upload Area -->
                                    <div 
                                        @click="triggerFileInput"
                                        @dragover.prevent="isDragging = true"
                                        @dragleave.prevent="isDragging = false"
                                        @drop.prevent="handleFileDrop"
                                        class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                                        :class="isDragging 
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                            : isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'"
                                    >
                                        <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                        <p class="text-sm font-medium mb-1" :class="themeClasses.textPrimary">Click to upload or drag and drop</p>
                                        <p class="text-xs" :class="themeClasses.textSecondary">CSV files only (.csv)</p>
                                        <input 
                                            ref="fileInput"
                                            type="file" 
                                            accept=".csv"
                                            class="hidden"
                                            @change="handleFileSelect"
                                        />
                                    </div>

                                    <!-- Selected File Display -->
                                    <div v-if="selectedFile" class="p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2.172 14.236a8 8 0 1111.656 0A9.956 9.956 0 0112 20c-2.716 0-5.189-.584-7.828-1.764z" clip-rule="evenodd"></path>
                                                </svg>
                                                <div>
                                                    <p class="font-medium text-sm" :class="themeClasses.textPrimary">{{ selectedFile.name }}</p>
                                                    <p class="text-xs" :class="themeClasses.textSecondary">{{ (selectedFile.size / 1024).toFixed(2) }} KB</p>
                                                </div>
                                            </div>
                                            <button 
                                                @click="clearFile"
                                                class="text-red-500 hover:text-red-700"
                                            >
                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Upload Status -->
                                    <div v-if="uploadStatus" class="p-3 rounded-lg text-sm" :class="[
                                        uploadStatus.type === 'success' 
                                            ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                            : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ uploadStatus.message }}
                                    </div>

                                    <!-- Upload Button -->
                                    <button 
                                        @click="submitFileUpload"
                                        :disabled="!selectedFile || isUploading"
                                        class="w-full px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center"
                                        :class="selectedFile && !isUploading
                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                            : 'bg-gray-400 cursor-not-allowed'"
                                    >
                                        <svg v-if="isUploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {{ isUploading ? 'Uploading...' : 'Upload File' }}
                                    </button>

                                    <!-- Delete All Records Button -->
                                    <button 
                                        @click="deleteAllHeartRateData"
                                        :disabled="isDeleting || !hasHeartRateData"
                                        class="w-full px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center"
                                        :class="!isDeleting && hasHeartRateData
                                            ? 'bg-red-600 hover:bg-red-700' 
                                            : 'bg-gray-400 cursor-not-allowed'"
                                    >
                                        <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <svg v-else class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                        </svg>
                                        {{ isDeleting ? 'Deleting...' : 'Delete All Records' }}
                                    </button>

                                    <!-- Delete Status -->
                                    <div v-if="deleteStatus" class="p-3 rounded-lg text-sm" :class="[
                                        deleteStatus.type === 'success' 
                                            ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                            : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ deleteStatus.message }}
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
import { useTheme } from '../composables/useTheme'
import { ref, computed, onMounted } from 'vue'
import { saveBMIData, getLatestBMIRecord, updateBMIRecord, deleteAllBMIRecords } from '../services/bmiService'
import { uploadHeartRateCSV, deleteAllHeartRateRecords, getHeartRateDates } from '../services/heartRateService'
import { invalidateBmiCache, invalidateHeartRateCache } from '../stores/userStore'

const { isDarkMode, themeClasses } = useTheme()

// State
const sidebarHidden = ref(false)
const bmiForm = ref({ age: '', height: '', weight: '' })
const existingBMIRecord = ref(null)
const isLoading = ref(false)
const isLoadingData = ref(false)
const submitStatus = ref(null)
const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const uploadStatus = ref(null)
const isUploading = ref(false)
const isDeleting = ref(false)
const deleteStatus = ref(null)
const hasHeartRateData = ref(false)
const isDeletingBMI = ref(false)
const deleteBMIStatus = ref(null)

// Computed
const isUpdateMode = computed(() => !!(existingBMIRecord.value?._id || existingBMIRecord.value?.id))

const calculatedBMI = computed(() => {
    const { height, weight } = bmiForm.value
    if (!height || !weight) return null
    const h = parseFloat(height) / 100, w = parseFloat(weight)
    return (h > 0 && w > 0) ? (w / (h * h)).toFixed(1) : null
})

const bmiCategory = computed(() => {
    const bmi = parseFloat(calculatedBMI.value)
    if (!bmi) return ''
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
})

const bmiCategoryColor = computed(() => {
    const bmi = parseFloat(calculatedBMI.value)
    if (!bmi) return ''
    const colors = {
        underweight: ['text-blue-400', 'text-blue-600'],
        normal: ['text-green-400', 'text-green-600'],
        overweight: ['text-yellow-400', 'text-yellow-600'],
        obese: ['text-red-400', 'text-red-600']
    }
    const key = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese'
    return isDarkMode.value ? colors[key][0] : colors[key][1]
})

const updateSidebarState = (state) => sidebarHidden.value = state

const loadExistingBMIData = async () => {
    isLoadingData.value = true
    try {
        const { success, data } = await getLatestBMIRecord()
        if (success && data) {
            existingBMIRecord.value = data
            bmiForm.value = {
                height: data.height?.toString() || '',
                weight: data.weight?.toString() || '',
                age: data.age?.toString() || ''
            }
        }
    } catch (error) {
        console.log('No existing BMI data found:', error.message)
    } finally {
        isLoadingData.value = false
    }
}

const submitBMIData = async () => {
    if (!bmiForm.value.height || !bmiForm.value.weight) {
        submitStatus.value = { type: 'error', message: 'Please fill in height and weight' }
        return
    }
    
    isLoading.value = true
    submitStatus.value = null
    
    const ageValue = bmiForm.value.age ? parseInt(bmiForm.value.age, 10) : null
    
    const bmiData = {
        weight: parseFloat(bmiForm.value.weight),
        height: parseFloat(bmiForm.value.height),
        bmi: parseFloat(calculatedBMI.value),
        category: bmiCategory.value,
        age: ageValue
    }
    
    console.log('Submitting BMI data:', bmiData)
    
    try {
        const recordId = existingBMIRecord.value?._id || existingBMIRecord.value?.id
        const response = isUpdateMode.value 
            ? await updateBMIRecord(recordId, bmiData) 
            : await saveBMIData(bmiData)
        
        if (response.success) {
            if (response.data) {
                existingBMIRecord.value = { ...response.data, _id: response.data._id || response.data.id }
            }
            submitStatus.value = {
                type: 'success',
                message: `BMI data ${isUpdateMode.value ? 'updated' : 'saved'} successfully!`
            }
            invalidateBmiCache()  // Invalidate cache so HomeView fetches fresh data
            window.dispatchEvent(new CustomEvent('bmiDataUpdated'))
        } else {
            submitStatus.value = { type: 'error', message: response.message || 'Failed to save BMI data' }
        }
    } catch (error) {
        console.error('BMI submission error:', error)
        submitStatus.value = { type: 'error', message: error.message || 'Failed to save BMI data. Please try again.' }
    } finally {
        isLoading.value = false
        if (submitStatus.value?.type === 'success') {
            setTimeout(() => submitStatus.value = null, 3000)
        }
    }
}

// Delete BMI data
const deleteBMIData = async () => {
    if (!confirm('Are you sure you want to delete your BMI data? This action cannot be undone.')) {
        return
    }
    
    isDeletingBMI.value = true
    deleteBMIStatus.value = null
    
    try {
        const response = await deleteAllBMIRecords()
        
        if (response.success) {
            deleteBMIStatus.value = { 
                type: 'success', 
                message: 'BMI Data is deleted'
            }
            // Clear the form and reset state
            bmiForm.value = { age: '', height: '', weight: '' }
            existingBMIRecord.value = null
            invalidateBmiCache()
            window.dispatchEvent(new CustomEvent('bmiDataUpdated'))
        } else {
            deleteBMIStatus.value = { type: 'error', message: response.message || 'Failed to delete data' }
        }
    } catch (error) {
        console.error('BMI delete error:', error)
        deleteBMIStatus.value = { type: 'error', message: error.message || 'Failed to delete data. Please try again.' }
    } finally {
        isDeletingBMI.value = false
        if (deleteBMIStatus.value?.type === 'success') {
            setTimeout(() => deleteBMIStatus.value = null, 3000)
        }
    }
}

// Check if heart rate data exists
const checkHeartRateData = async () => {
    try {
        const response = await getHeartRateDates()
        console.log('Heart rate dates response:', response)
        
        // Check if there are dates available (backend returns data.dates array)
        if (
            response &&
            response.success &&
            response.data &&
            Array.isArray(response.data.dates) &&
            response.data.dates.length > 0
        ) {
            hasHeartRateData.value = true
        } else {
            hasHeartRateData.value = false
        }
        console.log('hasHeartRateData:', hasHeartRateData.value)
    } catch (error) {
        console.log('Failed to check heart rate data:', error.message)
        hasHeartRateData.value = false
    }
}

// Delete all heart rate data
const deleteAllHeartRateData = async () => {
    if (!confirm('Are you sure you want to delete all heart rate records? This action cannot be undone.')) {
        return
    }
    
    isDeleting.value = true
    deleteStatus.value = null
    
    try {
        const response = await deleteAllHeartRateRecords()
        
        if (response.success) {
            deleteStatus.value = { 
                type: 'success', 
                message: response.message || 'All heart rate data deleted successfully!'
            }
            hasHeartRateData.value = false
            invalidateHeartRateCache()
            window.dispatchEvent(new CustomEvent('heartRateDataUpdated'))
        } else {
            deleteStatus.value = { type: 'error', message: response.message || 'Failed to delete data' }
        }
    } catch (error) {
        console.error('Heart rate delete error:', error)
        deleteStatus.value = { type: 'error', message: error.message || 'Failed to delete data. Please try again.' }
    } finally {
        isDeleting.value = false
        if (deleteStatus.value?.type === 'success') {
            setTimeout(() => deleteStatus.value = null, 3000)
        }
    }
}

onMounted(() => {
    loadExistingBMIData()
    checkHeartRateData()
})

// File Upload Handlers
const triggerFileInput = () => fileInput.value.click()

const validateAndSetFile = (file, errorMsg) => {
    // Check for CSV by extension or MIME type (some systems use different MIME types)
    const isCSV = file?.name?.toLowerCase().endsWith('.csv') || 
                  file?.type === 'text/csv' || 
                  file?.type === 'application/vnd.ms-excel' ||
                  file?.type === 'text/plain'
    
    if (isCSV) {
        selectedFile.value = file
        uploadStatus.value = null
        console.log('File selected:', file.name, file.type, file.size)
    } else if (file) {
        console.log('Invalid file type:', file.name, file.type)
        uploadStatus.value = { type: 'error', message: errorMsg }
    }
}

const handleFileSelect = (e) => validateAndSetFile(e.target.files[0], 'Please select a valid CSV file')

const handleFileDrop = (e) => {
    isDragging.value = false
    validateAndSetFile(e.dataTransfer.files[0], 'Please drop a valid CSV file')
}

const clearFile = () => {
    selectedFile.value = null
    uploadStatus.value = null
    if (fileInput.value) fileInput.value.value = ''
}

const submitFileUpload = async () => {
    if (!selectedFile.value) {
        uploadStatus.value = { type: 'error', message: 'No file selected' }
        return
    }
    
    console.log('Starting upload for:', selectedFile.value.name)
    isUploading.value = true
    uploadStatus.value = null
    
    try {
        console.log('Calling uploadHeartRateCSV...')
        const response = await uploadHeartRateCSV(selectedFile.value)
        console.log('Upload response:', response)
        
        if (response.success) {
            const { inserted = 0, duplicatesSkipped = 0, totalRecords = 0 } = response.data || {}
            uploadStatus.value = { 
                type: 'success', 
                message: `Successfully uploaded! ${inserted} records added${duplicatesSkipped > 0 ? `, ${duplicatesSkipped} duplicates skipped` : ''} (${totalRecords} total in file)` 
            }
            clearFile()
            invalidateHeartRateCache()  // Invalidate cache so HomeView fetches fresh data
            // Dispatch event so HomeView can refresh heart rate data
            window.dispatchEvent(new CustomEvent('heartRateDataUpdated'))
            // Re-check heart rate data to enable delete button
            await checkHeartRateData()
        } else {
            uploadStatus.value = { type: 'error', message: response.message || 'Upload failed' }
        }
    } catch (error) {
        console.error('Heart rate upload error:', error)
        uploadStatus.value = { type: 'error', message: error.message || 'Upload failed. Please try again.' }
    } finally {
        isUploading.value = false
    }
}
</script>

<style scoped>
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

.no-spinner {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>