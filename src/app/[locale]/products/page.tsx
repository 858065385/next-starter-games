import { Locale } from '@/app/config/i18n'
import { getMessages } from '@/lib/getMessages'
import { ProductsContent } from '@/components/ProductsContent'

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
      ? 'Products - Multilingual App' 
      : locale === 'zh' 
        ? '产品 - 多语言应用' 
        : locale === 'es' 
          ? 'Productos - Aplicación Multilingüe' 
          : 'Produits - Application Multilingue',
    description: locale === 'en' 
      ? 'Explore our range of products and services' 
      : locale === 'zh' 
        ? '探索我们的产品和服务范围' 
        : locale === 'es' 
          ? 'Explore nuestra gama de productos y servicios' 
          : 'Explorez notre gamme de produits et services',
  }
}

/**
 * 产品页面组件 - 服务器端
 */
export default async function ProductsPage({
  params
}: {
  params: { locale: Locale }
}) {
  // 先await params，然后再解构
  const { locale } = await Promise.resolve(params)
  
  // 加载翻译
  const messages = await getMessages(locale)
  
  // 渲染客户端组件，传递必要的props
  return (
    <div>
      <ProductsContent locale={locale} messages={messages} />
    </div>
  )
} 