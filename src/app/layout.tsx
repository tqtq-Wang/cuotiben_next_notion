// src/app/layout.tsx 添加全局样式
import './globals.css'
import 'katex/dist/katex.min.css' // 新增

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}