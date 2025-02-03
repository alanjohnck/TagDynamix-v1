import React from 'react';

const FeatureCard = ({ title, width = 'regular', color }) => {
  const colorClasses = {
    silver: 'bg-gradient-to-r from-gray-300 to-gray-400',
    teal: 'bg-emerald-400',
    white: 'bg-white',
    sage: 'bg-gradient-to-r from-emerald-300 to-teal-400',
    gray: 'bg-gray-500',
    darkTeal: 'bg-emerald-500',
  };

  return (
    <div 
      className={`
        ${colorClasses[color]}
        rounded-3xl p-4
        flex items-center justify-center
        transition-all duration-300 hover:scale-105
        shadow-lg hover:shadow-xl
        cursor-pointer
        ${width === 'wide' ? 'md:col-span-2 col-span-1' : 'col-span-1'}
        min-h-[100px]
        lg:min-h-[120px]
        text-center
      `}
    >
      <h3 className={`
        text-base sm:text-lg lg:text-xl
        ${color === 'gray' || color === 'darkTeal' || color === 'sage' 
          ? 'text-white' 
          : 'text-gray-800'}
      `}>
        {title}
      </h3>
    </div>
  );
};

const Features = () => {
  const topRow = [
    { title: 'Historian', color: 'silver' },
    { title: 'Recipe Manager', color: 'teal', width: 'wide' },
    { title: 'Mobile Access', color: 'white' },
    { title: 'Data Analytics', color: 'sage', width: 'wide' }
  ];

  const bottomRow = [
    { title: 'MES', color: 'white' },
    { title: 'AI', color: 'darkTeal' },
    { title: '3D Engine Visualization', color: 'gray', width: 'wide' },
    { title: 'Dynamic Report', color: 'teal' },
    { title: 'Transaction Manager', color: 'silver' }
  ];

  return (
    <div className="w-full min-h-screen px-3 sm:px-6 lg:px-8 py-8 flex flex-col justify-center bg-white">
      <div className="max-w-8xl mx-auto p-4">
        <h1 className="text-4xl sm:text-6xl lg:text-6xl font-bold mb-6 sm:mb-8">
          Unlock
        </h1>
        
        <div className="space-y-4">
          {/* Mobile layout (single column) for xs screens */}
          <div className="sm:hidden space-y-4">
            {[...topRow, ...bottomRow].map((feature, index) => (
              <FeatureCard 
                key={`mobile-${index}`}
                title={feature.title} 
                color={feature.color}
              />
            ))}
          </div>
          
          {/* Tablet and desktop layout */}
          <div className="hidden sm:block space-y-4">
            {/* Top row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {topRow.map((feature, index) => (
                <FeatureCard 
                  key={`top-${index}`}
                  title={feature.title} 
                  width={feature.width} 
                  color={feature.color}
                />
              ))}
            </div>
            
            {/* Bottom row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {bottomRow.map((feature, index) => (
                <FeatureCard 
                  key={`bottom-${index}`}
                  title={feature.title} 
                  width={feature.width} 
                  color={feature.color}
                />
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-center mt-6 sm:mt-8 text-sm sm:text-base">
          Schedule a call with us for expert assistance in sizing your application.
        </p>
      </div>
    </div>
  );
};

export default Features;