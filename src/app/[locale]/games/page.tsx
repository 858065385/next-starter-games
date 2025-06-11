import { Locale } from '@/app/config/i18n'
import { LocaleParams } from '@/app/types/routeParams'
import GamesList from '@/components/GamesList'

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
      title: 'Games - PlayNow',
      description: 'Browse and play our collection of online games'
    },
    zh: {
      title: '游戏 - PlayNow',
      description: '浏览并玩我们的在线游戏集合'
    },
    es: {
      title: 'Juegos - PlayNow',
      description: 'Navega y juega nuestra colección de juegos en línea'
    },
    fr: {
      title: 'Jeux - PlayNow',
      description: 'Parcourir et jouer à notre collection de jeux en ligne'
    }
  }
  
  // 返回当前语言的元数据，如果不存在则使用英文
  return metadata[locale] || metadata.en
}

/**
 * 游戏页面组件
 */
export default function GamesPage() {
  return (
    <div className="games-page">
      <GamesList />
    </div>
  )
} 