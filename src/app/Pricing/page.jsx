import React from 'react'
import PricingSection from './sections/PriceHero'
import Features from './sections/FeatureCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CareersPage from '../Company/Sections/CareerPage'

function page() {
  return (
    <div>
       <Navbar />
       <PricingSection />
       <Features />
       <Footer />
    </div>
  )
}

export default page