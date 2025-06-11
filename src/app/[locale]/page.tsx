import { Locale } from '@/app/config/i18n'
import { HomeContent } from '@/components/HomeContent'

/**
 * 生成元数据
 */
export async function generateMetadata({
  params
}: {
  params: { locale: Locale }
}) {
  // 先await params，然后再解构
  const { locale } = await Promise.resolve(params)
  
  return {
    title: locale === 'en' 
      ? 'Welcome to Multilingual App' 
      : locale === 'zh' 
        ? '欢迎使用多语言应用' 
        : locale === 'es' 
          ? 'Bienvenido a la Aplicación Multilingüe' 
          : 'Bienvenue sur l\'Application Multilingue',
    description: locale === 'en' 
      ? 'A multilingual website built with Next.js' 
      : locale === 'zh' 
        ? '使用Next.js构建的多语言网站' 
        : locale === 'es' 
          ? 'Un sitio web multilingüe construido con Next.js' 
          : 'Un site web multilingue construit avec Next.js',
  }
}

/**
 * 首页组件 - 服务器端
 */
export default async function HomePage({
  params
}: {
  params: { locale: Locale }
}) {
  // 先await params，然后再解构
  const { locale } = await Promise.resolve(params)
  
  // 渲染客户端组件，传递必要的props
  return (
    <div>
      <HomeContent locale={locale} />
    </div>
  )
} 