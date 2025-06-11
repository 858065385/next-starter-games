import { Locale } from '@/app/config/i18n'
import { LocaleParams } from '@/app/types/routeParams'

// 页面内的多语言文案
const translations = {
  en: {
    title: 'Privacy Policy',
    description: 'Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.',
    infoCollectionTitle: 'Information Collection',
    infoCollectionText: 'We may collect personal information, such as your name and email address, only when you voluntarily provide it to us, for example, by contacting us through our contact form.',
    useOfInfoTitle: 'Use of Information',
    useOfInfoText: 'We use the information we collect to respond to your inquiries, provide customer support, and improve our website and services.',
    cookiesTitle: 'Cookies',
    cookiesText: 'Our website may use cookies to enhance your experience. Cookies are small data files stored on your device that help us improve our website and your visit. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.'
  },
  zh: {
    title: '隐私政策',
    description: '您的隐私对我们很重要。本隐私政策解释了当您访问我们的网站时，我们如何收集、使用、披露和保护您的信息。',
    infoCollectionTitle: '信息收集',
    infoCollectionText: '我们只会在您自愿提供个人信息时（例如，通过我们的联系表单与我们联系）收集这些信息，例如您的姓名和电子邮件地址。',
    useOfInfoTitle: '信息的使用',
    useOfInfoText: '我们使用收集到的信息来回复您的询问、提供客户支持以及改进我们的网站和服务。',
    cookiesTitle: 'Cookies',
    cookiesText: '我们的网站可能会使用 Cookie 来增强您的体验。Cookie是存储在您设备上的小型数据文件，可帮助我们改进我们的网站和您的访问。您可以指示您的浏览器拒绝所有 Cookie 或在发送 Cookie 时进行提示。'
  },
  es: {
    title: 'Política de Privacidad',
    description: 'Su privacidad es importante para nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web.',
    infoCollectionTitle: 'Recopilación de Información',
    infoCollectionText: 'Podemos recopilar información personal, como su nombre y dirección de correo electrónico, solo cuando nos la proporciona voluntariamente, por ejemplo, al contactarnos a través de nuestro formulario de contacto.',
    useOfInfoTitle: 'Uso de la Información',
    useOfInfoText: 'Utilizamos la información que recopilamos para responder a sus consultas, brindar soporte al cliente y mejorar nuestro sitio web y nuestros servicios.',
    cookiesTitle: 'Cookies',
    cookiesText: 'Nuestro sitio web puede utilizar cookies para mejorar su experiencia. Las cookies son pequeños archivos de datos almacenados en su dispositivo que nos ayudan a mejorar nuestro sitio web y su visita. Puede indicar a su navegador que rechace todas las cookies o que indique cuándo se envía una cookie.'
  },
  fr: {
    title: 'Politique de Confidentialité',
    description: 'Votre vie privée est importante pour nous. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web.',
    infoCollectionTitle: "Collecte d'Informations",
    infoCollectionText: "Nous pouvons collecter des informations personnelles, telles que votre nom et votre adresse e-mail, uniquement lorsque vous nous les fournissez volontairement, par exemple, en nous contactant via notre formulaire de contact.",
    useOfInfoTitle: "Utilisation des Informations",
    useOfInfoText: "Nous utilisons les informations que nous collectons pour répondre à vos demandes, fournir un support client et améliorer notre site web et nos services.",
    cookiesTitle: 'Cookies',
    cookiesText: "Notre site web peut utiliser des cookies pour améliorer votre expérience. Les cookies sont de petits fichiers de données stockés sur votre appareil qui nous aident à améliorer notre site web et votre visite. Vous pouvez demander à votre navigateur de refuser tous les cookies ou d'indiquer quand un cookie est envoyé."
  }
};

/**
 * 生成元数据
 */
export async function generateMetadata({
  params
}: LocaleParams) {
  const { locale } = await Promise.resolve(params)
  const t = translations[locale] || translations.en
  
  return {
    title: `${t.title} - PlayNow`,
    description: t.description
  }
}

/**
 * 隐私政策页面组件
 */
export default async function PrivacyPolicyPage({
  params
}: LocaleParams) {
  const { locale } = await Promise.resolve(params)
  const t = translations[locale] || translations.en;
  
  return (
    <main className="main-content max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <p className="text-lg mb-4">{t.description}</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">{t.infoCollectionTitle}</h2>
      <p className="mb-4">{t.infoCollectionText}</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">{t.useOfInfoTitle}</h2>
      <p className="mb-4">{t.useOfInfoText}</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">{t.cookiesTitle}</h2>
      <p className="mb-4">{t.cookiesText}</p>
    </main>
  )
} 