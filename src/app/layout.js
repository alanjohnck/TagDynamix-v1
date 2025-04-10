import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
});

export const metadata = {
  title: "TagDynamix - Industrial Automation & SCADA Solutions",
  description: "Expert solutions in HMI, SCADA, and MES systems. Offering custom visualization, migration, optimization, and AI integration for industrial automation. Specialized in FactoryTalk, Ignition, WinCC, and more.",
  keywords: [
    "Industrial Automation",
    "SCADA Systems",
    "HMI Development",
    "FactoryTalk Integration",
    "Ignition Platform",
    "WinCC Solutions",
    "Industrial AI Integration",
    "Custom Visualization",
    "System Migration",
    "Performance Optimization",
    "Quality Control Systems",
    "Industrial Analytics",
    "MQTT Integration",
    "Plant Automation",
    "Manufacturing Execution Systems",
    "Industrial IoT Solutions",
    "Rockwell Software",
    "Siemens Automation",
    "AVEVA Solutions",
    "Industrial Data Analytics",
    "HMI development",
    "SCADA development",
"MES Development",
"PLC code",
"Automation",
"HMI developers in UK",
"HMI developers in Ireland",
"SCADA developers in UK",
"SCADA developers in Ireland/ Germany /Sweden/ etc...",
"Visualization companies in europe/ UK/ Ireland"
  ],
  openGraph: {
    title: "TagDynamix - Industrial Automation & SCADA Solutions",
    description: "Transform your industrial operations with custom HMI/SCADA solutions, AI integration, and advanced analytics.",
    type: "website",
    locale: "en_US",
    siteName: "TagDynamix",
  },
  twitter: {
    title: "TagDynamix - Industrial Automation & SCADA Solutions",
    description: "Expert solutions in industrial automation, SCADA systems, and MES integration.",
  },
  alternates: {
    canonical: "https://tagdynamix.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  classification: "Industrial Automation Software",
  category: "Technology",
  applicationName: "TagDynamix",
  referrer: "origin-when-cross-origin",
  other: {
    "theme-color": "#ffffff",
  },
  authors: [
    { name: "TagDynamix" },
  ],
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <link rel="icon" href="./favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${inter.variable} display overflow-x-hidden`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}