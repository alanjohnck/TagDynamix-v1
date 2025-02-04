import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';

const CustomBar = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
    />
  );
};

const BarChartPanel = () => {
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

  // Generate initial distribution data
  const generateDistributionData = () => {
    const baseValue = 50.00;
    return Array.from({ length: 11 }, (_, i) => {
      const offset = i - 5;
      const x = (baseValue + (offset * 0.04)).toFixed(2);
      const withinLimits = Math.abs(offset) <= 2;
      
      return {
        x,
        value: Math.max(10, 100 - Math.abs(offset) * 20),
        fill: withinLimits ? '#90EE90' : '#FFB6C1'
      };
    });
  };

  const [distributionData, setDistributionData] = useState(generateDistributionData());
  const [selectedTab, setSelectedTab] = useState('processCapability');

  // Update data periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setDistributionData(prev => 
        prev.map(point => ({
          ...point,
          value: Math.max(0, Math.min(100, point.value + (Math.random() - 0.5) * 10))
        }))
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'processCapability', label: 'Process Capability' },
    { id: 'lengthMeasurement', label: 'Length Measurement' },
    { id: 'weightMeasurement', label: 'Weight Measurement' },
    { id: 'processDescription', label: 'Process Description' }
  ];

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
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={distributionData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <XAxis 
              dataKey="x" 
              domain={[49.92, 50.08]}
              ticks={[49.92, 49.96, 50.00, 50.04, 50.08]}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`Value: ${value}`, 'Frequency']}
              labelFormatter={(label) => `Measurement: ${label}`}
            />
            {/* <ReferenceLine x="49.96" stroke="#purple" strokeDasharray="3 3" label="LSL" />
            <ReferenceLine x="50.00" stroke="#green" strokeDasharray="3 3" label="Target" />
            <ReferenceLine x="50.04" stroke="#red" strokeDasharray="3 3" label="USL" /> */}
            <Bar 
              dataKey="value" 
              shape={<CustomBar />}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartPanel;