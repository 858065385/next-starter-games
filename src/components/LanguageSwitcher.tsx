'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Locale, locales, localeNames } from '@/app/config/i18n'
import { useState, useRef, useEffect } from 'react'

/**
 * 语言切换器组件
 * 用于切换网站语言
 */
export function LanguageSwitcher({
  variant = 'dropdown',
}: {
  variant?: 'dropdown' | 'horizontal'
}) {
  const pathname = usePathname()
  const { locale: currentLocale } = useParams() as { locale: Locale }
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // 提取当前路径中的语言代码后的部分
  const pathnameWithoutLocale = pathname.split('/').slice(2).join('/')
  
  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  if (variant === 'horizontal') {
    return (
      <div className="flex items-center space-x-4">
        {locales.map((locale) => (
          <Link
            key={locale}
            href={`/${locale}/${pathnameWithoutLocale}`}
            className={`text-sm ${
              locale === currentLocale
                ? 'font-bold'
                : 'text-gray-600 '
            }`}
          >
            {localeNames[locale]}
          </Link>
        ))}
      </div>
    )
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-300 rounded-md border border-gray-600 hover:text-white hover:border-gray-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{localeNames[currentLocale]}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={`/${locale}/${pathnameWithoutLocale}`}
              className={`block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white ${
                locale === currentLocale ? 'font-bold text-white bg-gray-900' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {localeNames[locale]}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 