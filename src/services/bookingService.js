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
  return apiRequest(`/api/bookingTimeSlot/${providerId}`)
}

export const markSlotBooked = async (providerId, date, time, booked = true) => {
  return apiRequest('/api/bookingTimeSlot/mark-booked', {
    method: 'PATCH',
    body: { providerId, date, time, booked }
  })
}

export const unmarkSlotBooked = async (providerId, date, time) => {
  return apiRequest('/api/bookingTimeSlot/unmark-booked', {
    method: 'PATCH',
    body: { providerId, date, time }
  })
}

export const updateTimeSlots = async (slots) => {
  return apiRequest('/api/bookingTimeSlot', {
    method: 'POST',
    body: { slots }
  })
}
