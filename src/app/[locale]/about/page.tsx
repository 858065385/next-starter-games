import { Locale } from '@/app/config/i18n'
import { getMessages } from '@/lib/getMessages'
import { AboutContent } from '@/components/AboutContent'
import { LocaleParams } from '@/app/types/routeParams'

/**
 * 生成元数据
 */
export async function generateMetadata({
  params
}: LocaleParams) {
  // 先await params，然后再解构
  const { locale } = await Promise.resolve(params)
  
  // 直接在页面中定义元数据
  const metadata = {
    en: {
      title: 'About Us - Multilingual App',
      description: 'Learn more about our company and our mission'
    },
    zh: {
      title: '关于我们 - 多语言应用',
      description: '了解更多关于我们公司和使命'
    },
    es: {
      title: 'Acerca de Nosotros - Aplicación Multilingüe',
      description: 'Aprenda más sobre nuestra empresa y nuestra misión'
    },
    fr: {
      title: 'À Propos de Nous - Application Multilingue',
      description: 'En savoir plus sur notre entreprise et notre mission'
    }
  }
  
  // 返回当前语言的元数据，如果不存在则使用英文
  return metadata[locale] || metadata.en
}

/**
 * 关于页面组件 - 服务器端
 */
export default async function AboutPage({
  params
}: LocaleParams) {
  // 先await params，然后再解构
  const { locale } = await Promise.resolve(params)
  
  // 加载翻译
  const messages = await getMessages(locale)
  
  // 渲染客户端组件，传递必要的props
  return (
    <div>
      <AboutContent locale={locale} messages={messages} />
    </div>
  )
} 