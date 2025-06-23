
import React from 'react';
import ScrollAnimation from '../component/ScrollAnimation';
import HMISection from './HMI/HMISection';
import AnalyticsSection from './Analytics/Analytics';
import UNSSection from './UNS/UNS';
import DynamicExpert from './DynamicExpert/DynamicExpert';
import Platform from './Platforms/Platforms';
import Footer from '../component/Footer';


export default function Landing() {
  return (
    <>
    
      <div>
        <ScrollAnimation />
        <HMISection />
        <AnalyticsSection />
        <UNSSection />
        <DynamicExpert />
        <Platform />
        <Footer />
      </div>
    </>
  );
}
