import React, { useState, useEffect } from "react";

const HomePanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState("Auto");
  const [flowRates, setFlowRates] = useState({
    productionFeed: 75,
    drawAcid: 50,
    compressedAir: 85,
    mixedLine: 65,
  });

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
        setFlowRates((prev) => ({
          productionFeed: Math.min(100, Math.max(0, prev.productionFeed + (Math.random() - 0.5) * 5)),
          drawAcid: Math.min(100, Math.max(0, prev.drawAcid + (Math.random() - 0.5) * 5)),
          compressedAir: Math.min(100, Math.max(0, prev.compressedAir + (Math.random() - 0.5) * 5)),
          mixedLine: Math.min(100, Math.max(0, prev.mixedLine + (Math.random() - 0.5) * 5)),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className=" max-w-7xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Status", value: isRunning ? "Running" : "Stopped", color: isRunning ? "text-gray-600" : "text-gray-500" },
          { title: "Runtime", value: formatTime(time) },
          {
            title: "Mode",
            value: (
              <select
                className="w-full p-2 bg-gray-200 rounded-md"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="Auto">Auto</option>
                <option value="Manual">Manual</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            ),
          },
          { title: "System Health", value: "Normal", color: "text-yellow-500" },
        ].map(({ title, value, color }, index) => (
          <div key={index} className="p-4 border rounded-lg shadow bg-white">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className={`mt-2 text-xl font-bold ${color || "text-gray-800"}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h3 className="font-semibold text-lg">System Controls</h3>
          <div className="mt-4 flex gap-4">
            <button
              className={`px-4 py-2 text-white rounded-md ${isRunning ? "bg-black" : "bg-gray-500"}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? "Stop Process" : "Start Process"}
            </button>
            <button
              className="px-4 py-2 border border-gray-500 text-gray-600 rounded-md hover:bg-gray-200"
              onClick={() => setTime(0)}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg shadow bg-white">
          <h3 className="font-semibold text-lg">Flow Rates</h3>
          <div className="mt-4 space-y-4">
            {Object.entries(flowRates).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-gray-800 font-medium">
                  <span>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <span>{value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-md h-3 mt-1">
                  <div className="h-3 bg-blue-300 rounded-md" style={{ width: `${value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;
