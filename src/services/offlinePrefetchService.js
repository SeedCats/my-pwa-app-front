import { getLatestBMIRecord } from './bmiService'
import { getHeartRateDates, getHeartRateRecords } from './heartRateService'
import { getStressDates, getStressRecords } from './stressService'

const PREFETCH_INTERVAL_MS = 5 * 60 * 1000
let lastPrefetchAt = 0
let inFlightPrefetch = null

export const prefetchHealthDataForOffline = async ({ force = false } = {}) => {
  if (!force && (typeof navigator !== 'undefined' && !navigator.onLine)) return
  if (!force && Date.now() - lastPrefetchAt < PREFETCH_INTERVAL_MS) return
  if (inFlightPrefetch) return inFlightPrefetch

  inFlightPrefetch = (async () => {
    try {
      const [, hrDatesRes, stressDatesRes] = await Promise.allSettled([
        getLatestBMIRecord(),
        getHeartRateDates(),
        getStressDates()
      ])
      const hrDates = hrDatesRes.status === 'fulfilled' ? hrDatesRes.value?.data?.dates : null
      const stressDates = stressDatesRes.status === 'fulfilled' ? stressDatesRes.value?.data?.dates : null
      const followUps = [
        ...(Array.isArray(hrDates) && hrDates.length ? [getHeartRateRecords({ date: hrDates[0] })] : []),
        ...(Array.isArray(stressDates) && stressDates.length ? [getStressRecords({ date: stressDates[0] })] : [])
      ]
      if (followUps.length) await Promise.allSettled(followUps)
    } catch {
      // Ignore prefetch failures
    } finally {
      lastPrefetchAt = Date.now()
      inFlightPrefetch = null
    }
  })()

  return inFlightPrefetch
}
