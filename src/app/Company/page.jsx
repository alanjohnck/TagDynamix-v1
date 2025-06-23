// app/company/page.tsx or page.jsx
import CompanyHero from './Sections/CompanyHero'
import HowWeDo from './Sections/HowWeDo'
import Values from './Sections/Values'
import Footer from '../component/Footer'
import CareersPage from './Sections/CareerPage'

export const metadata = {
  title: "About Our Company | Automation Experts - TagDynamix",
  description:
    "Discover how we work, our core values, and career opportunities at TagDynamix. From concept to commissioning, we deliver automation excellence.",
  keywords: [
    "Automation Company",
    "TagDynamix",
    "Industrial Automation",
    "Conception",
    "Development",
    "Commissioning",
    "FAT",
    "SAT",
    "SCADA",
    "PLC",
    "Industrial Careers"
  ],
  openGraph: {
    title: "About TagDynamix - Automation Experts",
    description:
      "Learn how TagDynamix transforms automation projects through a structured process of Conception, Development, and Commissioning.",
    url: "https://tagdynamix.com/company",
    siteName: "TagDynamix",
    images: [
      {
        url: "https://tagdynamix.com/og/company.png", // Add a relevant OG image
        width: 1200,
        height: 630,
        alt: "About TagDynamix"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "TagDynamix | Conception to Commissioning",
    description:
      "Explore how TagDynamix brings automation to life through innovation, values, and expert-driven execution.",
    images: ["https://tagdynamix.com/og/company.png"]
  },
  robots: {
    index: true,
    follow: true,
    nocache: false
  },
  metadataBase: new URL("https://tagdynamix.com")
};

export default function CompanyPage() {
  return (
    <div>
      <CompanyHero />
      <Values />
      <HowWeDo />
      <CareersPage />
      <Footer />
    </div>
  );
}
