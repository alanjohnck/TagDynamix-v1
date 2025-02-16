import React from 'react';

const ValueCard = ({ title, description }) => (
  <div className="max-w-md">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const GradientLogo = () => (
  <div className="w-40 h-40 rounded-3xl bg-gradient-to-b from-violet-600 via-purple-600 to-rose-500 flex items-center justify-center p-4">
    <div className="grid grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-4 h-4 bg-white rounded-full gap-4"></div>
      ))}
    </div>
  </div>
);

const Values = () => {
  const values = [
    {
      title: "Always Learning",
      description: "We deliver innovative, efficient, and future-ready solutions for our customers."
    },
    {
      title: "Collaborative",
      description: "Effective coordination and flawless execution."
    },
    {
      title: "Respect",
      description: "Effective coordination and flawless execution."
    }
  ];

  return (
    <div className="max-w-7xl h-[150vh] md:h-screen flex flex-col justify-center mx-auto px-6 py-20 bg-white text-black">
      {/* Logo and Title Section */}
      <div className="flex flex-col items-center space-y-8 mb-20">
        <GradientLogo />
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold">SMART VISUAL ZERO LAG</h1>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Left Column - Heading */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold leading-tight">
            We are technology consultants with a{' '}
            <span className="text-red-500">difference</span>
          </h2>
        </div>

        {/* Right Column - Values */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <ValueCard 
              key={index}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Values;