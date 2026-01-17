// Stress Service - API calls for stress data management
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

// Upload stress CSV file
export const uploadStressCSV = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetchWithAuth(`${API_URL}/api/data/stress/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
    return handleResponse(response)
}

// Get stress records with optional filters
export const getStressRecords = async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.date) queryParams.append('date', params.date)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)

    const url = `${API_URL}/api/data/stress${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await fetchWithAuth(url, { method: 'GET', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}

// Get available dates with stress data
export const getStressDates = async () => {
    const response = await fetchWithAuth(`${API_URL}/api/data/stress/dates`, { method: 'GET', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}

// Get stress statistics
export const getStressStats = async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.date) queryParams.append('date', params.date)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    const url = `${API_URL}/api/data/stress/stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await fetchWithAuth(url, { method: 'GET', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}

// Delete all stress data
export const deleteAllStressRecords = async () => {
    const response = await fetchWithAuth(`${API_URL}/api/data/stress`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}

// Delete stress data for specific date
export const deleteStressByDate = async (date) => {
    const response = await fetchWithAuth(`${API_URL}/api/data/stress/date/${date}`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' })
    return handleResponse(response)
}
