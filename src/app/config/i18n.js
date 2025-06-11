/**
 * 多语言配置文件
 * 定义支持的语言、默认语言和类型
 */

// 支持的语言列表
const locales = ['en', 'zh', 'es', 'fr'];

// 默认语言
const defaultLocale = 'en';

// 语言显示名称
const localeNames = {
  'en': 'English',
  'zh': '中文',
  'es': 'Español',
  'fr': 'Français'
};

// CommonJS导出
module.exports = { locales, defaultLocale, localeNames }; 