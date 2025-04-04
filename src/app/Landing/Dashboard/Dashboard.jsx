"use client"
import { useState, useEffect } from "react"
import { Menu, Search, Bell, Info, Home, Settings, BarChart2, AlertTriangle, X, TrendingUp } from "lucide-react"
import { People } from "@mui/icons-material"
import BarChartPanel from "@/app/component/DashboardComponents/BarChart"
import TrendChart from "@/app/component/DashboardComponents/TrendChart"
import AlarmMonitoring from "@/app/component/DashboardComponents/AlarmPage"
import HomePanel from "@/app/component/DashboardComponents/HomePanel"
import DashboardContent from "@/app/component/DashboardComponents/SettingsPanel"

const InteractiveDashboard = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [currentContent, setCurrentContent] = useState("Home")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [count, setCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 1024) {
        setShowLeftSidebar(true)
      } else {
        setShowLeftSidebar(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const navItems = [
    { id: "home", title: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "settings", title: "Settings", icon: <Settings className="w-5 h-5" /> },
    { id: "alarms", title: "Alarms", icon: <AlertTriangle className="w-5 h-5" /> },
    { id: "statistics", title: "Statistics", icon: <BarChart2 className="w-5 h-5" /> },
    { id: "trend", title: "Trend", icon: <TrendingUp className="w-5 h-5" /> },
  ]

  const alarmTypes = [
    "High Pressure Warning",
    "Temperature Threshold Exceeded",
    "Flow Rate Below Minimum",
    "Voltage Fluctuation",
    "System Response Timeout",
    "Sensor Communication Error",
  ]

  const AlarmComponent = () => {
    const [alarmData, setAlarmData] = useState(alarmTypes[0])
    const [countAlarm, setCountAlarm] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setCountAlarm((prev) => (prev + 1) % alarmTypes.length)
      }, 5000)

      return () => clearInterval(interval)
    }, [])

    useEffect(() => {
      setAlarmData(alarmTypes[countAlarm])
    }, [countAlarm])

    return <div className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-full">{alarmData}</div>
  }

  const searchItems = [
    "Pump 01",
    "Pump 02",
    "Valve 01",
    "Valve 02",
    "Valve 03",
    "Servo 01",
    "Servo 02",
    "Robot 01",
    "EM 01",
    "EM 02",
  ]

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getContentForSection = (section) => {
    switch (section) {
      case "settings":
        return <DashboardContent activeSection="settings" />
      case "statistics":
        return <BarChartPanel />
      case "trend":
        return <TrendChart />
      case "alarms":
        return <AlarmMonitoring />
      default:
        return <HomePanel />
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-black flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-7xl h-full 2xl:h-[90vh] bg-gray-50 flex flex-col rounded-lg overflow-hidden">
        {/* Dashboard Header */}
        <header className="h-12 sm:h-16 flex-shrink-0 border-b border-gray-200 bg-[#DEDEDE] flex items-center justify-between px-2 sm:px-4 shadow-md rounded-t-lg">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="max-w-[80px] sm:max-w-[120px]">
              <span className="text-xs sm:text-sm font-medium truncate">
                {currentContent.charAt(0).toUpperCase() + currentContent.slice(1)}
              </span>
            </div>
            <span className="hidden sm:block">
              <People />
            </span>
          </div>

          <div className="text-red-500 text-xs sm:text-sm hidden sm:block">
            <AlarmComponent />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              <div>{formatDate(currentTime)}</div>
              <div>{formatTime(currentTime)}</div>
            </div>
            <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg hidden sm:block">
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex relative overflow-hidden">
          {/* Left Sidebar */}
          <div
            className={`absolute lg:relative w-48 sm:w-64 h-full bg-white shadow-md transform transition-transform duration-300 ease-in-out z-20
              ${showLeftSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          >
            <div className="p-2 sm:p-4 flex justify-between items-center border-b">
              <span className="font-medium text-sm sm:text-base">Menu</span>
              <button
                onClick={() => setShowLeftSidebar(false)}
                className="lg:hidden p-1 sm:p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <nav className="p-2 sm:p-4 overflow-y-auto h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)]">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentContent(item.id)
                    if (isMobile) setShowLeftSidebar(false)
                  }}
                  className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors text-xs sm:text-sm
                    ${currentContent === item.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="w-full h-full flex justify-center items-start p-2 sm:p-4">
              {getContentForSection(currentContent)}
            </div>
          </div>

          {/* Right Sidebar */}
          {showRightSidebar && (
            <div className="absolute right-0 w-48 sm:w-64 md:w-80 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 overflow-y-auto">
              <div className="p-2 sm:p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Asset Search"
                    className="w-full p-1.5 sm:p-2 pr-8 border rounded-lg text-xs sm:text-sm"
                  />
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute right-2 top-2 text-gray-400" />
                </div>
                <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  {searchItems.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-2 p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InteractiveDashboard

