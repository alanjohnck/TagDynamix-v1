import React from 'react'
import PricingSection from './sections/PriceHero'
import Features from './sections/FeatureCard'
import Footer from '../component/Footer'

function page() {
  return (
    <div>
       <PricingSection />
       <Features />
       <Footer />
    </div>
  )
}

export default page