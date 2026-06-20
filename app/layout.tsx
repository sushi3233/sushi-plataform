import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Club da Putaria - Vídeos Pornô Grátis em HD',
    template: '%s | Club da Putaria',
  },
  description: 'Os melhores vídeos pornô grátis em HD. Assista milhares de vídeos adultos brasileiros com novinhas, amadores e muito mais.',
  keywords: ['pornô', 'vídeos adultos', 'sexo', 'brasileiro', 'grátis', 'hd', 'amador', 'novinha', 'vazado'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://www.clubdaputaria.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Club da Putaria',
    title: 'Club da Putaria - Vídeos Pornô Grátis em HD',
    description: 'Os melhores vídeos pornô grátis em HD. Assista milhares de vídeos adultos brasileiros.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club da Putaria - Vídeos Pornô Grátis em HD',
    description: 'Os melhores vídeos pornô grátis em HD. Assista milhares de vídeos adultos brasileiros.',
  },
  verification: {

  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-H7DG43BF8L" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H7DG43BF8L');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
