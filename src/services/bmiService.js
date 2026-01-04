// BMI Service - API calls for BMI data management
import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_URL = import.meta.env.VITE_API_URL || ''
const getHeaders = () => ({ 'Content-Type': 'application/json' })

const handleResponse = async (response) => {
    if (response.headers.get('content-type')?.includes('text/html')) {
        throw new Error(`Server error: ${response.status}. Please check if the backend server is running.`)
    }
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`)
    return data
}

const buildBMIPayload = (bmiData) => ({
    weight: bmiData.weight,
    height: bmiData.height,
    bmi: bmiData.bmi,
    category: bmiData.category,
    age: bmiData.age !== undefined && bmiData.age !== null && bmiData.age !== '' 
        ? parseInt(bmiData.age, 10) 
        : null
})

export const saveBMIData = async (bmiData) => {
    const response = await fetchWithAuth(`${API_URL}/api/data/bmi`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(buildBMIPayload(bmiData))
    })
    return handleResponse(response)
}

export const getBMIRecords = async () => {
    const response = await fetchWithAuth(`${API_URL}/api/data/bmi`, { method: 'GET', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}

export const getLatestBMIRecord = async () => {
    const response = await getBMIRecords()
    return response.success && response.data.records.length > 0
        ? { success: true, data: response.data.records[0] }
        : { success: true, data: null }
}

export const getBMIRecordById = async (id) => {
    const response = await fetchWithAuth(`${API_URL}/api/data/bmi/${id}`, { method: 'GET', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}

export const updateBMIRecord = async (id, bmiData) => {
    const response = await fetchWithAuth(`${API_URL}/api/data/bmi/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(buildBMIPayload(bmiData))
    })
    return handleResponse(response)
}

export const deleteBMIRecord = async (id) => {
    const response = await fetchWithAuth(`${API_URL}/api/data/bmi/${id}`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}

export const deleteAllBMIRecords = async () => {
    const response = await fetchWithAuth(`${API_URL}/api/data/bmi`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}

export const getBMIStats = async () => {
    const response = await fetchWithAuth(`${API_URL}/api/data/bmi/stats`, { method: 'GET', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}
