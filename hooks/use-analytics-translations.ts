"use client"

import { useLanguage } from '@/contexts/LanguageContext'
import analyticsTranslations from '@/locales/analytics'

export function useAnalyticsTranslations() {
  const { language } = useLanguage()
  
  // Return a translation function specifically for analytics
  const translate = (key: string): string => {
    // Check if the key exists in analytics translations
    const translation = analyticsTranslations[key as keyof typeof analyticsTranslations]
    if (translation?.[language]) {
      return translation[language]
    }
    
    // Return the key as fallback if translation is not found
    return key
  }
  
  return {
    t: translate,
    language
  }
}
