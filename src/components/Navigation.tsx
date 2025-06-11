'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Locale, locales, localeNames } from '@/app/config/i18n'
import { getTranslation } from '@/lib/translateHelper'

interface NavigationProps {
  messages: any
}

/**
 * 导航组件
 * 包含主导航链接和语言切换功能
 */
export function Navigation({ messages }: NavigationProps) {
  const pathname = usePathname()
  const { locale } = useParams() as { locale: Locale }
  
  // 使用翻译辅助函数
  const t = (path: string, defaultValue: string = path) => 
    getTranslation(messages, path, defaultValue);
  
  // 提取当前路径中的语言代码后的部分
  const pathnameWithoutLocale = pathname.split('/').slice(2).join('/')
  
  return (
    <nav className="bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link 
              href={`/${locale}`} 
              className="flex-shrink-0 font-bold text-xl"
            >
              Multilingual
            </Link>
            
            {/* 主导航链接 */}
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href={`/${locale}`} 
                className="px-3 py-2 rounded-md hover:bg-gray-200"
              >
                {t('navigation.home', 'Home')}
              </Link>
              <Link 
                href={`/${locale}/about`} 
                className="px-3 py-2 rounded-md hover:bg-gray-200"
              >
                {t('navigation.about', 'About')}
              </Link>
              <Link 
                href={`/${locale}/products`} 
                className="px-3 py-2 rounded-md hover:bg-gray-200"
              >
                {t('navigation.products', 'Products')}
              </Link>
              <Link 
                href={`/${locale}/contact`} 
                className="px-3 py-2 rounded-md hover:bg-gray-200"
              >
                {t('navigation.contact', 'Contact')}
              </Link>
            </div>
          </div>
          
          {/* 语言切换器 */}
          <div className="flex items-center">
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-200">
                <span>{localeNames[locale]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 下拉菜单 */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}/${pathnameWithoutLocale}`}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      l === locale ? 'font-bold bg-gray-50' : ''
                    }`}
                  >
                    {localeNames[l]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 