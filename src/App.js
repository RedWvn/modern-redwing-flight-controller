'use client'

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import { Drone, CheckCircle2, Wifi, Battery, Cpu, Sliders, Ruler, MapPin, Upload, PlayCircle } from 'lucide-react'

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
          R
        </div>
        <h1 className="text-xl font-bold text-white">Redwing Flight Controller</h1>
      </div>
      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
    </header>
  )
}

function AnimatedDrone() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      <Drone className="w-48 h-48 text-blue-600 absolute animate-float" />
      <div className="w-48 h-48 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
    </div>
  )
}

function StartPage() {
  const [connectionState, setConnectionState] = useState('idle')
  const navigate = useNavigate()

  const handleConnect = () => {
    setConnectionState('connecting')
    setTimeout(() => {
      setConnectionState('connected')
    }, 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition-all duration-300 ease-in-out transform hover:scale-105">
          <AnimatedDrone />
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome to REDWING
          </h2>
          <p className="text-center mb-8 text-gray-600">
            Next-gen pre-flight assistant for Fighter UAV G
          </p>
          <div className="mb-8 bg-gray-100 p-4 rounded-lg">
            <p className="text-center text-gray-700 font-medium">Aircraft: Fighter UAV G</p>
            <p className="text-center text-gray-700 font-medium">System ID: 37</p>
          </div>
          {connectionState === 'idle' && (
            <button
              onClick={handleConnect}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Connect to Aircraft
            </button>
          )}
          {connectionState === 'connecting' && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-blue-600 font-medium">Establishing connection...</p>
            </div>
          )}
          {connectionState === 'connected' && (
            <>
              <p className="text-center text-green-500 mb-6 font-medium">Connected successfully</p>
              <button
                onClick={() => navigate('/preflight-checks')}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Proceed to Pre-flight Checks
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function PreFlightChecksPage() {
  const [checks, setChecks] = useState([
    { name: 'Auto Sensor Checks', icon: Cpu, status: 'pending' },
    { name: 'Motor Checks', icon: Sliders, status: 'pending' },
    { name: 'Servo Checks', icon: Sliders, status: 'pending' },
    { name: 'Range-finder Check', icon: Ruler, status: 'pending' },
    { name: 'Battery Check', icon: Battery, status: 'pending' },
  ])
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecks(checks.map(check => ({ ...check, status: 'completed' })))
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Pre-flight Checks</h2>
          {checks.map((check, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg flex justify-between items-center transition-all duration-300 ease-in-out ${
                check.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <check.icon className={`w-6 h-6 mr-4 ${
                  check.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                }`} />
                <span className={`font-medium ${
                  check.status === 'completed' ? 'text-green-600' : 'text-gray-700'
                }`}>{check.name}</span>
              </div>
              {check.status === 'completed' ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"></div>
              )}
            </div>
          ))}
          <button
            onClick={() => navigate('/destination')}
            className={`w-full mt-8 py-3 rounded-lg text-white font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              checks.every(check => check.status === 'completed')
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!checks.every(check => check.status === 'completed')}
          >
            {checks.every(check => check.status === 'completed') ? 'Proceed to Destination Selection' : 'Checks in Progress...'}
          </button>
        </div>
      </main>
    </div>
  )
}

function DestinationPage() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [takeoffDirection, setTakeoffDirection] = useState('')
  const [landingZone, setLandingZone] = useState('')
  const [approach, setApproach] = useState('')

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Select Flight Details</h2>
          <div className="mb-6">
            <p className="font-medium mb-2">Current landing zone: HQ Hub location 1</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
              Select Destination
            </label>
            <select
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select...</option>
              <option value="HQ Node">HQ Node</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="takeoffDirection">
              Select Take-off Direction
            </label>
            <select
              id="takeoffDirection"
              value={takeoffDirection}
              onChange={(e) => setTakeoffDirection(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select...</option>
              <option value="18° [N]">18° [N]</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="landingZone">
              Select Landing Zone
            </label>
            <select
              id="landingZone"
              value={landingZone}
              onChange={(e) => setLandingZone(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select...</option>
              <option value="HQ Node location 2">HQ Node location 2</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="approach">
              Select Approach
            </label>
            <select
              id="approach"
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select...</option>
              <option value="295° [NW]">295° [NW]</option>
            </select>
          </div>
          <button
            onClick={() => navigate('/upload-mission')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  )
}

function UploadMissionPage() {
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      navigate('/takeoff')
    }, 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Upload Mission</h2>
          <div className="mb-6">
            <p className="font-medium mb-2">Waypoint file name:</p>
            <p className="text-gray-600">HQ_Hub_location1_to_HQ_Node_location2.waypoint</p>
          </div>
          <div className="mb-6">
            <p className="font-medium mb-2">Destination Details:</p>
            <p className="text-gray-600">HQ Node, 18°, HQ Node location 2</p>
          </div>
          <div className="mb-6">
            <p className="font-medium mb-2">Recorded aircraft Heading:</p>
            <p className="text-gray-600">27° | (2° - 38°)</p>
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`w-full ${
              isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-3 rounded-lg transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            {isUploading ? 'Uploading...' : 'Upload Mission'}
          </button>
        </div>
      </main>
    </div>
  )
}

function TakeoffPage() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)
  const [isLaunched, setIsLaunched] = useState(false)
  const [isTakeoffInitiated, setIsTakeoffInitiated] = useState(false)

  useEffect(() => {
    if (countdown > 0 && isTakeoffInitiated) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && isTakeoffInitiated) {
      setIsLaunched(true)
      setTimeout(() => navigate('/flight-success'), 2000)
    }
  }, [countdown, isTakeoffInitiated, navigate])

  const initiateCountdown = () => {
    setIsTakeoffInitiated(true)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-8 text-gray-800">Takeoff Sequence</h2>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Current Drone Status</h3>
            <ul className="text-left">
              <li className="flex items-center mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                <span>All pre-flight checks passed</span>
              </li>
              <li className="flex items-center mb-2">
                <Battery className="w-5 h-5 text-green-500 mr-2" />
                <span>Battery level: 100%</span>
              </li>
              <li className="flex items-center mb-2">
                <Wifi className="w-5 h-5 text-green-500 mr-2" />
                <span>Signal strength: Excellent</span>
              </li>
            </ul>
          </div>
          {!isTakeoffInitiated ? (
            <button
              onClick={initiateCountdown}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Initiate Takeoff
            </button>
          ) : !isLaunched ? (
            <>
              <p className="text-6xl font-bold text-blue-600 mb-8">{countdown}</p>
              <p className="text-xl text-gray-600">Preparing for takeoff...</p>
            </>
          ) : (
            <>
              <p className="text-4xl font-bold text-green-500 mb-8">Aircraft Launched!</p>
              <p className="text-xl text-gray-600">Redirecting to flight status...</p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function FlightSuccessPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Flight Successful</h2>
          <div className="text-6xl text-green-500 mb-8">
            <CheckCircle2 className="inline-block" />
          </div>
          <p className="text-xl text-gray-600 mb-8">Your aircraft has successfully completed its mission.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Return to Home
          </button>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/preflight-checks" element={<PreFlightChecksPage />} />
        <Route path="/destination" element={<DestinationPage />} />
        <Route path="/upload-mission" element={<UploadMissionPage />} />
        <Route path="/takeoff" element={<TakeoffPage />} />
        <Route path="/flight-success" element={<FlightSuccessPage />} />
      </Routes>
    </Router>
  )
}