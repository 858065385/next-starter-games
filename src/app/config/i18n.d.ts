/**
 * 多语言配置文件的类型声明
 */

// 支持的语言列表
export declare const locales: readonly ['en', 'zh', 'es', 'fr'];

// 语言类型定义
export type Locale = typeof locales[number];

// 默认语言
export declare const defaultLocale: Locale;

// 语言显示名称
export declare const localeNames: Record<Locale, string>; 