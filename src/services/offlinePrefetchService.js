import { getLatestBMIRecord } from './bmiService'
import { getHeartRateDates, getHeartRateRecords } from './heartRateService'
import { getStressDates, getStressRecords } from './stressService'

const PREFETCH_INTERVAL_MS = 5 * 60 * 1000

let lastPrefetchAt = 0
let inFlightPrefetch = null

export const prefetchHealthDataForOffline = async ({ force = false } = {}) => {
  if (!force && typeof navigator !== 'undefined' && !navigator.onLine) {
    return
  }

  const now = Date.now()
  if (!force && now - lastPrefetchAt < PREFETCH_INTERVAL_MS) {
    return
  }

  if (inFlightPrefetch) {
    return inFlightPrefetch
  }

  inFlightPrefetch = (async () => {
    try {
      await Promise.allSettled([
        getLatestBMIRecord(),
        getHeartRateDates(),
        getStressDates()
      ]).then(async (results) => {
        const heartRateDates = results[1]?.status === 'fulfilled' ? results[1].value?.data?.dates : null
        const stressDates = results[2]?.status === 'fulfilled' ? results[2].value?.data?.dates : null

        const followUps = []

        if (Array.isArray(heartRateDates) && heartRateDates.length > 0) {
          followUps.push(getHeartRateRecords({ date: heartRateDates[0] }))
        }

        if (Array.isArray(stressDates) && stressDates.length > 0) {
          followUps.push(getStressRecords({ date: stressDates[0] }))
        }

        if (followUps.length > 0) {
          await Promise.allSettled(followUps)
        }
      })
    } catch {
      // Ignore prefetch failures to avoid blocking navigation.
    } finally {
      lastPrefetchAt = Date.now()
      inFlightPrefetch = null
    }
  })()

  return inFlightPrefetch
}
