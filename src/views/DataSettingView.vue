<template>
    <div :class="themeClasses.background">
        <div class="min-h-screen" :class="themeClasses.background">
            <Sidebar @update:sidebarState="updateSidebarState" />
            <div :class="[
                'transition-all duration-300 ease-in-out pt-16',
                sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
            ]">
                <main>
                    <div class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
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
                                </div>
                            </div>

                            <!-- File Upload Segment -->
                            <div class="rounded-lg shadow-sm p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                                <h2 class="text-xl font-semibold mb-6" :class="themeClasses.textPrimary">Upload CSV File</h2>
                                
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
                                        :disabled="!selectedFile"
                                        class="w-full px-4 py-2 rounded-lg font-medium text-white transition-colors"
                                        :class="selectedFile 
                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                            : 'bg-gray-400 cursor-not-allowed'"
                                    >
                                        Upload File
                                    </button>
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
import { ref, computed, onMounted } from 'vue'
import { saveBMIData, getLatestBMIRecord, updateBMIRecord } from '../services/bmiService'

const sidebarHidden = ref(false)
const { isDarkMode, themeClasses } = useTheme()

// BMI Form State
const bmiForm = ref({
    age: '',
    sex: '',
    height: '',
    weight: ''
})

// Existing BMI record (if any)
const existingBMIRecord = ref(null)

// Loading and status states
const isLoading = ref(false)
const isLoadingData = ref(false)
const submitStatus = ref(null) // { type: 'success' | 'error', message: string }

// Check if we're in update mode (has existing record with _id or id)
const isUpdateMode = computed(() => !!(existingBMIRecord.value?._id || existingBMIRecord.value?.id))

// File Upload State
const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const uploadStatus = ref(null)

// Calculate BMI
const calculatedBMI = computed(() => {
    if (!bmiForm.value.height || !bmiForm.value.weight) return null
    const height = parseFloat(bmiForm.value.height) / 100
    const weight = parseFloat(bmiForm.value.weight)
    if (height <= 0 || weight <= 0) return null
    return (weight / (height * height)).toFixed(1)
})

// Get BMI Category
const bmiCategory = computed(() => {
    if (!calculatedBMI.value) return ''
    const bmi = parseFloat(calculatedBMI.value)
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
})

// Get BMI Category Color
const bmiCategoryColor = computed(() => {
    if (!calculatedBMI.value) return ''
    const bmi = parseFloat(calculatedBMI.value)
    if (bmi < 18.5) return isDarkMode.value ? 'text-blue-400' : 'text-blue-600'
    if (bmi < 25) return isDarkMode.value ? 'text-green-400' : 'text-green-600'
    if (bmi < 30) return isDarkMode.value ? 'text-yellow-400' : 'text-yellow-600'
    return isDarkMode.value ? 'text-red-400' : 'text-red-600'
})

// Sidebar state update
const updateSidebarState = (state) => {
    sidebarHidden.value = state
}

// Load existing BMI data on mount
const loadExistingBMIData = async () => {
    isLoadingData.value = true
    try {
        const response = await getLatestBMIRecord()
        if (response.success && response.data) {
            existingBMIRecord.value = response.data
            // Pre-fill the form with existing data
            bmiForm.value.height = response.data.height?.toString() || ''
            bmiForm.value.weight = response.data.weight?.toString() || ''
            bmiForm.value.age = response.data.age?.toString() || ''
        }
    } catch (error) {
        console.log('No existing BMI data found:', error.message)
    } finally {
        isLoadingData.value = false
    }
}

// BMI Submit - Creates new or updates existing record
const submitBMIData = async () => {
    if (!bmiForm.value.height || !bmiForm.value.weight) {
        submitStatus.value = {
            type: 'error',
            message: 'Please fill in height and weight'
        }
        return
    }
    
    isLoading.value = true
    submitStatus.value = null
    
    try {
        const bmiData = {
            weight: parseFloat(bmiForm.value.weight),
            height: parseFloat(bmiForm.value.height),
            bmi: parseFloat(calculatedBMI.value),
            category: bmiCategory.value,
            age: bmiForm.value.age || null
        }
        
        let response
        
        if (isUpdateMode.value) {
            // Update existing record - use _id or id
            const recordId = existingBMIRecord.value._id || existingBMIRecord.value.id
            console.log('Updating BMI record with ID:', recordId)
            response = await updateBMIRecord(recordId, bmiData)
        } else {
            // Create new record
            console.log('Creating new BMI record')
            response = await saveBMIData(bmiData)
        }
        
        if (response.success) {
            // Update the existing record reference with new data
            // The response.data contains the saved/updated record
            if (response.data) {
                // Handle both _id and id from response
                existingBMIRecord.value = {
                    ...response.data,
                    _id: response.data._id || response.data.id
                }
                console.log('Updated existingBMIRecord:', existingBMIRecord.value)
            }
            
            submitStatus.value = {
                type: 'success',
                message: isUpdateMode.value 
                    ? 'BMI data updated successfully!' 
                    : 'BMI data saved successfully!'
            }
            
            // Dispatch event to notify other components (like HomeView)
            window.dispatchEvent(new CustomEvent('bmiDataUpdated'))
        } else {
            submitStatus.value = {
                type: 'error',
                message: response.message || 'Failed to save BMI data'
            }
        }
    } catch (error) {
        console.error('BMI submission error:', error)
        submitStatus.value = {
            type: 'error',
            message: error.message || 'Failed to save BMI data. Please try again.'
        }
    } finally {
        isLoading.value = false
        
        // Auto-hide success message after 3 seconds
        if (submitStatus.value?.type === 'success') {
            setTimeout(() => {
                submitStatus.value = null
            }, 3000)
        }
    }
}

// Initialize on mount
onMounted(() => {
    loadExistingBMIData()
})

// File Upload Handlers
const triggerFileInput = () => {
    fileInput.value.click()
}

const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
        selectedFile.value = file
        uploadStatus.value = null
    } else if (file) {
        uploadStatus.value = { 
            type: 'error', 
            message: 'Please select a valid CSV file' 
        }
    }
}

const handleFileDrop = (event) => {
    isDragging.value = false
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
        selectedFile.value = file
        uploadStatus.value = null
    } else if (file) {
        uploadStatus.value = { 
            type: 'error', 
            message: 'Please drop a valid CSV file' 
        }
    }
}

const clearFile = () => {
    selectedFile.value = null
    uploadStatus.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const submitFileUpload = async () => {
    if (!selectedFile.value) {
        uploadStatus.value = { 
            type: 'error', 
            message: 'No file selected' 
        }
        return
    }

    try {
        // Simulate file upload
        console.log('Uploading file:', selectedFile.value.name)
        uploadStatus.value = { 
            type: 'success', 
            message: `Successfully uploaded ${selectedFile.value.name}` 
        }
        selectedFile.value = null
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    } catch (error) {
        uploadStatus.value = { 
            type: 'error', 
            message: 'Upload failed. Please try again.' 
        }
    }
}
</script>

<style scoped>
/* Hide number input spinners */
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-spinner {
    -moz-appearance: textfield;
}
</style>