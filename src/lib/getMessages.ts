import { Locale } from '@/app/config/i18n'

// 缓存翻译数据，确保服务器和客户端返回相同的对象
const messagesCache: Record<Locale, any> = {
  en: {},
  zh: {},
  es: {},
  fr: {}
};

/**
 * 获取翻译消息
 * 返回缓存的空对象，确保服务器和客户端一致性
 * @param locale 语言代码
 * @returns 缓存的翻译对象
 */
export async function getMessages(locale: Locale) {
  return messagesCache[locale] || messagesCache.en;
} 