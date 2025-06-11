import { Locale, defaultLocale } from '@/app/config/i18n';

// 定义可以本地化的文本对象的类型
export type LocalizedText = {
  [key in Locale]?: string;
};

/**
 * 从多语言对象中获取当前语言的文本
 * @param field - 包含多语言翻译的对象或普通字符串
 * @param locale - 当前语言环境
 * @returns - 返回对应语言的字符串，如果不存在则按顺序回退
 */
export function getLocalizedText(
  field: LocalizedText | string | undefined, 
  locale: Locale
): string {
  if (!field) {
    return '';
  }
  // 如果字段本身就是字符串，直接返回
  if (typeof field === 'string') {
    return field;
  }
  // 按顺序返回：当前语言 -> 默认语言 -> 英文 -> 空字符串
  return field[locale] || field[defaultLocale] || field['en'] || '';
} 