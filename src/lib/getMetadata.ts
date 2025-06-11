import { Locale } from '@/app/config/i18n'
import { getMessages } from './getMessages'

/**
 * 获取页面元数据
 * @param locale 语言环境
 * @param page 页面名称（home, about, products, contact等）
 * @returns 页面元数据对象
 */
export async function getPageMetadata(locale: Locale, page: string) {
  // 加载翻译
  const messages = await getMessages(locale)
  
  // 从消息中提取元数据
  const metadata = messages.metadata?.[page] || {}
  
  return {
    title: metadata.title || '',
    description: metadata.description || '',
  }
} 