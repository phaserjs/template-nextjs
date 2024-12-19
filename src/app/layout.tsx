import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en" className={inter.className}>
        <body>{children}</body>
      </html>
    )
  }
 
export const metadata: Metadata = {
  title: 'Phaser Nextjs Template',
  description: 'A Phaser 3 Next.js project template that demonstrates Next.js with React communication and uses Vite for bundling.',
  icons: {icon: "/favicon.png"}
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1
}