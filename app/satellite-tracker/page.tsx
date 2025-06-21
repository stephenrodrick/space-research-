"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, SatelliteIcon, Play, Pause, RotateCcw, Zap } from "lucide-react"

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
            // Zoom to satellite
            newViewer.trackedEntity = pickedObject.id
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
      // Fetch multiple satellite categories for better coverage
      const categories = [25544, 20580, 27424, 33591, 39084] // ISS, Hubble, GPS, etc.
      const satellitePromises = categories.map(async (satId) => {
        try {
          const response = await fetch(
            `/api/satellites/position?id=${satId}&observer_lat=${userLat}&observer_lng=${userLng}&observer_alt=0&seconds=300`,
          )
          const data = await response.json()
          return data.positions || []
        } catch (error) {
          console.error(`Error fetching satellite ${satId}:`, error)
          return []
        }
      })

      const results = await Promise.all(satellitePromises)
      const allSatellites = results.flat()

      if (allSatellites.length > 0) {
        setSatellites(allSatellites)
        visualizeSatellites(allSatellites)
      } else {
        // Fallback to general satellite data
        const response = await fetch(`/api/satellites/above?lat=${userLat}&lng=${userLng}&alt=0&radius=90&category=0`)
        const data = await response.json()
        if (data && Array.isArray(data.above)) {
          setSatellites(data.above)
          visualizeSatellites(data.above)
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

  const visualizeSatellites = (satelliteData: SatelliteData[]) => {
    if (!viewer || !window.Cesium) return

    const Cesium = (window as any).Cesium

    // Clear existing satellite entities
    satelliteEntities.forEach((entity) => viewer.entities.remove(entity))
    setSatelliteEntities([])

    const newEntities: any[] = []

    satelliteData.forEach((satellite, index) => {
      if (satellite.satlat && satellite.satlng && satellite.satalt) {
        // Create satellite entity with 3D model
        const entity = viewer.entities.add({
          id: `satellite_${satellite.satid}`,
          position: Cesium.Cartesian3.fromDegrees(
            satellite.satlng,
            satellite.satlat,
            satellite.satalt * 1000, // Convert km to meters
          ),
          billboard: {
            image: "/placeholder.svg?height=32&width=32",
            scale: 0.5,
            color: Cesium.Color.CYAN,
            heightReference: Cesium.HeightReference.NONE,
          },
          point: {
            pixelSize: 8,
            color: Cesium.Color.YELLOW,
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
            show: false, // Initially hidden
          },
          satelliteData: satellite, // Store satellite data for click handling
        })

        // Add orbital path if velocity data is available
        if (satellite.satvel) {
          const positions = []
          const steps = 50
          for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * 2 * Math.PI
            const orbitRadius = satellite.satalt * 1000
            positions.push(
              Cesium.Cartesian3.fromDegrees(
                satellite.satlng + Math.cos(angle) * 0.1,
                satellite.satlat + Math.sin(angle) * 0.1,
                orbitRadius,
              ),
            )
          }

          viewer.entities.add({
            polyline: {
              positions: positions,
              width: 2,
              material: Cesium.Color.CYAN.withAlpha(0.3),
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
        // Get position data for found satellite
        const posResponse = await fetch(
          `/api/satellites/position?id=${data.info.satid}&observer_lat=${userLat}&observer_lng=${userLng}&observer_alt=0&seconds=300`,
        )
        const posData = await posResponse.json()

        if (posData?.positions) {
          setSatellites(posData.positions)
          visualizeSatellites(posData.positions)
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

  // Safely filter satellites (handles missing satname)
  const filteredSatellites = satellites.filter((sat) =>
    (sat?.satname ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Real-Time Satellite Tracker</h1>
          <p className="text-gray-300">
            Track satellites in real-time on an interactive 3D globe with live orbital data
          </p>
        </div>

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
                <div className="mt-4 text-sm text-gray-400">
                  <p>
                    • Click on satellites to view details • Yellow dots represent satellites • Cyan trails show orbital
                    paths
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls and Info */}
          <div className="space-y-6">
            {/* Search */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Search Satellites</CardTitle>
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

            {/* Location-based Search */}
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
                    Use My Location
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
                    filteredSatellites.map((satellite) => (
                      <div
                        key={satellite.satid}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedSatellite?.satid === satellite.satid
                            ? "bg-blue-600"
                            : "bg-slate-700 hover:bg-slate-600"
                        }`}
                        onClick={() => setSelectedSatellite(satellite)}
                      >
                        <div className="text-white font-medium">{satellite.satname}</div>
                        <div className="text-sm text-gray-300">
                          Alt: {satellite.satalt?.toFixed(0)} km
                          {satellite.satvel && ` • Vel: ${satellite.satvel?.toFixed(1)} km/s`}
                        </div>
                        <div className="text-xs text-gray-400">
                          {satellite.satlat?.toFixed(4)}°, {satellite.satlng?.toFixed(4)}°
                        </div>
                        {satellite.elevation !== undefined && (
                          <div className="text-xs text-green-400">Elevation: {satellite.elevation?.toFixed(1)}°</div>
                        )}
                      </div>
                    ))
                  )}
                  {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Selected Satellite Info */}
            {selectedSatellite && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Satellite Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="text-white font-medium">{selectedSatellite.satname}</h3>
                    <Badge variant="secondary" className="mt-1">
                      ID: {selectedSatellite.satid}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-300">
                      <span className="text-gray-400">Launch Date:</span> {selectedSatellite.launchDate || "Unknown"}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Altitude:</span> {selectedSatellite.satalt?.toFixed(0)} km
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Position:</span> {selectedSatellite.satlat?.toFixed(4)}°,{" "}
                      {selectedSatellite.satlng?.toFixed(4)}°
                    </div>
                    {selectedSatellite.satvel && (
                      <div className="text-gray-300">
                        <span className="text-gray-400">Velocity:</span> {selectedSatellite.satvel?.toFixed(2)} km/s
                      </div>
                    )}
                    {selectedSatellite.elevation !== undefined && (
                      <div className="text-gray-300">
                        <span className="text-gray-400">Elevation:</span> {selectedSatellite.elevation?.toFixed(1)}°
                      </div>
                    )}
                    {selectedSatellite.azimuth !== undefined && (
                      <div className="text-gray-300">
                        <span className="text-gray-400">Azimuth:</span> {selectedSatellite.azimuth?.toFixed(1)}°
                      </div>
                    )}
                    <div className="text-gray-300">
                      <span className="text-gray-400">Designator:</span> {selectedSatellite.intDesignator || "N/A"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
