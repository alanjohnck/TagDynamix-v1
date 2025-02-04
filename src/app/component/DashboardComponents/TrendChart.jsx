import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const TrendChart = () => {
  const [currentData, setCurrentData] = useState({
    batchId: 'TD-MCHY-20230223',
    currentStep: 'Form',
    stats: {
      materialFormed: 1600,
      infeed: 20,
      rejects: 568,
      outfeed: 1012
    }
  });

  // Generate initial process data
  const generateProcessData = () => {
    const baseValue = 4.68; // U value
    const points = Array.from({ length: 20 }, (_, i) => {
      return {
        point: i + 1,
        value: baseValue + (Math.random() * 4 - 2),
        ucl: 9.27,
        lcl: 0.09,
        target: baseValue
      };
    });
    return points;
  };

  const [processData, setProcessData] = useState(generateProcessData());
  const [selectedTab, setSelectedTab] = useState('processCapability');

  const tabs = [
    { id: 'processCapability', label: 'Process Capability' },
    { id: 'lengthMeasurement', label: 'Length Measurement' },
    { id: 'weightMeasurement', label: 'Weight Measurement' },
    { id: 'processDescription', label: 'Process Description' }
  ];

  // Update data periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setProcessData(prev => {
        const newData = [...prev];
        newData.forEach(point => {
          point.value = 4.68 + (Math.random() * 4 - 2);
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl h-full bg-white rounded-lg shadow-sm p-3">
      {/* Batch Information */}
      <div className="grid grid-cols-5 gap-4 mb-6 text-sm">
        <div>
          <span className="text-gray-500">Batch ID: </span><br />
          <span className="font-medium">{currentData.batchId}</span>
        </div>
        <div>
          <span className="text-gray-500">Current Step: </span>
          <span className="font-medium">{currentData.currentStep}</span>
        </div>
        <div>
          <span className="text-gray-500">Material Formed: </span>
          <span className="font-medium">{currentData.stats.materialFormed}</span>
        </div>
        <div>
          <span className="text-gray-500">Infeed: </span>
          <span className="font-medium">{currentData.stats.infeed}</span>
        </div>
        <div>
          <span className="text-gray-500">Rejects: </span>
          <span className="font-medium">{currentData.stats.rejects}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm ${
              selectedTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Graph */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={processData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="point"
              type="number"
              domain={[1, 20]}
              ticks={Array.from({ length: 20 }, (_, i) => i + 1)}
            />
            <YAxis 
              domain={[0, 12]}
              ticks={[0, 2, 4, 6, 8, 10, 12]}
            />
            <Tooltip />
            
            {/* UCL Line */}
            <ReferenceLine 
              y={9.27} 
              stroke="red" 
              strokeDasharray="3 3"
              //label={{ value: "UCL=9.27", position: "right", fill: "red" }}
            />
            
            {/* Target Line */}
            <ReferenceLine 
              y={4.68} 
              stroke="green"
              //label={{ value: "U=4.68", position: "right", fill: "green" }}
            />
            
            {/* LCL Line */}
            <ReferenceLine 
              y={0.09} 
              stroke="red" 
              strokeDasharray="3 3"
              //label={{ value: "LCL=0.09", position: "right", fill: "red" }}
            />

            {/* Process Values */}
            <Line 
              type="monotone"
              dataKey="value"
              stroke="#0000FF"
              dot={{ fill: "#0000FF" }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;