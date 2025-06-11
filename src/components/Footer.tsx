'use client'

import Link from 'next/link'
import { Locale } from '@/app/config/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { getTranslation } from '@/lib/translateHelper'

interface FooterProps {
  locale: Locale
  messages: any
}

/**
 * 页脚组件
 * 显示版权信息、链接和语言切换器
 */
export function Footer({ locale, messages }: FooterProps) {
  // 使用翻译辅助函数
  const t = (path: string, defaultValue: string = path) => 
    getTranslation(messages, path, defaultValue);
  
  return (
    <footer className=" py-8 mt-auto border-t-[#333] border-t-1">
      <div className="container mx-auto px-4 flex   items-center justify-center" >
                <Link href={`/${locale}/privacy`} className="text-gray-600 hover:underline">
                  {t('footer.privacy', 'Privacy Policy')}
                </Link>
                <Link href={`/${locale}/about`} className="text-gray-600 ml-[10px] hover:underline">
                  {t('footer.about', 'About Us')}
                </Link>
                </div>
      {/* <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-16 mb-8">
          
         
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-600">
                  {t('footer.privacy', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-gray-600">
                  {t('footer.about', 'About Us')}
                </Link>
              </li>
            </ul>
          </div> */}
          
         
          {/* <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">
              {t('footer.language', 'Language')}
            </h3>
            <LanguageSwitcher variant="horizontal" />
          </div> */}
        
    </footer>
  )
} 