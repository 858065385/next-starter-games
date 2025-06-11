import { Locale } from '@/app/config/i18n'

/**
 * 路由参数接口 - 包含语言环境
 */
export interface LocaleParams {
  params: {
    locale: Locale
  }
} 