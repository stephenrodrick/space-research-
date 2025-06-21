"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MapPin,
  SatelliteIcon,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Clock,
  Globe,
  Orbit,
  Info,
  Eye,
  Target,
} from "lucide-react"

interface SatelliteData {
  satid: number
  satname: string
  intDesignator: string
  launchDate: string
  satlat: number
  satlng: number
  satalt: number
  satvel?: number
  azimuth?: number
  elevation?: number
  ra?: number
  dec?: number
  visibility?: string
  footprint?: number
  daynum?: number
  solar_lat?: number
  solar_lng?: number
  units?: string
}

export default function SatelliteTracker() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [userLat, setUserLat] = useState("40.7128")
  const [userLng, setUserLng] = useState("-74.0060")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const [viewer, setViewer] = useState<any>(null)
  const [satelliteEntities, setSatelliteEntities] = useState<any[]>([])
  const [passData, setPassData] = useState<any[]>([])
  const [loadingPasses, setLoadingPasses] = useState(false)
  const [satelliteStats, setSatelliteStats] = useState<any>(null)

  // Popular satellites with detailed info
  const popularSatellites = [
    { id: 25544, name: "ISS (ZARYA)", category: "Space Station", description: "International Space Station" },
    { id: 20580, name: "HST", category: "Observatory", description: "Hubble Space Telescope" },
    { id: 43013, name: "STARLINK-1007", category: "Communication", description: "SpaceX Starlink Constellation" },
    { id: 27424, name: "MOLNIYA 1-93", category: "Communication", description: "Russian Communication Satellite" },
    { id: 39084, name: "NOAA 19", category: "Weather", description: "Weather Monitoring Satellite" },
    { id: 33591, name: "NOAA 18", category: "Weather", description: "Environmental Monitoring" },
    { id: 28654, name: "SPOT 5", category: "Earth Observation", description: "Earth Imaging Satellite" },
    { id: 37849, name: "SMOS", category: "Earth Science", description: "Soil Moisture and Ocean Salinity" },
  ]

  useEffect(() => {
    // Initialize Cesium
    const script = document.createElement("script")
    script.src = "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Cesium.js"
    script.onload = initializeCesium
    document.head.appendChild(script)

    const link = document.createElement("link")
    link.href = "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Widgets/widgets.css"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
      if (document.head.contains(link)) document.head.removeChild(link)
    }
  }, [])

  // Auto-refresh satellite positions every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (satellites.length > 0) {
        updateSatellitePositions()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [satellites])

  const initializeCesium = async () => {
    if (cesiumContainerRef.current && (window as any).Cesium) {
      const Cesium = (window as any).Cesium

      try {
        Cesium.Ion.defaultAccessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZjE4NjM0OS03ZWJjLTRhYmUtYTJlNS1iYWJhZmVhZjFmMzQiLCJpZCI6MzE0MjI1LCJpYXQiOjE3NTA0ODQyNzZ9._88spO_wpl19I-u5V9h-axPpZ9ChIrXBnYDU-zngW0k"

        let terrainProvider: any = null

        try {
          if (Cesium.CesiumTerrainProvider && typeof Cesium.CesiumTerrainProvider.fromIonAssetId === "function") {
            terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1)
          }
        } catch (ionError) {
          console.warn("Ion terrain provider failed, trying legacy API:", ionError)
          try {
            if (typeof Cesium.createWorldTerrain === "function") {
              terrainProvider = Cesium.createWorldTerrain()
            }
          } catch (legacyError) {
            console.warn("Legacy terrain provider failed:", legacyError)
          }
        }

        if (!terrainProvider) {
          terrainProvider = new Cesium.EllipsoidTerrainProvider()
        }

        const newViewer = new Cesium.Viewer(cesiumContainerRef.current, {
          terrainProvider,
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          vrButton: false,
          geocoder: false,
          infoBox: false,
          selectionIndicator: false,
          shadows: true,
          shouldAnimate: true,
        })

        // Enhanced globe settings
        newViewer.scene.globe.enableLighting = true
        newViewer.scene.globe.dynamicAtmosphereLighting = true
        newViewer.scene.globe.atmosphereLightIntensity = 10.0
        newViewer.scene.globe.showGroundAtmosphere = true
        newViewer.scene.skyAtmosphere.show = true

        // Set initial camera position
        newViewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 15000000.0),
        })

        // Add click handler for satellite selection
        newViewer.cesiumWidget.screenSpaceEventHandler.setInputAction((event: any) => {
          const pickedObject = newViewer.scene.pick(event.position)
          if (pickedObject && pickedObject.id && pickedObject.id.satelliteData) {
            setSelectedSatellite(pickedObject.id.satelliteData)
            newViewer.trackedEntity = pickedObject.id
            fetchSatellitePasses(pickedObject.id.satelliteData.satid)
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        setViewer(newViewer)
        fetchSatellites()
      } catch (error) {
        console.error("Failed to initialize Cesium:", error)
        showFallbackMessage()
        fetchSatellites()
      }
    }
  }

  const showFallbackMessage = () => {
    if (cesiumContainerRef.current) {
      cesiumContainerRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full bg-slate-700 rounded-lg">
          <div class="text-center text-white p-8">
            <div class="text-6xl mb-4">🌍</div>
            <h3 class="text-xl font-bold mb-2">3D Globe Unavailable</h3>
            <p class="text-gray-300 mb-4">Unable to load 3D visualization</p>
            <p class="text-sm text-gray-400">Satellite data is still available in the sidebar</p>
          </div>
        </div>
      `
    }
  }

  const fetchSatellites = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      // Fetch popular satellites
      const satellitePromises = popularSatellites.map(async (sat) => {
        try {
          const response = await fetch(
            `/api/satellites/position?id=${sat.id}&observer_lat=${userLat}&observer_lng=${userLng}&observer_alt=0&seconds=300`,
          )
          const data = await response.json()
          return data.positions || []
        } catch (error) {
          console.error(`Error fetching satellite ${sat.id}:`, error)
          return []
        }
      })

      const results = await Promise.all(satellitePromises)
      const allSatellites = results.flat()

      if (allSatellites.length > 0) {
        setSatellites(allSatellites)
        visualizeSatellites(allSatellites)
        calculateSatelliteStats(allSatellites)
      } else {
        // Fallback to general satellite data
        const response = await fetch(`/api/satellites/above?lat=${userLat}&lng=${userLng}&alt=0&radius=90&category=0`)
        const data = await response.json()
        if (data && Array.isArray(data.above)) {
          setSatellites(data.above)
          visualizeSatellites(data.above)
          calculateSatelliteStats(data.above)
        } else {
          throw new Error("No satellites found")
        }
      }
    } catch (err: any) {
      console.error("Error fetching satellites:", err)
      setSatellites([])
      setErrorMsg(err.message ?? "Failed to fetch satellites")
    } finally {
      setLoading(false)
    }
  }

  const calculateSatelliteStats = (sats: SatelliteData[]) => {
    const stats = {
      total: sats.length,
      avgAltitude: sats.reduce((sum, sat) => sum + (sat.satalt || 0), 0) / sats.length,
      maxAltitude: Math.max(...sats.map((sat) => sat.satalt || 0)),
      minAltitude: Math.min(...sats.map((sat) => sat.satalt || 0)),
      avgVelocity:
        sats.filter((sat) => sat.satvel).reduce((sum, sat) => sum + (sat.satvel || 0), 0) /
        sats.filter((sat) => sat.satvel).length,
      visible: sats.filter((sat) => (sat.elevation || 0) > 0).length,
    }
    setSatelliteStats(stats)
  }

  const fetchSatellitePasses = async (satId: number) => {
    setLoadingPasses(true)
    try {
      const res = await fetch(
        `/api/satellites/visualpasses?id=${satId}&observer_lat=${userLat}&observer_lng=${userLng}&observer_alt=0&days=10&min_elevation=30`,
      )
      if (!res.ok) throw new Error("Visual-pass request failed")

      const data = await res.json()
      setPassData(data.passes || [])
    } catch (err) {
      console.error("Error fetching satellite passes:", err)
      setPassData([])
    } finally {
      setLoadingPasses(false)
    }
  }

  const visualizeSatellites = (satelliteData: SatelliteData[]) => {
    if (!viewer || !window.Cesium) return

    const Cesium = (window as any).Cesium

    // Clear existing satellite entities
    satelliteEntities.forEach((entity) => viewer.entities.remove(entity))
    setSatelliteEntities([])

    const newEntities: any[] = []

    satelliteData.forEach((satellite, index) => {
      if (satellite.satlat && satellite.satlng && satellite.satalt) {
        // Determine satellite color based on altitude
        let color = Cesium.Color.YELLOW
        if (satellite.satalt > 35000)
          color = Cesium.Color.RED // Geostationary
        else if (satellite.satalt > 1000)
          color = Cesium.Color.ORANGE // Medium Earth Orbit
        else if (satellite.satalt > 300) color = Cesium.Color.CYAN // Low Earth Orbit

        const entity = viewer.entities.add({
          id: `satellite_${satellite.satid}`,
          position: Cesium.Cartesian3.fromDegrees(satellite.satlng, satellite.satlat, satellite.satalt * 1000),
          billboard: {
            image: "/placeholder.svg?height=32&width=32",
            scale: 0.6,
            color: color,
            heightReference: Cesium.HeightReference.NONE,
          },
          point: {
            pixelSize: 10,
            color: color,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.NONE,
          },
          label: {
            text: satellite.satname,
            font: "12pt sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -40),
            show: selectedSatellite?.satid === satellite.satid,
          },
          satelliteData: satellite,
        })

        // Add orbital path
        if (satellite.satvel) {
          const positions = []
          const steps = 100

          for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * 2 * Math.PI
            positions.push(
              Cesium.Cartesian3.fromDegrees(
                satellite.satlng + Math.cos(angle) * (satellite.satalt / 6371) * 10,
                satellite.satlat + Math.sin(angle) * (satellite.satalt / 6371) * 10,
                satellite.satalt * 1000,
              ),
            )
          }

          viewer.entities.add({
            polyline: {
              positions: positions,
              width: 1,
              material: color.withAlpha(0.3),
              clampToGround: false,
            },
          })
        }

        newEntities.push(entity)
      }
    })

    setSatelliteEntities(newEntities)
  }

  const updateSatellitePositions = async () => {
    if (satellites.length === 0) return

    try {
      const updatedSatellites = await Promise.all(
        satellites.map(async (satellite) => {
          try {
            const response = await fetch(
              `/api/satellites/position?id=${satellite.satid}&observer_lat=${userLat}&observer_lng=${userLng}&observer_alt=0&seconds=1`,
            )
            const data = await response.json()
            return data.positions?.[0] || satellite
          } catch (error) {
            return satellite
          }
        }),
      )

      setSatellites(updatedSatellites)
      visualizeSatellites(updatedSatellites)
      calculateSatelliteStats(updatedSatellites)
    } catch (error) {
      console.error("Error updating satellite positions:", error)
    }
  }

  const searchSatellites = async () => {
    if (!searchTerm.trim()) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const response = await fetch(`/api/satellites/search?name=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data?.info) {
        const posResponse = await fetch(
          `/api/satellites/position?id=${data.info.satid}&observer_lat=${userLat}&observer_lng=${userLng}&observer_alt=0&seconds=300`,
        )
        const posData = await posResponse.json()

        if (posData?.positions) {
          setSatellites(posData.positions)
          visualizeSatellites(posData.positions)
          calculateSatelliteStats(posData.positions)
        }
      } else {
        throw new Error("Satellite not found")
      }
    } catch (error) {
      console.error("Error searching satellites:", error)
      setErrorMsg(error instanceof Error ? error.message : "Failed to search satellites")
    } finally {
      setLoading(false)
    }
  }

  const findSatellitesAbove = async () => {
    if (!userLat || !userLng) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const response = await fetch(`/api/satellites/above?lat=${userLat}&lng=${userLng}&alt=0&radius=90&category=0`)
      const data = await response.json()
      if (data && Array.isArray(data.above)) {
        setSatellites(data.above)
        visualizeSatellites(data.above)
        calculateSatelliteStats(data.above)
      } else {
        throw new Error("No satellites in range")
      }
    } catch (error) {
      console.error("Error finding satellites above location:", error)
      setErrorMsg(error instanceof Error ? error.message : "Failed to find satellites")
    } finally {
      setLoading(false)
    }
  }

  const toggleAnimation = () => {
    if (viewer) {
      viewer.clock.shouldAnimate = !isAnimating
      setIsAnimating(!isAnimating)
    }
  }

  const resetView = () => {
    if (viewer) {
      viewer.camera.setView({
        destination: (window as any).Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 15000000.0),
      })
      viewer.trackedEntity = undefined
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude.toString())
          setUserLng(position.coords.longitude.toString())
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const getVisibilityStatus = (elevation?: number) => {
    if (!elevation) return { status: "Unknown", color: "gray" }
    if (elevation > 10) return { status: "Excellent", color: "green" }
    if (elevation > 0) return { status: "Visible", color: "blue" }
    return { status: "Below Horizon", color: "red" }
  }

  const getOrbitType = (altitude?: number) => {
    if (!altitude) return "Unknown"
    if (altitude > 35000) return "Geostationary (GEO)"
    if (altitude > 2000) return "Medium Earth Orbit (MEO)"
    if (altitude > 160) return "Low Earth Orbit (LEO)"
    return "Very Low Earth Orbit"
  }

  // Safely filter satellites
  const filteredSatellites = satellites.filter((sat) =>
    (sat?.satname ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Advanced Satellite Tracker</h1>
          <p className="text-gray-300">
            Track satellites in real-time with detailed orbital data, pass predictions, and comprehensive analytics
          </p>
        </div>

        {/* Satellite Statistics */}
        {satelliteStats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{satelliteStats.total}</div>
                <div className="text-xs text-gray-400">Total Satellites</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{satelliteStats.visible}</div>
                <div className="text-xs text-gray-400">Currently Visible</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{satelliteStats.avgAltitude?.toFixed(0)}</div>
                <div className="text-xs text-gray-400">Avg Altitude (km)</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{satelliteStats.maxAltitude?.toFixed(0)}</div>
                <div className="text-xs text-gray-400">Max Altitude (km)</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{satelliteStats.avgVelocity?.toFixed(1)}</div>
                <div className="text-xs text-gray-400">Avg Velocity (km/s)</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{satelliteStats.minAltitude?.toFixed(0)}</div>
                <div className="text-xs text-gray-400">Min Altitude (km)</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Globe */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <SatelliteIcon className="mr-2 h-5 w-5" />
                    3D Earth View
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={toggleAnimation}
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetView}
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  ref={cesiumContainerRef}
                  className="w-full h-96 rounded-lg overflow-hidden"
                  style={{ minHeight: "500px" }}
                />
                <div className="mt-4 text-sm text-gray-400 space-y-1">
                  <p>
                    • <span className="text-yellow-400">●</span> Low Earth Orbit (LEO) •{" "}
                    <span className="text-orange-400">●</span> Medium Earth Orbit (MEO) •{" "}
                    <span className="text-red-400">●</span> Geostationary (GEO)
                  </p>
                  <p>• Click satellites for detailed information • Orbital paths shown as colored trails</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls and Info */}
          <div className="space-y-6">
            {/* Search */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Search & Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter satellite name (e.g., ISS, Hubble)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === "Enter" && searchSatellites()}
                  />
                  <Button onClick={searchSatellites} disabled={loading}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={fetchSatellites} className="w-full" disabled={loading} size="sm">
                    Load Popular
                  </Button>
                  <Button
                    onClick={updateSatellitePositions}
                    className="w-full"
                    disabled={loading}
                    size="sm"
                    variant="outline"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Observer Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Latitude"
                    value={userLat}
                    onChange={(e) => setUserLat(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Longitude"
                    value={userLng}
                    onChange={(e) => setUserLng(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={findSatellitesAbove} className="w-full" disabled={loading} size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    Find Above
                  </Button>
                  <Button onClick={getCurrentLocation} className="w-full" size="sm" variant="outline">
                    <Target className="h-4 w-4 mr-1" />
                    My Location
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Satellite List */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Live Satellites ({filteredSatellites.length})
                  {loading && <span className="ml-2 text-sm text-blue-400">Updating...</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {loading && satellites.length === 0 ? (
                    <p className="text-gray-400">Loading satellites...</p>
                  ) : filteredSatellites.length === 0 ? (
                    <p className="text-gray-400">No satellites found. Try searching or loading popular satellites.</p>
                  ) : (
                    filteredSatellites.map((satellite) => {
                      const visibility = getVisibilityStatus(satellite.elevation)
                      return (
                        <div
                          key={satellite.satid}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedSatellite?.satid === satellite.satid
                              ? "bg-blue-600"
                              : "bg-slate-700 hover:bg-slate-600"
                          }`}
                          onClick={() => {
                            setSelectedSatellite(satellite)
                            fetchSatellitePasses(satellite.satid)
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-white font-medium">{satellite.satname}</div>
                            <Badge
                              variant="outline"
                              className={`text-xs text-${visibility.color}-400 border-${visibility.color}-400`}
                            >
                              {visibility.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-300">
                            Alt: {satellite.satalt?.toFixed(0)} km
                            {satellite.satvel && ` • Vel: ${satellite.satvel?.toFixed(1)} km/s`}
                          </div>
                          <div className="text-xs text-gray-400">
                            {satellite.satlat?.toFixed(4)}°, {satellite.satlng?.toFixed(4)}°
                          </div>
                          <div className="text-xs text-blue-300 mt-1">{getOrbitType(satellite.satalt)}</div>
                        </div>
                      )
                    })
                  )}
                  {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected Satellite Detailed Info */}
        {selectedSatellite && (
          <Card className="bg-slate-800 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Info className="mr-2 h-5 w-5" />
                Detailed Satellite Information: {selectedSatellite.satname}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="overview" className="text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="orbital" className="text-white">
                    Orbital Data
                  </TabsTrigger>
                  <TabsTrigger value="passes" className="text-white">
                    Pass Predictions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Satellite ID:</span>
                            <span className="text-white">{selectedSatellite.satid}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Name:</span>
                            <span className="text-white">{selectedSatellite.satname}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Designator:</span>
                            <span className="text-white">{selectedSatellite.intDesignator || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Launch Date:</span>
                            <span className="text-white">{selectedSatellite.launchDate || "Unknown"}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Current Position</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Latitude:</span>
                            <span className="text-white">{selectedSatellite.satlat?.toFixed(6)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Longitude:</span>
                            <span className="text-white">{selectedSatellite.satlng?.toFixed(6)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Altitude:</span>
                            <span className="text-white">{selectedSatellite.satalt?.toFixed(2)} km</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Visibility & Tracking</h4>
                        <div className="space-y-2 text-sm">
                          {selectedSatellite.elevation !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Elevation:</span>
                              <span className="text-white">{selectedSatellite.elevation?.toFixed(2)}°</span>
                            </div>
                          )}
                          {selectedSatellite.azimuth !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Azimuth:</span>
                              <span className="text-white">{selectedSatellite.azimuth?.toFixed(2)}°</span>
                            </div>
                          )}
                          {selectedSatellite.footprint && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Footprint:</span>
                              <span className="text-white">{selectedSatellite.footprint} km</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Orbit Type:</span>
                            <span className="text-white">{getOrbitType(selectedSatellite.satalt)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Performance</h4>
                        <div className="space-y-3">
                          {selectedSatellite.satvel && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Velocity:</span>
                                <span className="text-white">{selectedSatellite.satvel?.toFixed(2)} km/s</span>
                              </div>
                              <Progress value={(selectedSatellite.satvel / 11) * 100} className="h-2 bg-slate-700" />
                            </div>
                          )}
                          {selectedSatellite.elevation !== undefined && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Visibility:</span>
                                <span className="text-white">
                                  {Math.max(0, selectedSatellite.elevation).toFixed(1)}°
                                </span>
                              </div>
                              <Progress
                                value={(Math.max(0, Math.min(90, selectedSatellite.elevation + 90)) / 90) * 100}
                                className="h-2 bg-slate-700"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orbital" className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <Orbit className="h-5 w-5 text-blue-400 mr-2" />
                          <h4 className="text-white font-medium">Orbital Elements</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Semi-major axis:</span>
                            <span className="text-white">{((selectedSatellite.satalt || 0) + 6371).toFixed(0)} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Period:</span>
                            <span className="text-white">
                              {(
                                (2 *
                                  Math.PI *
                                  Math.sqrt(Math.pow(((selectedSatellite.satalt || 0) + 6371) * 1000, 3) / 3.986e14)) /
                                60
                              ).toFixed(0)}{" "}
                              min
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Velocity:</span>
                            <span className="text-white">{selectedSatellite.satvel?.toFixed(3)} km/s</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <Globe className="h-5 w-5 text-green-400 mr-2" />
                          <h4 className="text-white font-medium">Ground Track</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Current Lat:</span>
                            <span className="text-white">{selectedSatellite.satlat?.toFixed(4)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Current Lng:</span>
                            <span className="text-white">{selectedSatellite.satlng?.toFixed(4)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ground Speed:</span>
                            <span className="text-white">
                              {selectedSatellite.satvel
                                ? (
                                    selectedSatellite.satvel * Math.cos(Math.atan(selectedSatellite.satalt / 6371))
                                  ).toFixed(2)
                                : "N/A"}{" "}
                              km/s
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <Eye className="h-5 w-5 text-purple-400 mr-2" />
                          <h4 className="text-white font-medium">Observer Data</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Range:</span>
                            <span className="text-white">
                              {Math.sqrt(
                                Math.pow(selectedSatellite.satalt || 0, 2) +
                                  Math.pow(
                                    6371 *
                                      Math.sin(
                                        (Math.abs((selectedSatellite.satlat || 0) - Number.parseFloat(userLat)) *
                                          Math.PI) /
                                          180,
                                      ),
                                    2,
                                  ),
                              ).toFixed(0)}{" "}
                              km
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Elevation:</span>
                            <span className="text-white">{selectedSatellite.elevation?.toFixed(2) || "N/A"}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Azimuth:</span>
                            <span className="text-white">{selectedSatellite.azimuth?.toFixed(2) || "N/A"}°</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="passes" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Upcoming Visible Passes</h4>
                    {loadingPasses && <span className="text-blue-400 text-sm">Loading passes...</span>}
                  </div>

                  {passData.length > 0 ? (
                    <div className="space-y-3">
                      {passData.slice(0, 5).map((pass, index) => (
                        <Card key={index} className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="grid md:grid-cols-4 gap-4">
                              <div>
                                <div className="text-xs text-gray-400">Start Time</div>
                                <div className="text-white text-sm">
                                  {new Date(pass.startUTC * 1000).toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400">Max Elevation</div>
                                <div className="text-white text-sm">{pass.maxEl}°</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400">Duration</div>
                                <div className="text-white text-sm">{pass.duration} sec</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400">Magnitude</div>
                                <div className="text-white text-sm">{pass.mag || "N/A"}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No visible passes found for the next 10 days</p>
                      <p className="text-gray-500 text-sm mt-2">Try adjusting your location or check back later</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
