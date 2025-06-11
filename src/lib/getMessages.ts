import { Locale, defaultLocale } from '@/app/config/i18n'
import en from '@/messages/en.json'
import zh from '@/messages/zh.json'
import es from '@/messages/es.json'
import fr from '@/messages/fr.json'

// 预加载翻译数据，避免客户端动态导入
const translations: Record<Locale, any> = {
  en,
  zh,
  es,
  fr
};

/**
 * 获取翻译消息
 * 返回预加载的翻译数据
 * @param locale 语言代码
 * @returns 翻译对象
 */
export async function getMessages(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
} 