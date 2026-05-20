import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '司诺 SiNova · 全球合规 AI 平台',
  description:
    '让全球任何一家公司,无论由服务商代理还是 SME 自助,都能像点外卖一样完成跨国合规。',
  icons: {
    // Inline SVG favicon — radar emoji
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📡</text></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-ink-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
