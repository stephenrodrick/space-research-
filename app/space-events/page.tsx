"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ImageIcon, ExternalLink, Telescope, Rocket, Globe, Zap } from "lucide-react"
import Image from "next/image"

interface APODData {
  date: string
  explanation: string
  hdurl?: string
  media_type: string
  service_version: string
  title: string
  url: string
}

interface NASAImageData {
  collection: {
    items: Array<{
      data: Array<{
        title: string
        description: string
        date_created: string
        keywords?: string[]
      }>
      links?: Array<{
        href: string
        rel: string
      }>
    }>
  }
}

interface SpaceEvent {
  date: string
  title: string
  description: string
  category: string
  significance: string
}

export default function SpaceEvents() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [apodData, setApodData] = useState<APODData | null>(null)
  const [nasaImages, setNasaImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [spaceEvents, setSpaceEvents] = useState<SpaceEvent[]>([])

  useEffect(() => {
    fetchSpaceEvents()
  }, [selectedDate])

  const fetchSpaceEvents = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch APOD for selected date
      const apodResponse = await fetch(`/api/nasa/apod?date=${selectedDate}`)
      if (apodResponse.ok) {
        const apodResult = await apodResponse.json()
        setApodData(apodResult)
      }

      // Fetch NASA images for the year
      const year = new Date(selectedDate).getFullYear()
      const nasaResponse = await fetch(`/api/nasa/images?year=${year}`)
      if (nasaResponse.ok) {
        const nasaResult = await nasaResponse.json()
        setNasaImages(nasaResult.collection?.items?.slice(0, 8) || [])
      }

      // Get historical events for the date
      const events = getHistoricalEvents(selectedDate)
      setSpaceEvents(events)
    } catch (err) {
      setError("Failed to fetch space events data")
      console.error("Error fetching space events:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRandomDate = () => {
    const start = new Date(1995, 5, 16) // APOD started June 16, 1995
    const end = new Date()
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    setSelectedDate(randomDate.toISOString().split("T")[0])
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Space Events by Date</h1>
          <p className="text-gray-300">
            Discover what happened in space on any given date with NASA imagery and historical events
          </p>
        </div>

        {/* Enhanced Date Selector */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Time Machine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                min="1995-06-16" // APOD started on this date
                className="bg-slate-700 border-slate-600 text-white max-w-xs"
              />
              <div className="flex space-x-2">
                <Button onClick={fetchSpaceEvents} disabled={loading}>
                  {loading ? "Loading..." : "Explore Date"}
                </Button>
                <Button
                  onClick={getRandomDate}
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Random Date
                </Button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>
                • Explore any date from June 16, 1995 to today • Discover NASA's Astronomy Picture of the Day • Learn
                about historical space events
              </p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-900/20 border-red-700 mb-8">
            <CardContent className="pt-6">
              <p className="text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Historical Space Events for Selected Date */}
        {spaceEvents.length > 0 && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Rocket className="mr-2 h-5 w-5" />
                Historical Events on {formatDate(selectedDate)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {spaceEvents.map((event, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">{event.title}</h4>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {event.category}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                    <p className="text-blue-300 text-xs">{event.significance}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Astronomy Picture of the Day */}
        {apodData && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Astronomy Picture of the Day
                </span>
                <Badge variant="secondary">{formatDate(apodData.date)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {apodData.media_type === "image" ? (
                    <Image
                      src={apodData.url || "/placeholder.svg"}
                      alt={apodData.title}
                      width={500}
                      height={300}
                      className="rounded-lg object-cover w-full h-64"
                    />
                  ) : (
                    <div className="bg-slate-700 rounded-lg p-4 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300">Video content available</p>
                        <Button onClick={() => window.open(apodData.url, "_blank")} className="mt-2" size="sm">
                          View Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{apodData.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{apodData.explanation}</p>
                  <div className="flex space-x-2">
                    {apodData.hdurl && (
                      <Button
                        variant="outline"
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        onClick={() => window.open(apodData.hdurl, "_blank")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        HD Image
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      onClick={() =>
                        window.open(
                          `https://apod.nasa.gov/apod/ap${apodData.date.replace(/-/g, "").slice(2)}.html`,
                          "_blank",
                        )
                      }
                    >
                      <Telescope className="mr-2 h-4 w-4" />
                      NASA APOD
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced NASA Image Gallery */}
        {nasaImages.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">NASA Image Gallery - {new Date(selectedDate).getFullYear()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {nasaImages.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-700 rounded-lg overflow-hidden hover:bg-slate-600 transition-colors"
                  >
                    {item.links && item.links[0] && (
                      <Image
                        src={item.links[0].href || "/placeholder.svg"}
                        alt={item.data[0]?.title || "NASA Image"}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h4 className="text-white font-medium mb-2 line-clamp-2 text-sm">{item.data[0]?.title}</h4>
                      <p className="text-gray-300 text-xs mb-2 line-clamp-2">{item.data[0]?.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {item.data[0]?.date_created ? new Date(item.data[0].date_created).getFullYear() : "Unknown"}
                        </Badge>
                        {item.data[0]?.keywords && item.data[0].keywords.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {item.data[0].keywords[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Historical Events Timeline */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Space History Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAllHistoricalEvents()
                .slice(0, 10)
                .map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium">{event.title}</h4>
                        <Badge variant="outline">{event.date}</Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-1">{event.description}</p>
                      <p className="text-blue-300 text-xs">{event.significance}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Enhanced helper function to get historical events for a date
function getHistoricalEvents(dateString: string): SpaceEvent[] {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()

  const events: SpaceEvent[] = [
    {
      date: "July 20, 1969",
      title: "Apollo 11 Moon Landing",
      description: "Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon.",
      category: "Moon Landing",
      significance: "Fulfilled Kennedy's goal and demonstrated human capability to reach other worlds",
    },
    {
      date: "April 12, 1961",
      title: "First Human in Space",
      description: "Yuri Gagarin becomes the first human to journey into outer space.",
      category: "Human Spaceflight",
      significance: "Proved humans could survive in space and opened the era of human spaceflight",
    },
    {
      date: "October 4, 1957",
      title: "Sputnik 1 Launch",
      description: "The Soviet Union launches the first artificial satellite.",
      category: "Satellite",
      significance: "Started the Space Age and the Space Race between superpowers",
    },
    {
      date: "February 20, 1962",
      title: "John Glenn Orbits Earth",
      description: "John Glenn becomes the first American to orbit the Earth.",
      category: "Human Spaceflight",
      significance: "Restored American confidence in the Space Race",
    },
    {
      date: "June 16, 1963",
      title: "First Woman in Space",
      description: "Valentina Tereshkova becomes the first woman to travel to space.",
      category: "Human Spaceflight",
      significance: "Broke gender barriers in space exploration",
    },
    {
      date: "December 21, 1968",
      title: "Apollo 8 Moon Orbit",
      description: "First crewed spacecraft to leave Earth orbit and orbit the Moon.",
      category: "Moon Mission",
      significance: "Paved the way for the Moon landing and provided iconic 'Earthrise' photograph",
    },
    {
      date: "July 15, 1975",
      title: "Apollo-Soyuz Test Project",
      description: "First joint US-Soviet space mission.",
      category: "International Cooperation",
      significance: "Marked the end of the Space Race and beginning of international cooperation",
    },
    {
      date: "April 12, 1981",
      title: "First Space Shuttle Launch",
      description: "Space Shuttle Columbia launches on STS-1.",
      category: "Space Shuttle",
      significance: "Introduced reusable spacecraft technology",
    },
    {
      date: "January 28, 1986",
      title: "Challenger Disaster",
      description: "Space Shuttle Challenger breaks apart 73 seconds after launch.",
      category: "Tragedy",
      significance: "Led to major safety improvements in space programs",
    },
    {
      date: "February 20, 1986",
      title: "Mir Space Station Launch",
      description: "Soviet Union launches the Mir space station.",
      category: "Space Station",
      significance: "Demonstrated long-duration spaceflight capabilities",
    },
    {
      date: "April 24, 1990",
      title: "Hubble Space Telescope Launch",
      description: "NASA launches the Hubble Space Telescope.",
      category: "Observatory",
      significance: "Revolutionized our understanding of the universe",
    },
  ]

  return events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() + 1 === month && eventDate.getDate() === day
  })
}

// Function to get all historical events for timeline
function getAllHistoricalEvents(): SpaceEvent[] {
  return [
    {
      date: "October 4, 1957",
      title: "Sputnik 1",
      description: "First artificial satellite launched by Soviet Union",
      category: "Satellite",
      significance: "Started the Space Age",
    },
    {
      date: "April 12, 1961",
      title: "Yuri Gagarin",
      description: "First human in space",
      category: "Human Spaceflight",
      significance: "Proved humans could survive in space",
    },
    {
      date: "July 20, 1969",
      title: "Apollo 11",
      description: "First humans land on the Moon",
      category: "Moon Landing",
      significance: "Greatest achievement in space exploration",
    },
    {
      date: "April 24, 1990",
      title: "Hubble Launch",
      description: "Space telescope revolutionizes astronomy",
      category: "Observatory",
      significance: "Transformed our view of the universe",
    },
    {
      date: "November 20, 1998",
      title: "ISS First Module",
      description: "International Space Station construction begins",
      category: "Space Station",
      significance: "Symbol of international cooperation",
    },
    {
      date: "May 25, 2012",
      title: "SpaceX Dragon",
      description: "First commercial spacecraft to ISS",
      category: "Commercial",
      significance: "Started commercial spaceflight era",
    },
    {
      date: "December 25, 2021",
      title: "James Webb Launch",
      description: "Most powerful space telescope launched",
      category: "Observatory",
      significance: "Will see the first galaxies in the universe",
    },
    {
      date: "February 18, 2021",
      title: "Perseverance Landing",
      description: "Advanced Mars rover lands successfully",
      category: "Mars Exploration",
      significance: "Searching for signs of ancient life on Mars",
    },
    {
      date: "August 20, 1977",
      title: "Voyager 2 Launch",
      description: "Spacecraft to explore outer planets",
      category: "Deep Space",
      significance: "First spacecraft to reach interstellar space",
    },
    {
      date: "January 4, 2004",
      title: "Spirit Mars Landing",
      description: "Mars Exploration Rover begins mission",
      category: "Mars Exploration",
      significance: "Proved Mars once had water",
    },
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
