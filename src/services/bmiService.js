// BMI Service - API calls for BMI data management

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
    return localStorage.getItem('token')
}

/**
 * Get default headers with authorization
 */
const getHeaders = () => {
    const token = getAuthToken()
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    }
}

/**
 * Get user data from localStorage
 */
const getUserData = () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
}

/**
 * Handle API response - checks for HTML error pages
 */
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type')
    
    // Check if response is HTML (error page) instead of JSON
    if (contentType && contentType.includes('text/html')) {
        console.error('API returned HTML instead of JSON. Status:', response.status)
        throw new Error(`Server error: ${response.status}. Please check if the backend server is running.`)
    }
    
    const data = await response.json()
    
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
}

/**
 * Save BMI data to backend
 * POST /api/data/bmi
 */
export const saveBMIData = async (bmiData) => {
    const user = getUserData()
    
    const response = await fetch('/api/data/bmi', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            weight: bmiData.weight,
            height: bmiData.height,
            bmi: bmiData.bmi,
            category: bmiData.category,
            age: bmiData.age ? parseInt(bmiData.age) : null,
            userEmail: user?.email || null
        })
    })

    return handleResponse(response)
}

/**
 * Get all BMI records for the authenticated user
 * GET /api/data/bmi
 */
export const getBMIRecords = async () => {
    const response = await fetch('/api/data/bmi', {
        method: 'GET',
        headers: getHeaders()
    })

    return handleResponse(response)
}

/**
 * Get the latest BMI record (first record from sorted list)
 * GET /api/data/bmi
 */
export const getLatestBMIRecord = async () => {
    const response = await getBMIRecords()
    
    if (response.success && response.data.records.length > 0) {
        return {
            success: true,
            data: response.data.records[0]
        }
    }
    
    return {
        success: true,
        data: null
    }
}

/**
 * Get single BMI record by ID
 * GET /api/data/bmi/:id
 */
export const getBMIRecordById = async (id) => {
    const response = await fetch(`/api/data/bmi/${id}`, {
        method: 'GET',
        headers: getHeaders()
    })

    return handleResponse(response)
}

/**
 * Update BMI record
 * PUT /api/data/bmi/:id
 */
export const updateBMIRecord = async (id, bmiData) => {
    const user = getUserData()
    
    const response = await fetch(`/api/data/bmi/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
            weight: bmiData.weight,
            height: bmiData.height,
            bmi: bmiData.bmi,
            category: bmiData.category,
            age: bmiData.age ? parseInt(bmiData.age) : null,
            userEmail: user?.email || null
        })
    })

    return handleResponse(response)
}

/**
 * Delete BMI record by ID
 * DELETE /api/data/bmi/:id
 */
export const deleteBMIRecord = async (id) => {
    const response = await fetch(`/api/data/bmi/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    })

    return handleResponse(response)
}

/**
 * Delete all BMI records for the authenticated user
 * DELETE /api/data/bmi
 */
export const deleteAllBMIRecords = async () => {
    const response = await fetch('/api/data/bmi', {
        method: 'DELETE',
        headers: getHeaders()
    })

    return handleResponse(response)
}

/**
 * Get BMI statistics for the authenticated user
 * GET /api/data/bmi/stats
 */
export const getBMIStats = async () => {
    const response = await fetch('/api/data/bmi/stats', {
        method: 'GET',
        headers: getHeaders()
    })

    return handleResponse(response)
}

export default {
    saveBMIData,
    getBMIRecords,
    getLatestBMIRecord,
    getBMIRecordById,
    updateBMIRecord,
    deleteBMIRecord,
    deleteAllBMIRecords,
    getBMIStats
}
