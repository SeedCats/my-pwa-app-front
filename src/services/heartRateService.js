// Heart Rate Service - API calls for heart rate data management

const getHeaders = () => ({ 'Content-Type': 'application/json' })

const handleResponse = async (response) => {
    if (response.headers.get('content-type')?.includes('text/html')) {
        throw new Error(`Server error: ${response.status}. Please check if the backend server is running.`)
    }
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`)
    return data
}

// Upload heart rate CSV file
export const uploadHeartRateCSV = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/data/heartrate/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData  // No Content-Type header - browser sets it automatically
    })
    return handleResponse(response)
}

// Get heart rate records with optional filters
export const getHeartRateRecords = async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.date) queryParams.append('date', params.date)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    const url = `/api/data/heartrate${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await fetch(url, { 
        method: 'GET', 
        headers: getHeaders(), 
        credentials: 'include' 
    })
    return handleResponse(response)
}

// Get available dates with heart rate data
export const getHeartRateDates = async () => {
    const response = await fetch('/api/data/heartrate/dates', { 
        method: 'GET', 
        headers: getHeaders(), 
        credentials: 'include' 
    })
    return handleResponse(response)
}

// Get heart rate statistics
export const getHeartRateStats = async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.date) queryParams.append('date', params.date)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    
    const url = `/api/data/heartrate/stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await fetch(url, { 
        method: 'GET', 
        headers: getHeaders(), 
        credentials: 'include' 
    })
    return handleResponse(response)
}

// Delete all heart rate data
export const deleteAllHeartRateRecords = async () => {
    const response = await fetch('/api/data/heartrate', { 
        method: 'DELETE', 
        headers: getHeaders(), 
        credentials: 'include' 
    })
    return handleResponse(response)
}

// Delete heart rate data for specific date
export const deleteHeartRateByDate = async (date) => {
    const response = await fetch(`/api/data/heartrate/date/${date}`, { 
        method: 'DELETE', 
        headers: getHeaders(), 
        credentials: 'include' 
    })
    return handleResponse(response)
}
