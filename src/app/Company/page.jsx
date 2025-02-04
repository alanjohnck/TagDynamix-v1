import React from 'react'
import CompanyHero from './Sections/CompanyHero'
import HowWeDo from './Sections/HowWeDo'
import Values from './Sections/Values'
import Footer from '../component/Footer'
import CareersPage from './Sections/CareerPage'

function page() {
  return (
    <div>
        <CompanyHero />
        <Values />
        <HowWeDo />
        <CareersPage />
        <Footer />
    </div>
  )
}

export default page