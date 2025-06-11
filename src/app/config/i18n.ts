/**
 * 多语言配置文件
 * 定义支持的语言、默认语言和类型
 */

// 支持的语言列表
export const locales = ['en', 'zh', 'es', 'fr'] as const

// 语言类型定义
export type Locale = typeof locales[number]

// 默认语言
export const defaultLocale: Locale = 'en'

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'zh': '中文',
  'es': 'Español',
  'fr': 'Français'
}