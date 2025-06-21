"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Calculator,
  Rocket,
  Globe,
  Clock,
  Zap,
  Target,
  Orbit,
  Sun,
  Moon,
  Star,
  Compass,
  MapPin,
  Calendar,
  Timer,
  Gauge,
} from "lucide-react"

export default function SpaceTools() {
  const [deltaV, setDeltaV] = useState({ isp: 300, massRatio: 2.5, result: 0 })
  const [orbitalVelocity, setOrbitalVelocity] = useState({ altitude: 400, result: 0 })
  const [escapeVelocity, setEscapeVelocity] = useState({ planet: "Earth", result: 11.2 })
  const [lightTime, setLightTime] = useState({ distance: 384400, result: 0 })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [marsDistance, setMarsDistance] = useState(0)
  const [moonPhase, setMoonPhase] = useState({ phase: "", illumination: 0 })
  const [solarActivity, setSolarActivity] = useState({ kp: 2, activity: "Quiet" })

  // Planet data for calculations
  const planets = {
    Mercury: { mass: 3.301e23, radius: 2439.7, escapeVel: 4.25 },
    Venus: { mass: 4.867e24, radius: 6051.8, escapeVel: 10.36 },
    Earth: { mass: 5.972e24, radius: 6371, escapeVel: 11.18 },
    Mars: { mass: 6.39e23, radius: 3389.5, escapeVel: 5.03 },
    Jupiter: { mass: 1.898e27, radius: 69911, escapeVel: 59.5 },
    Saturn: { mass: 5.683e26, radius: 58232, escapeVel: 35.5 },
    Uranus: { mass: 8.681e25, radius: 25362, escapeVel: 21.3 },
    Neptune: { mass: 1.024e26, radius: 24622, escapeVel: 23.5 },
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      calculateMarsDistance()
      calculateMoonPhase()
      updateSolarActivity()
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const calculateDeltaV = () => {
    const result = deltaV.isp * 9.81 * Math.log(deltaV.massRatio)
    setDeltaV((prev) => ({ ...prev, result: Math.round(result) }))
  }

  const calculateOrbitalVelocity = () => {
    const earthRadius = 6371 // km
    const earthMu = 398600.4418 // km³/s²
    const r = earthRadius + orbitalVelocity.altitude
    const result = Math.sqrt(earthMu / r)
    setOrbitalVelocity((prev) => ({ ...prev, result: Math.round(result * 100) / 100 }))
  }

  const calculateLightTime = () => {
    const lightSpeed = 299792.458 // km/s
    const result = lightTime.distance / lightSpeed
    setLightTime((prev) => ({ ...prev, result: Math.round(result * 100) / 100 }))
  }

  const calculateMarsDistance = () => {
    // Simplified calculation - in reality this would use orbital mechanics
    const now = new Date()
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    const marsOrbitAngle = (dayOfYear * 0.524) % 360 // Mars orbital period ~687 days
    const earthOrbitAngle = (dayOfYear * 0.986) % 360 // Earth orbital period 365.25 days

    const angleDiff = Math.abs(marsOrbitAngle - earthOrbitAngle)
    const minDistance = 54.6 // million km
    const maxDistance = 401 // million km
    const distance = minDistance + (maxDistance - minDistance) * Math.sin((angleDiff * Math.PI) / 180)

    setMarsDistance(Math.round(distance * 10) / 10)
  }

  const calculateMoonPhase = () => {
    const now = new Date()
    const newMoon = new Date("2024-01-11") // Known new moon date
    const daysSinceNewMoon = (now - newMoon) / (1000 * 60 * 60 * 24)
    const lunarCycle = 29.53 // days
    const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle

    let phaseName = ""
    if (phase < 0.125) phaseName = "New Moon"
    else if (phase < 0.25) phaseName = "Waxing Crescent"
    else if (phase < 0.375) phaseName = "First Quarter"
    else if (phase < 0.5) phaseName = "Waxing Gibbous"
    else if (phase < 0.625) phaseName = "Full Moon"
    else if (phase < 0.75) phaseName = "Waning Gibbous"
    else if (phase < 0.875) phaseName = "Last Quarter"
    else phaseName = "Waning Crescent"

    const illumination = Math.round((1 - Math.abs(phase - 0.5) * 2) * 100)

    setMoonPhase({ phase: phaseName, illumination })
  }

  const updateSolarActivity = () => {
    // Simulated solar activity - in reality this would come from NOAA Space Weather
    const kp = Math.floor(Math.random() * 9)
    let activity = "Quiet"
    if (kp >= 5) activity = "Storm"
    else if (kp >= 4) activity = "Active"
    else if (kp >= 3) activity = "Unsettled"

    setSolarActivity({ kp, activity })
  }

  const getTimeToMars = () => {
    // Hohmann transfer orbit calculation (simplified)
    const transferTime = 259 // days for Hohmann transfer
    return transferTime
  }

  const getISSPosition = () => {
    // Simplified ISS position calculation
    const now = new Date()
    const minutes = now.getMinutes() + now.getSeconds() / 60
    const lat = Math.sin((minutes * Math.PI) / 45) * 51.6 // ISS max latitude
    const lng = ((minutes * 4) % 360) - 180 // Rough longitude calculation
    return { lat: lat.toFixed(2), lng: lng.toFixed(2) }
  }

  const issPos = getISSPosition()

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Space Tools & Calculators</h1>
          <p className="text-gray-300">
            Professional space mission planning tools, orbital calculators, and real-time space data
          </p>
        </div>

        {/* Real-time Space Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{currentTime.toUTCString().slice(17, 25)}</div>
              <div className="text-xs text-gray-400">UTC Time</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{marsDistance}M km</div>
              <div className="text-xs text-gray-400">Distance to Mars</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Moon className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{moonPhase.illumination}%</div>
              <div className="text-xs text-gray-400">{moonPhase.phase}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Sun className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">Kp {solarActivity.kp}</div>
              <div className="text-xs text-gray-400">{solarActivity.activity}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calculators" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="calculators" className="text-white">
              Orbital Calculators
            </TabsTrigger>
            <TabsTrigger value="mission" className="text-white">
              Mission Planning
            </TabsTrigger>
            <TabsTrigger value="tracking" className="text-white">
              Live Tracking
            </TabsTrigger>
            <TabsTrigger value="reference" className="text-white">
              Reference Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculators" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Delta-V Calculator */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Rocket className="mr-2 h-5 w-5" />
                    Delta-V Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Specific Impulse (s)</label>
                    <Input
                      type="number"
                      value={deltaV.isp}
                      onChange={(e) => setDeltaV((prev) => ({ ...prev, isp: Number.parseFloat(e.target.value) || 0 }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Mass Ratio</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={deltaV.massRatio}
                      onChange={(e) =>
                        setDeltaV((prev) => ({ ...prev, massRatio: Number.parseFloat(e.target.value) || 0 }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button onClick={calculateDeltaV} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{deltaV.result}</div>
                      <div className="text-gray-400 text-sm">m/s</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Orbital Velocity Calculator */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Orbit className="mr-2 h-5 w-5" />
                    Orbital Velocity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Altitude (km)</label>
                    <Input
                      type="number"
                      value={orbitalVelocity.altitude}
                      onChange={(e) =>
                        setOrbitalVelocity((prev) => ({ ...prev, altitude: Number.parseFloat(e.target.value) || 0 }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button onClick={calculateOrbitalVelocity} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{orbitalVelocity.result}</div>
                      <div className="text-gray-400 text-sm">km/s</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Orbital period:{" "}
                    {Math.round(
                      (2 * Math.PI * Math.sqrt(Math.pow(6371 + orbitalVelocity.altitude, 3) / 398600.4418)) / 60,
                    )}{" "}
                    minutes
                  </div>
                </CardContent>
              </Card>

              {/* Light Time Calculator */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    Light Travel Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Distance (km)</label>
                    <Input
                      type="number"
                      value={lightTime.distance}
                      onChange={(e) =>
                        setLightTime((prev) => ({ ...prev, distance: Number.parseFloat(e.target.value) || 0 }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" onClick={() => setLightTime((prev) => ({ ...prev, distance: 384400 }))}>
                      Moon
                    </Button>
                    <Button size="sm" onClick={() => setLightTime((prev) => ({ ...prev, distance: 54600000 }))}>
                      Mars
                    </Button>
                    <Button size="sm" onClick={() => setLightTime((prev) => ({ ...prev, distance: 149600000 }))}>
                      Sun
                    </Button>
                  </div>
                  <Button onClick={calculateLightTime} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{lightTime.result}</div>
                      <div className="text-gray-400 text-sm">seconds</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Escape Velocity */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Escape Velocity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Planet</label>
                    <select
                      value={escapeVelocity.planet}
                      onChange={(e) => {
                        const planet = e.target.value
                        setEscapeVelocity({ planet, result: planets[planet].escapeVel })
                      }}
                      className="w-full bg-slate-700 border-slate-600 text-white rounded-md p-2"
                    >
                      {Object.keys(planets).map((planet) => (
                        <option key={planet} value={planet}>
                          {planet}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{escapeVelocity.result}</div>
                      <div className="text-gray-400 text-sm">km/s</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Surface gravity:{" "}
                    {(
                      (planets[escapeVelocity.planet].mass * 6.674e-11) /
                      Math.pow(planets[escapeVelocity.planet].radius * 1000, 2)
                    ).toFixed(1)}{" "}
                    m/s²
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mission" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mission to Mars */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Mars Mission Planner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Distance:</span>
                      <span className="text-white">{marsDistance} million km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transfer Time:</span>
                      <span className="text-white">{getTimeToMars()} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delta-V Required:</span>
                      <span className="text-white">~9.3 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Launch Window:</span>
                      <span className="text-white">Every 26 months</span>
                    </div>
                  </div>
                  <Progress value={(marsDistance / 400) * 100} className="h-2" />
                  <div className="text-xs text-gray-400 text-center">Distance varies from 54.6M to 401M km</div>
                </CardContent>
              </Card>

              {/* Launch Window Calculator */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Launch Windows
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-medium mb-2">Upcoming Opportunities</h4>
                      <div className="space-y-2">
                        <div className="bg-slate-700 rounded p-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Mars:</span>
                            <span className="text-white">2026</span>
                          </div>
                        </div>
                        <div className="bg-slate-700 rounded p-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Venus:</span>
                            <span className="text-white">Every 19 months</span>
                          </div>
                        </div>
                        <div className="bg-slate-700 rounded p-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Jupiter:</span>
                            <span className="text-white">Every 13 months</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fuel Requirements */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Gauge className="mr-2 h-5 w-5" />
                    Fuel Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm">Payload Mass (kg)</label>
                      <Input type="number" defaultValue="1000" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Mission Type</label>
                      <select className="w-full bg-slate-700 border-slate-600 text-white rounded-md p-2">
                        <option>Low Earth Orbit</option>
                        <option>Geostationary Orbit</option>
                        <option>Moon Transfer</option>
                        <option>Mars Transfer</option>
                      </select>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-400">~15,000 kg</div>
                        <div className="text-gray-400 text-sm">Fuel Required</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Timeline */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Timer className="mr-2 h-5 w-5" />
                    Mission Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm">Launch Phase</div>
                        <div className="text-gray-400 text-xs">0-30 minutes</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm">Cruise Phase</div>
                        <div className="text-gray-400 text-xs">6-9 months</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm">Arrival & Operations</div>
                        <div className="text-gray-400 text-xs">2+ years</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* ISS Tracker */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    ISS Live Position
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Latitude:</span>
                      <span className="text-white">{issPos.lat}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Longitude:</span>
                      <span className="text-white">{issPos.lng}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Altitude:</span>
                      <span className="text-white">~408 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Speed:</span>
                      <span className="text-white">27,600 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orbital Period:</span>
                      <span className="text-white">92.9 minutes</span>
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="text-center text-sm text-gray-400">
                      Next pass calculation requires your location
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Solar Activity Monitor */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sun className="mr-2 h-5 w-5" />
                    Solar Activity Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kp Index:</span>
                      <span className="text-white">{solarActivity.kp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Activity Level:</span>
                      <span
                        className={`${
                          solarActivity.activity === "Storm"
                            ? "text-red-400"
                            : solarActivity.activity === "Active"
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {solarActivity.activity}
                      </span>
                    </div>
                    <Progress value={(solarActivity.kp / 9) * 100} className="h-2" />
                    <div className="text-xs text-gray-400">Kp scale: 0 (quiet) to 9 (extreme storm)</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="text-xs text-gray-400">
                      High solar activity can affect satellite operations and communications
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Asteroid Watch */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="mr-2 h-5 w-5" />
                    Near-Earth Objects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-slate-700 rounded p-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-white text-sm">2024 XY1</span>
                        <Badge variant="outline" className="text-xs">
                          Safe
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">Distance: 0.05 AU</div>
                    </div>
                    <div className="bg-slate-700 rounded p-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-white text-sm">Apophis</span>
                        <Badge variant="outline" className="text-xs">
                          Monitored
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">Next approach: 2029</div>
                    </div>
                    <div className="bg-slate-700 rounded p-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-white text-sm">Bennu</span>
                        <Badge variant="outline" className="text-xs">
                          Safe
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">Sample returned 2023</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Space Weather */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Compass className="mr-2 h-5 w-5" />
                    Space Weather
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Solar Wind Speed:</span>
                      <span className="text-white">420 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proton Density:</span>
                      <span className="text-white">8.2 p/cm³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Magnetic Field:</span>
                      <span className="text-white">5.1 nT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Aurora Activity:</span>
                      <span className="text-green-400">Low</span>
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Current conditions are favorable for space operations</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reference" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Physical Constants */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Physical Constants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Speed of Light:</span>
                      <span className="text-white">299,792,458 m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gravitational Constant:</span>
                      <span className="text-white">6.674×10⁻¹¹ m³/kg⋅s²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earth's Mass:</span>
                      <span className="text-white">5.972×10²⁴ kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earth's Radius:</span>
                      <span className="text-white">6,371 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Standard Gravity:</span>
                      <span className="text-white">9.80665 m/s²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Astronomical Unit:</span>
                      <span className="text-white">149,597,871 km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Orbital Velocities */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Common Orbital Velocities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">LEO (400 km):</span>
                      <span className="text-white">7.67 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ISS Orbit:</span>
                      <span className="text-white">7.66 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">GEO (35,786 km):</span>
                      <span className="text-white">3.07 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Moon Orbit:</span>
                      <span className="text-white">1.02 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earth Escape:</span>
                      <span className="text-white">11.18 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Solar Escape:</span>
                      <span className="text-white">42.1 km/s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Delta-V Requirements */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Mission Delta-V Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earth to LEO:</span>
                      <span className="text-white">9.4 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">LEO to GTO:</span>
                      <span className="text-white">2.5 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earth to Moon:</span>
                      <span className="text-white">12.6 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earth to Mars:</span>
                      <span className="text-white">12.3 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earth to Jupiter:</span>
                      <span className="text-white">20.1 km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interstellar:</span>
                      <span className="text-white">30+ km/s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rocket Performance */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Rocket Performance Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Falcon 9 (LEO):</span>
                      <span className="text-white">22.8 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Falcon Heavy (LEO):</span>
                      <span className="text-white">63.8 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Saturn V (LEO):</span>
                      <span className="text-white">140 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">SLS Block 1 (LEO):</span>
                      <span className="text-white">95 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Starship (LEO):</span>
                      <span className="text-white">100-150 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Soyuz (LEO):</span>
                      <span className="text-white">7.2 tons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
