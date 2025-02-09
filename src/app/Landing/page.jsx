"use client"
import React from 'react'
import Hero from './Hero/Hero'
import HMISection from './HMI/HMISection'
import AnalyticsSection from './Analytics/Analytics'
import Footer from '../component/Footer'
import UNSSection from './UNS/UNS'
import DynamicExpert from './DynamicExpert/DynamicExpert'
import Platform from './Platforms/Platforms'
import InteractiveDashboard from './Dashboard/Dashboard'

function Landing() {
  return (
    <div  >
        <Hero />
        <HMISection />
        <AnalyticsSection />
        <UNSSection />
        <DynamicExpert />
        <InteractiveDashboard />
        <Platform />  
        <Footer />
    </div>
  )
}

export default Landing