import React from 'react';
import { useState, useEffect } from "react";
import { Menu, Search, Bell, Info, Home, Settings, BarChart2, AlertTriangle, X, TrendingUp } from "lucide-react";
import BarChartPanel from "@/app/component/DashboardComponents/BarChart";
import TrendChart from "@/app/component/DashboardComponents/TrendChart";
import AlarmMonitoring from "@/app/component/DashboardComponents/AlarmPage";
import HomePanel from "@/app/component/DashboardComponents/HomePanel";
import DashboardContent from "@/app/component/DashboardComponents/SettingsPanel";

const InteractiveDashboard = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [currentContent, setCurrentContent] = useState("Home");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 1024) {
        setShowLeftSidebar(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
    { id: "home", title: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "settings", title: "Settings", icon: <Settings className="w-5 h-5" /> },
    { id: "alarms", title: "Alarms", icon: <AlertTriangle className="w-5 h-5" /> },
    { id: "statistics", title: "Statistics", icon: <BarChart2 className="w-5 h-5" /> },
    { id: "trend", title: "Trend", icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const alarmTypes = [
    "High Pressure Warning",
    "Temperature Threshold Exceeded",
    "Flow Rate Below Minimum",
    "Voltage Fluctuation",
    "System Response Timeout",
    "Sensor Communication Error",
  ];

  const AlarmComponent = () => {
    const [alarmData, setAlarmData] = useState(alarmTypes[0]);
    const [countAlarm, setCountAlarm] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCountAlarm((prev) => (prev + 1) % alarmTypes.length);
      }, 5000);

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      setAlarmData(alarmTypes[countAlarm]);
    }, [countAlarm]);

    return (
      <div className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-full">
        {alarmData}
      </div>
    );
  };

  const searchItems = [
    "Pump 01", "Pump 02", "Valve 01", "Valve 02", "Valve 03",
    "Servo 01", "Servo 02", "Robot 01", "EM 01", "EM 02",
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getContentForSection = (section) => {
    switch (section) {
      case "settings":
        return <DashboardContent activeSection="settings" />;
      case "statistics":
        return <BarChartPanel />;
      case "trend":
        return <TrendChart />;
      case "alarms":
        return <AlarmMonitoring />;
      default:
        return <HomePanel />;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-black">
      <div className="w-full max-w-[90%] mx-auto h-screen p-2 sm:p-4 flex items-center justify-center">
        <div className="w-full h-full max-h-[1080px] bg-gray-50 flex flex-col rounded-lg overflow-hidden shadow-xl">
          {/* Dashboard Header */}
          <header className="h-14 sm:h-16 flex-shrink-0 border-b border-gray-200 bg-[#DEDEDE] flex items-center justify-between px-3 sm:px-6 shadow-md rounded-t-lg">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="min-w-[80px] sm:min-w-[120px]">
                <span className="text-sm sm:text-base font-medium">
                  {currentContent.charAt(0).toUpperCase() + currentContent.slice(1)}
                </span>
              </div>
            </div>

            <div className="text-red-500 text-xs sm:text-sm hidden md:block flex-1 text-center">
              <AlarmComponent />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-600 hidden sm:block text-right">
                <div>{formatDate(currentTime)}</div>
                <div>{formatTime(currentTime)}</div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setShowRightSidebar(!showRightSidebar)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 flex relative overflow-hidden">
            {/* Left Sidebar */}
            <aside
              className={`absolute lg:relative w-56 sm:w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20
                ${showLeftSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
              <div className="p-3 sm:p-4 flex justify-between items-center border-b">
                <span className="font-medium text-sm sm:text-base">Menu</span>
                <button
                  onClick={() => setShowLeftSidebar(false)}
                  className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <nav className="p-2 sm:p-3 space-y-1 overflow-y-auto h-[calc(100%-56px)]">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentContent(item.id);
                      if (isMobile) setShowLeftSidebar(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm
                      ${currentContent === item.id 
                        ? "bg-blue-50 text-blue-600" 
                        : "hover:bg-gray-50 text-gray-700"}`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white relative">
              <div className="w-full h-full p-4 sm:p-6">
                {getContentForSection(currentContent)}
              </div>
            </main>

            {/* Right Sidebar */}
            {showRightSidebar && (
              <aside className="absolute right-0 w-56 sm:w-72 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20">
                <div className="p-4 h-full flex flex-col">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search assets..."
                      className="w-full p-2.5 pr-10 border rounded-lg text-sm"
                    />
                    <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-1">
                      {searchItems.map((item, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                        >
                          <div className="w-3 h-3 bg-gray-200 rounded-full" />
                          <span className="text-gray-700">{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDashboard;