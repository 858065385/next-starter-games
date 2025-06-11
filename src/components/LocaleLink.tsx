'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Locale } from '@/app/config/i18n'

/**
 * 本地化链接组件
 * 自动为链接添加当前语言前缀
 */
export function LocaleLink({ 
  href, 
  children,
  ...rest 
}: React.ComponentProps<typeof Link>) {
  const { locale } = useParams() as { locale: Locale }
  
  // 如果链接是外部链接或者已经包含语言前缀，则不处理
  if (typeof href !== 'string' || href.startsWith('http') || href.startsWith('#')) {
    return <Link href={href} {...rest}>{children}</Link>
  }
  
  // 添加语言前缀
  const localizedHref = href.startsWith('/') 
    ? `/${locale}${href}` 
    : `/${locale}/${href}`
  
  return <Link href={localizedHref} {...rest}>{children}</Link>
} 