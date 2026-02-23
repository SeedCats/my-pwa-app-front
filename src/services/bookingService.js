import { apiRequest } from './apiClient'

export const fetchBookings = async () => {
  return apiRequest('/api/booking')
}

export const createBooking = async (bookingData) => {
  return apiRequest('/api/booking', {
    method: 'POST',
    body: bookingData
  })
}

export const updateBooking = async (id, bookingData) => {
  return apiRequest(`/api/booking/${id}`, {
    method: 'PUT',
    body: bookingData
  })
}

export const deleteBooking = async (id) => {
  return apiRequest(`/api/booking/${id}`, {
    method: 'DELETE'
  })
}

export const fetchTimeSlots = async (providerId) => {
  return apiRequest(`/api/booking/timeslots/${providerId}`)
}

export const updateTimeSlots = async (slots) => {
  return apiRequest('/api/booking/timeslots', {
    method: 'POST',
    body: { slots }
  })
}
