import { Locale } from '@/app/config/i18n';

/**
 * 游戏数据类型定义
 */

export interface Game {
  id: string;
  title: string | LocalizedText;
  description: string | LocalizedText;
  instructions?: string | LocalizedText;
  category: string;
  tags: string[];
  weight?: number;
  width: number | string;
  height: number | string;
  thumb: string;
  url: string;
}

export interface Category {
  title: string;
  description: string;
  weight?: number;
  games: string[];
}

export interface LocalizedText {
  [key: string]: string;
}

export interface GamesData {
  games: {
    [key: string]: Game;
  };
  categories: {
    [key: string]: Category;
  };
}

/**
 * 获取本地化文本
 * @param text 文本或本地化文本对象
 * @param locale 当前语言
 * @param fallbackLocale 备用语言
 * @returns 本地化后的文本
 */
export function getLocalizedText(
  text: string | LocalizedText | undefined,
  locale: Locale,
  fallbackLocale: Locale = 'en'
): string {
  if (!text) return '';
  
  // 如果是字符串，直接返回
  if (typeof text === 'string') return text;
  
  // 如果有当前语言的翻译，返回该翻译
  if (text[locale]) return text[locale];
  
  // 如果有备用语言的翻译，返回备用语言翻译
  if (text[fallbackLocale]) return text[fallbackLocale];
  
  // 返回第一个可用的翻译
  const firstAvailable = Object.values(text)[0];
  return firstAvailable || '';
} 