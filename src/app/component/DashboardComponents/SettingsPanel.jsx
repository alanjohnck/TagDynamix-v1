import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    retryBarcodeCount: '',
    maxConsecutiveFail: '',
    outfeedRejectTimeout: '',
    outfeedRejectBinTime: '',
    pickRetries: '',
    cameraRetries: '',
    machineMode: 'Auto',
    databaseMode: 'Local',
    packSealBypass: 'On',
    logoutTime: '60'
  });

  const [count ,setCount] = useState(30);
  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm px-20 pt-4">
      <div className=" grid grid-cols-2 gap-8">
        {/* Left Column - Numeric Inputs */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm">Retry Barcode Count</label>
              <input
                type="text"
                placeholder="####"
                className="w-24 px-3 py-1 border rounded text-center"
                value={settings.retryBarcodeCount}
                onChange={(e) => handleInputChange('retryBarcodeCount', e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-sm">Max Consecutive Fail Counter (Parts)</label>
              <input
                type="text"
                placeholder="####"
                className="w-24 px-3 py-1 border rounded text-center"
                value={settings.maxConsecutiveFail}
                onChange={(e) => handleInputChange('maxConsecutiveFail', e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-sm">Outfeed reject confirmation timeout (ms)</label>
              <input
                type="text"
                placeholder="####"
                className="w-24 px-3 py-1 border rounded text-center"
                value={settings.outfeedRejectTimeout}
                onChange={(e) => handleInputChange('outfeedRejectTimeout', e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-sm">Outfeed reject bin full detect time (ms)</label>
              <input
                type="text"
                placeholder="####"
                className="w-24 px-3 py-1 border rounded text-center"
                value={settings.outfeedRejectBinTime}
                onChange={(e) => handleInputChange('outfeedRejectBinTime', e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-sm">Pick Retries</label>
              <input
                type="text"
                placeholder="####"
                className="w-24 px-3 py-1 border rounded text-center"
                value={settings.pickRetries}
                onChange={(e) => handleInputChange('pickRetries', e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-sm">Camera Retries</label>
              <input
                type="text"
                placeholder="####"
                className="w-24 px-3 py-1 border rounded text-center"
                value={settings.cameraRetries}
                onChange={(e) => handleInputChange('cameraRetries', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Toggle Buttons & Controls */}
        <div className="space-y-6 bg-gray-100 p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm">Machine Mode</label>
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-1 rounded ${settings.machineMode === 'Auto' ? 'bg-white' : 'bg-gray-800 text-white'}`}
                  onClick={() => handleInputChange('machineMode', 'Auto')}
                >
                  Auto
                </button>
                <button 
                  className={`px-4 py-1 rounded ${settings.machineMode === 'Manual' ? 'bg-white' : 'bg-gray-800 text-white'}`}
                  onClick={() => handleInputChange('machineMode', 'Manual')}
                >
                  Manual
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm">Database Connection Mode</label>
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-1 rounded ${settings.databaseMode === 'Local' ? 'bg-white' : 'bg-gray-800 text-white'}`}
                  onClick={() => handleInputChange('databaseMode', 'Local')}
                >
                  Local
                </button>
                <button 
                  className={`px-4 py-1 rounded ${settings.databaseMode === 'Server' ? 'bg-white' : 'bg-gray-800 text-white'}`}
                  onClick={() => handleInputChange('databaseMode', 'Server')}
                >
                  Server
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm">Pack & Seal Bypass</label>
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-1 rounded ${settings.packSealBypass === 'On' ? 'bg-white' : 'bg-gray-800 text-white'}`}
                  onClick={() => handleInputChange('packSealBypass', 'On')}
                >
                  On
                </button>
                <button 
                  className={`px-4 py-1 rounded ${settings.packSealBypass === 'Off' ? 'bg-white' : 'bg-gray-800 text-white'}`}
                  onClick={() => handleInputChange('packSealBypass', 'Off')}
                >
                  Off
                </button>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex justify-between items-center">
                <label className="text-sm">Logout Time</label>
                <div className="flex items-center gap-2">
                  <span>{count}</span>
                  <button className="p-1 border rounded">
                    <Minus onClick={()=>{
                        setCount(count - 1);
                    }} className="w-4 h-4" />
                  </button>
                  <button className="p-1 border rounded">
                    <Plus onClick={()=>{
                        setCount(count + 1);
                    }} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const DashboardContent = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'settings':
        return <SettingsPanel />;
      default:
        return <SettingsPanel />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;