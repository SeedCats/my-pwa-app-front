import { getLatestBMIRecord } from './bmiService'
import { getHeartRateDates, getHeartRateRecords } from './heartRateService'
import { getStressDates, getStressRecords } from './stressService'
import { setCachedBmiData, setCachedHeartRateDates, setCachedStressDates, setCachedHeartRateRecord, setCachedStressRecord } from '../stores/userStore'

const PREFETCH_INTERVAL_MS = 5 * 60 * 1000
let lastPrefetchAt = 0
let inFlightPrefetch = null

export const prefetchHealthDataForOffline = async ({ force = false } = {}) => {
  if (!force && (typeof navigator !== 'undefined' && !navigator.onLine)) return
  if (!force && Date.now() - lastPrefetchAt < PREFETCH_INTERVAL_MS) return
  if (inFlightPrefetch) return inFlightPrefetch

  inFlightPrefetch = (async () => {
    try {
      const [bmiRes, hrDatesRes, stressDatesRes] = await Promise.all([
        getLatestBMIRecord().then(v => ({ status: 'fulfilled', value: v })).catch(e => ({ status: 'rejected', reason: e })),
        getHeartRateDates().then(v => ({ status: 'fulfilled', value: v })).catch(e => ({ status: 'rejected', reason: e })),
        getStressDates().then(v => ({ status: 'fulfilled', value: v })).catch(e => ({ status: 'rejected', reason: e }))
      ])

      if (bmiRes.status === 'fulfilled' && bmiRes.value?.success && bmiRes.value?.data) {
        const d = bmiRes.value.data
        setCachedBmiData({
          bmi: d.bmi,
          category: d.category,
          height: d.height,
          weight: d.weight,
          age: d.age || null,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt
        })
      }

      const hrDates = hrDatesRes.status === 'fulfilled' ? hrDatesRes.value?.data?.dates : null
      if (hrDates && Array.isArray(hrDates)) setCachedHeartRateDates(hrDates)

      const stressDates = stressDatesRes.status === 'fulfilled' ? stressDatesRes.value?.data?.dates : null
      if (stressDates && Array.isArray(stressDates)) setCachedStressDates(stressDates)

      const followUps = [
        ...(Array.isArray(hrDates) ? hrDates.map(date => 
            getHeartRateRecords({ date }).then(res => {
              if (res.success && res.data?.records?.length > 0) {
                setCachedHeartRateRecord(date, res.data.records[0])
              }
            })
        ) : []),
        ...(Array.isArray(stressDates) ? stressDates.map(date => 
            getStressRecords({ date }).then(res => {
              if (res.success && res.data?.records?.length > 0) {
                setCachedStressRecord(date, res.data.records[0])
              }
            })
        ) : [])
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
