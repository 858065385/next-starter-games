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
    <footer className="bg-gray-100 py-8 mt-auto border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 版权信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Multilingual App</h3>
            <p className="text-gray-600">
              {t('footer.copyright', '© 2025 Multilingual App. All rights reserved.')}
            </p>
          </div>
          
          {/* 链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-600 hover:text-gray-900">
                  {t('footer.privacy', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-600 hover:text-gray-900">
                  {t('footer.terms', 'Terms of Service')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('footer.contact', 'Contact Us')}
            </h3>
            <address className="not-italic text-gray-600">
              <a href="mailto:info@multilingual-app.com" className="hover:text-gray-900">
                info@multilingual-app.com
              </a>
            </address>
          </div>
          
          {/* 语言切换 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('footer.language', 'Language')}
            </h3>
            <LanguageSwitcher variant="horizontal" />
          </div>
        </div>
      </div>
    </footer>
  )
} 