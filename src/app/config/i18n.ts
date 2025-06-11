/**
 * 多语言配置文件 - TypeScript兼容层
 * 从 .js 文件导入，并为项目的其余部分提供类型
 */
const i18nModule = require('./i18n.js');
import type { Locale as TLocale, localeNames as TLocaleNames, locales as TLocales, defaultLocale as TDefaultLocale } from './i18n.d';

export const locales: typeof TLocales = i18nModule.locales;
export const defaultLocale: typeof TDefaultLocale = i18nModule.defaultLocale;
export const localeNames: typeof TLocaleNames = i18nModule.localeNames;
export type Locale = TLocale; 