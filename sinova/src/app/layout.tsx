import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/i18n/client';
import { getServerLang } from '@/i18n/server';
import { lookup } from '@/i18n/dict';

export function generateMetadata(): Metadata {
  const lang = getServerLang();
  const name = lookup(lang, 'app.name');
  const tagline = lookup(lang, 'app.tagline');
  return {
    title: `${name} · ${tagline}`,
    description:
      lang === 'en'
        ? 'From cross-border tax to AR/AP and Web3 entities — let any company complete global compliance like ordering a takeout.'
        : '让全球任何一家公司,无论由服务商代理还是 SME 自助,都能像点外卖一样完成跨国合规。',
    icons: {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📡</text></svg>',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getServerLang();
  const htmlLang = lang === 'en' ? 'en' : 'zh-CN';
  return (
    <html lang={htmlLang}>
      <body className="bg-ink-50 text-slate-900 antialiased">
        <I18nProvider initialLang={lang}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
