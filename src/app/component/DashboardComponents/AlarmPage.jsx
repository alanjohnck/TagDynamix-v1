import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AlarmMonitoring = () => {
  const [alarmData, setAlarmData] = useState([]);
  const [activeAlarms, setActiveAlarms] = useState([]);

  // Generate initial alarm trend data
  const generateAlarmData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      point: i + 1,
      alarmCount: Math.floor(Math.random() * 8) + 2,
      ucl: 10,
      lcl: 2,
      target: 5
    }));
  };

  // Generate sample active alarms
  const generateActiveAlarms = () => {
    const alarmTypes = [
      'High Pressure Warning',
      'Temperature Threshold Exceeded',
      'Flow Rate Below Minimum',
      'Voltage Fluctuation',
      'System Response Timeout',
      'Sensor Communication Error'
    ];
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: `ALM-${Date.now()}-${i}`,
      type: alarmTypes[Math.floor(Math.random() * alarmTypes.length)],
      severity: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      status: Math.random() > 0.5 ? 'Active' : 'Acknowledged'
    }));
  };

  useEffect(() => {
    setAlarmData(generateAlarmData());
    setActiveAlarms(generateActiveAlarms());

    const timer = setInterval(() => {
      setAlarmData(prev => {
        const newData = [...prev];
        newData.forEach(point => {
          point.alarmCount = Math.floor(Math.random() * 8) + 2;
        });
        return newData;
      });
      
      if (Math.random() > 0.7) {
        setActiveAlarms(generateActiveAlarms());
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl h-full bg-white rounded-lg shadow-sm p-6">
      {/* Alarm Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" />
            <h3 className="text-red-600 font-medium">Critical Alarms</h3>
          </div>
          <p className="text-2xl font-bold mt-2">3</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Bell className="text-orange-600" />
            <h3 className="text-orange-600 font-medium">Active Alarms</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{activeAlarms.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            <h3 className="text-green-600 font-medium">Resolved Today</h3>
          </div>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600" />
            <h3 className="text-blue-600 font-medium">Avg. Response Time</h3>
          </div>
          <p className="text-2xl font-bold mt-2">5.2m</p>
        </div>
      </div>

      {/* Alarm Trend Chart */}
      {/* <div className="h-64 mb-6">
        <h3 className="text-lg font-medium mb-4">Alarm Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={alarmData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="point" />
            <YAxis domain={[0, 12]} />
            <Tooltip />
            <ReferenceLine y={10} stroke="red" strokeDasharray="3 3" label={{ value: "UCL", position: "right" }} />
            <ReferenceLine y={5} stroke="green" label={{ value: "Target", position: "right" }} />
            <ReferenceLine y={2} stroke="red" strokeDasharray="3 3" label={{ value: "LCL", position: "right" }} />
            <Line type="monotone" dataKey="alarmCount" stroke="#2563eb" dot={{ fill: "#2563eb" }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      {/* Active Alarms Table */}
      <div>
        <h3 className="text-lg font-medium mb-4">Active Alarms</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeAlarms.map((alarm) => (
                <tr key={alarm.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alarm.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alarm.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alarm.severity)}`}>
                      {alarm.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(alarm.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alarm.status === 'Active' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {alarm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlarmMonitoring;