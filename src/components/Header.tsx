import Link from 'next/link'
import { Locale } from '@/app/config/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

interface HeaderProps {
  locale: Locale
  messages: any
}

/**
 * 头部导航组件
 */
export function Header({ locale, messages }: HeaderProps) {
  const nav = messages.navigation || {}
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-800">
              {messages.home?.title || 'Multilingual App'}
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">
                    {nav.home || 'Home'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/about`} className="hover:text-blue-600 transition-colors">
                    {nav.about || 'About'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/products`} className="hover:text-blue-600 transition-colors">
                    {nav.products || 'Products'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/contact`} className="hover:text-blue-600 transition-colors">
                    {nav.contact || 'Contact'}
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* 语言切换器 */}
            <LanguageSwitcher variant="dropdown" />
          </div>
        </div>
      </div>
    </header>
  )
} 