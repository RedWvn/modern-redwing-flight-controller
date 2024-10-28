'use client'

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import { Plane, CheckCircle2, Wifi, Battery, Cpu, Sliders, Ruler } from 'lucide-react'

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
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20"></div>
            <Plane className="w-32 h-32 mx-auto text-blue-600 relative z-10" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome to REDWING
          </h2>
          <p className="text-center mb-8 text-gray-600">
            Next-gen pre-flight assistant for Drones
          </p>
          <div className="mb-8 bg-gray-100 p-4 rounded-lg">
            <p className="text-center text-gray-700 font-medium">Aircraft: Redwing Nimbi 3</p>
            <p className="text-center text-gray-700 font-medium">System ID: 42</p>
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
            className={`w-full mt-8 py-3 rounded-lg text-white font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              checks.every(check => check.status === 'completed')
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!checks.every(check => check.status === 'completed')}
          >
            {checks.every(check => check.status === 'completed') ? 'Launch Flight' : 'Checks in Progress...'}
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
      </Routes>
    </Router>
  )
}