import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Stock Analysis Pro - Real-Time Stock Insights and Analysis",
  description: "Stock Analysis Pro offers comprehensive and real-time stock insights, analysis tools, and financial data for informed investment decisions. Track earnings, fundamentals, statistics, and more. The ultimate stock market companion for investors.",
  keywords: "stock analysis, stock insights, stock market, investment tools, real-time stock data, financial analysis, earnings reports, stock fundamentals, trading tools, investment platform, stock dashboard",
  author: "Tamzid Ullah",
  robots: "index, follow",
  og: {
    title: "Stock Analysis Pro - Real-Time Stock Insights and Analysis",
    description: "Comprehensive stock market analysis and insights for investors. Explore real-time data, earnings reports, and trading tools.",
    type: "website",
    url: "https://yourwebsite.com",
    image: "./web-app-manifest-512x512.png", // Replace with your OG image URL
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourtwitterhandle",
    title: "Stock Analysis Pro - Real-Time Stock Insights",
    description: "Stay ahead in the stock market with our analysis and real-time data tools.",
    image: "./web-app-manifest-512x512.png", // Replace with your Twitter image URL
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Stock Analysis Pro" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
