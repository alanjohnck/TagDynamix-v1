import React from 'react'
import CompanyHero from './Sections/CompanyHero'
import HowWeDo from './Sections/HowWeDo'
import Navbar from '../components/Navbar'
import Values from './Sections/Values'
import Features from '../Pricing/sections/FeatureCard'
import Footer from '../components/Footer'
import CareersPage from './Sections/CareerPage'

function page() {
  return (
    <div>
        <Navbar />
        <CompanyHero />
        <Values />
        <HowWeDo />
        <CareersPage />

        <Footer />
   
    </div>
  )
}

export default page