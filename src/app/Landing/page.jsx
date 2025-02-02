import React from 'react'
import Hero from './Hero/Hero'
import HMISection from './HMI/HMISection'
import AnalyticsSection from './Analytics/Analytics'

function Landing() {
  return (
    <div style={{ height: '300vh' }} >
        <Hero />
        <HMISection />
        <AnalyticsSection />
    </div>
  )
}

export default Landing