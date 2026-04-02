import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCachedBmiData, getCachedHeartRateDates, getCachedStressDates } from '../stores/userStore'
import { getHeartRateRecords } from '../services/heartRateService'
import { getStressStats } from '../services/stressService'

export function useAiPrompts() {
    const { t } = useI18n()

    const suggestedPrompts = computed(() => {
        const bmiData = getCachedBmiData()
        const heartRateDates = getCachedHeartRateDates()
        const stressDates = getCachedStressDates()

        const hasBmiData = bmiData && bmiData.bmi
        const hasHeartRateData = heartRateDates && heartRateDates.length > 0
        const hasStressData = stressDates && stressDates.length > 0

        if (!hasBmiData && !hasHeartRateData && !hasStressData) return []

        const bmiPrompts = []
        const heartRatePrompts = []
        const stressPrompts = []

        if (hasBmiData) {
            const bmi = parseFloat(bmiData.bmi)
            if (bmi < 18.5) {
                bmiPrompts.push(t('aiSupport.prompts.bmi.underweight.0'))
                bmiPrompts.push(t('aiSupport.prompts.bmi.underweight.1'))
            } else if (bmi >= 18.5 && bmi < 25) {
                bmiPrompts.push(t('aiSupport.prompts.bmi.normal.0'))
                bmiPrompts.push(t('aiSupport.prompts.bmi.normal.1'))
            } else if (bmi >= 25 && bmi < 30) {
                bmiPrompts.push(t('aiSupport.prompts.bmi.overweight.0'))
                bmiPrompts.push(t('aiSupport.prompts.bmi.overweight.1'))
            } else if (bmi >= 30) {
                bmiPrompts.push(t('aiSupport.prompts.bmi.obese.0'))
                bmiPrompts.push(t('aiSupport.prompts.bmi.obese.1'))
            }
        }

        if (hasHeartRateData) {
            heartRatePrompts.push(t('aiSupport.prompts.heartRate.0'))
            heartRatePrompts.push(t('aiSupport.prompts.heartRate.1'))
        }

        if (hasStressData) {
            stressPrompts.push(t('aiSupport.prompts.stress.0'))
            stressPrompts.push(t('aiSupport.prompts.stress.1'))
        }

        return [...bmiPrompts, ...heartRatePrompts, ...stressPrompts].slice(0, 6)
    })

    const buildPromptWithHealthData = async (prompt) => {
        const heartRateKeywords = ['heart rate', 'cardiovascular', 'resting heart', '心率', '靜止心率', '心跳']
        const stressKeywords = ['stress', 'stress score', 'pressure', 'tension', '壓力', '壓力指數']
        const isHeartRatePrompt = heartRateKeywords.some(kw => prompt.toLowerCase().includes(kw))
        const isStressPrompt = stressKeywords.some(kw => prompt.toLowerCase().includes(kw))

        const healthContext = []
        const bmiData = getCachedBmiData()
        const heartRateDates = getCachedHeartRateDates()
        const stressDates = getCachedStressDates()

        const computeHeartStats = (hourly) => {
            const hrs = (hourly || []).filter(h => h.avg > 0)
            if (!hrs.length) return { resting: 0, min: 0, max: 0, avg: 0 }
            const avgs = hrs.map(h => h.avg)
            const min = Math.min(...avgs)
            const max = Math.max(...avgs)
            const avg = Math.round(avgs.reduce((s, v) => s + v, 0) / avgs.length)
            const resting = Math.min(...hrs.map(h => h.min))
            return { resting, min, max, avg }
        }

        if (isHeartRatePrompt && heartRateDates?.length > 0) {
            try {
                const response = await getHeartRateRecords({ date: heartRateDates[0] })
                if (response.success && response.data.records.length > 0) {
                    const stats = computeHeartStats(response.data.records[0].hourlyData)
                    healthContext.push(`Resting Heart Rate: ${stats.resting} bpm`)
                    healthContext.push(`Max Heart Rate: ${stats.max} bpm`)
                    healthContext.push(`Min Heart Rate: ${stats.min} bpm`)
                    healthContext.push(`Average Heart Rate: ${stats.avg} bpm`)
                }
            } catch (e) { console.error('Failed to fetch heart rate stats:', e) }
        } else if (isStressPrompt && stressDates?.length > 0) {
            try {
                const response = await getStressStats({ date: stressDates[0] })
                if (response?.success && response.data) {
                    const s = response.data.stats || response.data || {}
                    const sMin = s.min ?? s.minValue ?? s.minStress ?? null
                    const sMax = s.max ?? s.maxValue ?? s.maxStress ?? null
                    const sAvg = s.avg ?? s.average ?? s.mean ?? null

                    if (sAvg !== null) healthContext.push(`Average Stress: ${sAvg} ${t('home.stress.unit')}`)
                    if (sMax !== null) healthContext.push(`Max Stress: ${sMax} ${t('home.stress.unit')}`)
                    if (sMin !== null) healthContext.push(`Min Stress: ${sMin} ${t('home.stress.unit')}`)
                }
            } catch (e) { console.error('Failed to fetch stress stats:', e) }
        } else if (bmiData?.bmi) {
            healthContext.push(`BMI: ${bmiData.bmi}`)
            if (bmiData.weight) healthContext.push(`Weight: ${bmiData.weight}kg`)
            if (bmiData.height) healthContext.push(`Height: ${bmiData.height}cm`)
        }

        return isStressPrompt ? prompt : (healthContext.length > 0 ? `${prompt}\n\nMy data: ${healthContext.join(', ')}` : prompt)
    }

    return {
        suggestedPrompts,
        buildPromptWithHealthData
    }
}
