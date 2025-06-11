import { Locale, locales } from '@/app/config/i18n'
import { getMessages } from '@/lib/getMessages'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { geistSans, geistMono } from '../layout'

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
    <html lang={locale}>
      <head>
        {/* Font Awesome CDN */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Header locale={locale} messages={messages} />
        <main className="container mx-auto   flex-grow">
          {children}
        </main>
        <Footer locale={locale} messages={messages} />
      </body>
    </html>
  )
} 