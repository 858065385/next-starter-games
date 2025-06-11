'use client'

import { Locale } from '@/app/config/i18n'
import { ReactNode, memo } from 'react'

/**
 * 简化的提供者组件
 * 使用React.memo避免不必要的重新渲染
 */
export const TranslationsProvider = memo(function TranslationsProvider({
  locale,
  messages,
  children
}: {
  locale: Locale
  messages: any
  children: ReactNode
}) {
  return <>{children}</>
}) 