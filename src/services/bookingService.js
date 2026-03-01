import { apiRequest } from './apiClient'

export const fetchBookings = () => apiRequest('/api/booking')

export const createBooking = (bookingData) =>
  apiRequest('/api/booking', { method: 'POST', body: bookingData })

export const updateBooking = (id, bookingData) =>
  apiRequest(`/api/booking/${id}`, { method: 'PUT', body: bookingData })

export const deleteBooking = (id) =>
  apiRequest(`/api/booking/${id}`, { method: 'DELETE' })

export const fetchTimeSlots = (providerId) =>
  apiRequest(`/api/bookingTimeSlot/${providerId}`)

export const markSlotBooked = (providerId, date, time, booked = true) =>
  apiRequest('/api/bookingTimeSlot/mark-booked', {
    method: 'PATCH',
    body: { providerId, date, time, booked }
  })

export const unmarkSlotBooked = (providerId, date, time) =>
  markSlotBooked(providerId, date, time, false)

export const updateTimeSlots = (slots) =>
  apiRequest('/api/bookingTimeSlot', { method: 'POST', body: { slots } })
