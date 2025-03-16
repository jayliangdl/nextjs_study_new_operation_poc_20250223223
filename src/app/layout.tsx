import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import '../components/componentRegistry.generated'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '我的Next.js应用',
  description: 'Next.js + TypeScript + Ant Design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ConfigProvider locale={zhCN}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
