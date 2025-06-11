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
      title: 'About Us - PlayNow',
      description: 'Welcome to PlayNow, your ultimate destination for free online games!'
    },
    zh: {
      title: '关于我们 - PlayNow',
      description: '欢迎来到 PlayNow，您免费在线游戏的终极目的地！'
    },
    es: {
      title: 'Sobre Nosotros - PlayNow',
      description: '¡Bienvenido a PlayNow, tu destino definitivo para juegos en línea gratuitos!'
    },
    fr: {
      title: 'À Propos de Nous - PlayNow',
      description: 'Bienvenue sur PlayNow, votre destination ultime pour les jeux en ligne gratuits !'
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
  
  // 渲染客户端组件，传递必要的props
  return (
    <div>
      <AboutContent locale={locale} />
    </div>
  )
} 