"use client"
import React from 'react'
import HMISection from './HMI/HMISection'
import AnalyticsSection from './Analytics/Analytics'
import Footer from '../component/Footer'
import UNSSection from './UNS/UNS'
import DynamicExpert from './DynamicExpert/DynamicExpert'
import Platform from './Platforms/Platforms'
import InteractiveDashboard from './Dashboard/Dashboard'
import ScrollAnimation from '../component/ScrollAnimation'

function Landing() {
  return (
    <div>
        <ScrollAnimation />
        <HMISection />
        <AnalyticsSection />
        <UNSSection />
        <DynamicExpert />
{/* 
        <div className="hidden md:block">
        <InteractiveDashboard />
      </div> */}
        <Platform />  
        <Footer />
    </div>
  )
}

export default Landing