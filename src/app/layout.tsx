import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo List - 现代化任务管理',
  description: '简洁高效的任务管理工具，支持颜色分类',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}