import { Locale, locales } from '@/app/config/i18n'
import { getMessages } from '@/lib/getMessages'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

/**
 * 为路由参数生成静态路径
 * 基于配置的所有支持语言
 */
export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

/**
 * 多语言布局组件
 * 简化版本，不使用TranslationsProvider
 */
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  // 先await params，然后再解构
  const { locale } = await Promise.resolve(params)
  
  // 加载翻译
  const messages = await getMessages(locale)
  
  return (
    <div lang={locale} className="flex flex-col min-h-screen">
      <Header locale={locale} messages={messages} />
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  )
} 