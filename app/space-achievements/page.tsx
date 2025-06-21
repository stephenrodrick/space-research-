"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ExternalLink, Search, Rocket, Award, BookOpen, Globe, Telescope, Zap } from "lucide-react"
import Image from "next/image"

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  category: string
  image: string
  wikipediaTitle: string
  significance: string
  funFact?: string
}

interface WikipediaData {
  title: string
  extract: string
  thumbnail?: {
    source: string
  }
  content_urls: {
    desktop: {
      page: string
    }
  }
}

const spaceAchievements: Achievement[] = [
  {
    id: "sputnik",
    title: "Sputnik 1",
    description: "First artificial satellite to orbit Earth, marking the beginning of the Space Age.",
    date: "October 4, 1957",
    category: "Satellite",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "Sputnik_1",
    significance: "Started the Space Race and proved orbital mechanics",
    funFact: "It transmitted radio signals for 21 days before its batteries died",
  },
  {
    id: "gagarin",
    title: "First Human in Space",
    description: "Yuri Gagarin becomes the first human to journey into outer space and orbit Earth.",
    date: "April 12, 1961",
    category: "Human Spaceflight",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "Yuri_Gagarin",
    significance: "Proved humans could survive in space",
    funFact: "The flight lasted 108 minutes and Gagarin was 27 years old",
  },
  {
    id: "apollo11",
    title: "Apollo 11 Moon Landing",
    description: "Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon.",
    date: "July 20, 1969",
    category: "Moon Landing",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "Apollo_11",
    significance: "Fulfilled Kennedy's goal and demonstrated American technological prowess",
    funFact: "The computer that guided them had less power than a modern calculator",
  },
  {
    id: "voyager",
    title: "Voyager Program",
    description: "Twin spacecraft launched to explore the outer solar system and beyond.",
    date: "August 20, 1977",
    category: "Deep Space",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "Voyager_program",
    significance: "First spacecraft to reach interstellar space",
    funFact: "Voyager 1 is now over 14 billion miles from Earth and still transmitting",
  },
  {
    id: "hubble",
    title: "Hubble Space Telescope",
    description: "Revolutionary space telescope that transformed our understanding of the universe.",
    date: "April 24, 1990",
    category: "Observatory",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "Hubble_Space_Telescope",
    significance: "Revolutionized astronomy and provided stunning images of deep space",
    funFact: "Has traveled more than 4 billion miles and made over 1.5 million observations",
  },
  {
    id: "iss",
    title: "International Space Station",
    description: "Largest human-made object in space and a symbol of international cooperation.",
    date: "November 20, 1998",
    category: "Space Station",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "International_Space_Station",
    significance: "Longest continuous human presence in space",
    funFact: "Orbits Earth every 90 minutes at 17,500 mph",
  },
  {
    id: "mars-rovers",
    title: "Mars Exploration Rovers",
    description: "Robotic missions that revolutionized our understanding of Mars.",
    date: "January 4, 2004",
    category: "Planetary Exploration",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "Mars_Exploration_Rover",
    significance: "Proved Mars once had water and could have supported life",
    funFact: "Spirit and Opportunity were designed for 90-day missions but operated for years",
  },
  {
    id: "jwst",
    title: "James Webb Space Telescope",
    description: "Most powerful space telescope ever built, successor to Hubble.",
    date: "December 25, 2021",
    category: "Observatory",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "James_Webb_Space_Telescope",
    significance: "Can see the first galaxies formed after the Big Bang",
    funFact: "Its mirror is so sensitive it could detect a candle on the moon",
  },
  {
    id: "spacex-dragon",
    title: "SpaceX Dragon",
    description: "First commercial spacecraft to deliver cargo to the International Space Station.",
    date: "May 25, 2012",
    category: "Commercial Spaceflight",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "SpaceX_Dragon",
    significance: "Opened the era of commercial spaceflight",
    funFact: "First privately-funded spacecraft to orbit and recover successfully",
  },
  {
    id: "perseverance",
    title: "Mars Perseverance Rover",
    description: "Advanced rover searching for signs of ancient microbial life on Mars.",
    date: "February 18, 2021",
    category: "Planetary Exploration",
    image: "/placeholder.svg?height=200&width=300",
    wikipediaTitle: "Perseverance_(rover)",
    significance: "First mission designed specifically to search for past life on Mars",
    funFact: "Carries a helicopter named Ingenuity that achieved powered flight on Mars",
  },
]

const spaceTopics = [
  "International Space Station",
  "Mars Exploration",
  "Hubble Space Telescope",
  "James Webb Space Telescope",
  "SpaceX",
  "NASA",
  "Apollo Program",
  "Voyager",
  "Cassini",
  "New Horizons",
  "Kepler Space Telescope",
  "Exoplanets",
  "Black Holes",
  "Solar System",
  "Galaxy",
  "Big Bang",
  "Dark Matter",
  "Neutron Stars",
  "Asteroid Belt",
  "Kuiper Belt",
  "Oort Cloud",
  "Solar Wind",
  "Cosmic Radiation",
  "Space Shuttle",
  "Soyuz",
  "Falcon Heavy",
  "Starship",
  "Blue Origin",
  "Virgin Galactic",
  "ESA",
  "JAXA",
  "ISRO",
]

export default function SpaceAchievements() {
  const [achievements] = useState<Achievement[]>(spaceAchievements)
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>(spaceAchievements)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [wikipediaSearchTerm, setWikipediaSearchTerm] = useState("")
  const [wikipediaData, setWikipediaData] = useState<{ [key: string]: WikipediaData }>({})
  const [loadingWikipedia, setLoadingWikipedia] = useState<{ [key: string]: boolean }>({})
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([])

  const categories = ["All", ...Array.from(new Set(achievements.map((a) => a.category)))]

  useEffect(() => {
    filterAchievements()
  }, [selectedCategory, searchTerm])

  useEffect(() => {
    // Show random suggested topics
    const shuffled = [...spaceTopics].sort(() => 0.5 - Math.random())
    setSuggestedTopics(shuffled.slice(0, 6))
  }, [])

  const filterAchievements = () => {
    let filtered = achievements

    if (selectedCategory !== "All") {
      filtered = filtered.filter((achievement) => achievement.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (achievement) =>
          achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.significance.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredAchievements(filtered)
  }

  const fetchWikipediaData = async (achievement: Achievement) => {
    if (wikipediaData[achievement.id] || loadingWikipedia[achievement.id]) return

    setLoadingWikipedia((prev) => ({ ...prev, [achievement.id]: true }))

    try {
      const response = await fetch(`/api/wikipedia?title=${achievement.wikipediaTitle}`)
      const data = await response.json()

      if (data.pages) {
        const pageId = Object.keys(data.pages)[0]
        const pageData = data.pages[pageId]
        setWikipediaData((prev) => ({
          ...prev,
          [achievement.id]: pageData,
        }))
      }
    } catch (error) {
      console.error("Error fetching Wikipedia data:", error)
    } finally {
      setLoadingWikipedia((prev) => ({ ...prev, [achievement.id]: false }))
    }
  }

  const openWikipedia = (achievement: Achievement) => {
    const url = `https://en.wikipedia.org/wiki/${achievement.wikipediaTitle}`
    window.open(url, "_blank")
  }

  const searchWikipedia = (topic: string) => {
    const searchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(topic)}`
    window.open(searchUrl, "_blank")
  }

  const handleWikipediaSearch = () => {
    if (wikipediaSearchTerm.trim()) {
      searchWikipedia(wikipediaSearchTerm)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Human Space Achievements</h1>
          <p className="text-gray-300">
            Explore humanity's greatest milestones in space exploration and search for any space topic
          </p>
        </div>

        {/* Wikipedia Search Section */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Space Knowledge Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search any space topic (e.g., Black Holes, Mars, SpaceX)..."
                  value={wikipediaSearchTerm}
                  onChange={(e) => setWikipediaSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleWikipediaSearch()}
                />
                <Button onClick={handleWikipediaSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Globe className="h-4 w-4 mr-2" />
                  Search Wikipedia
                </Button>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Popular space topics:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((topic) => (
                    <Button
                      key={topic}
                      size="sm"
                      variant="outline"
                      onClick={() => searchWikipedia(topic)}
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 text-xs"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Filter Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white flex-1"
              />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card key={achievement.id} className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors">
              <CardHeader className="pb-3">
                <Image
                  src={achievement.image || "/placeholder.svg"}
                  alt={achievement.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white text-lg leading-tight">{achievement.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {achievement.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{achievement.description}</p>

                <div className="bg-slate-700 rounded-lg p-3 mb-3">
                  <p className="text-blue-300 text-xs font-medium mb-1">Significance:</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{achievement.significance}</p>
                </div>

                {achievement.funFact && (
                  <div className="bg-purple-900/30 rounded-lg p-3 mb-3">
                    <p className="text-purple-300 text-xs font-medium mb-1 flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      Fun Fact:
                    </p>
                    <p className="text-gray-300 text-xs leading-relaxed">{achievement.funFact}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Award className="mr-1 h-4 w-4" />
                    {achievement.date}
                  </div>
                </div>

                {/* Wikipedia Summary */}
                {wikipediaData[achievement.id] && (
                  <div className="bg-slate-700 rounded-lg p-3 mb-4">
                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                      {wikipediaData[achievement.id].extract}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => fetchWikipediaData(achievement)}
                    disabled={loadingWikipedia[achievement.id]}
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 flex-1"
                  >
                    <Telescope className="h-3 w-3 mr-1" />
                    {loadingWikipedia[achievement.id] ? "Loading..." : "Load Info"}
                  </Button>
                  <Button
                    onClick={() => openWikipedia(achievement)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Wikipedia
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-12">
              <Rocket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400">No achievements found matching your criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Timeline View */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Achievement Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredAchievements
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((achievement, index) => (
                  <div key={achievement.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-2 relative">
                      {index < filteredAchievements.length - 1 && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-slate-600"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                          {achievement.date}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                      <p className="text-blue-300 text-xs">{achievement.significance}</p>
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
