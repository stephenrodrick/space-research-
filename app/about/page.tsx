"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Globe,
  Satellite,
  Calendar,
  Rocket,
  Database,
  Code,
  Zap,
  Users,
  Shield,
  Heart,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: Satellite,
      title: "Real-Time Satellite Tracking",
      description: "Track satellites in real-time using N2YO API with 3D visualization on CesiumJS globe",
      technologies: ["N2YO API", "CesiumJS", "Real-time Updates"],
    },
    {
      icon: Calendar,
      title: "Space Events Explorer",
      description: "Discover NASA's Astronomy Picture of the Day and historical space events",
      technologies: ["NASA APOD API", "NASA Images API", "Historical Data"],
    },
    {
      icon: Rocket,
      title: "Space Achievements Database",
      description: "Comprehensive database of human space exploration milestones with Wikipedia integration",
      technologies: ["Wikipedia API", "Custom Database", "Search Functionality"],
    },
    {
      icon: Globe,
      title: "Interactive 3D Globe",
      description: "Immersive 3D Earth visualization with satellite orbits and real-time positioning",
      technologies: ["CesiumJS", "WebGL", "3D Graphics"],
    },
  ]

  const apis = [
    {
      name: "N2YO Satellite API",
      description: "Real-time satellite tracking and orbital data",
      url: "https://www.n2yo.com/api/",
      features: ["Live satellite positions", "Orbital predictions", "Pass calculations", "Satellite search"],
    },
    {
      name: "NASA APOD API",
      description: "Astronomy Picture of the Day with detailed explanations",
      url: "https://api.nasa.gov/",
      features: ["Daily astronomy images", "Historical archive", "HD image access", "Educational content"],
    },
    {
      name: "NASA Images API",
      description: "Comprehensive NASA image and video library",
      url: "https://images.nasa.gov/",
      features: ["Space mission images", "Keyword search", "Metadata access", "Multiple formats"],
    },
    {
      name: "Wikipedia API",
      description: "Access to Wikipedia articles for space topics",
      url: "https://en.wikipedia.org/api/",
      features: ["Article summaries", "Full content access", "Search functionality", "Multilingual support"],
    },
    {
      name: "Cesium Ion",
      description: "3D geospatial platform for Earth visualization",
      url: "https://cesium.com/",
      features: ["3D terrain data", "Satellite imagery", "Real-time rendering", "WebGL optimization"],
    },
  ]

  const technologies = [
    { name: "Next.js 15", category: "Framework", description: "React framework with App Router" },
    { name: "TypeScript", category: "Language", description: "Type-safe JavaScript development" },
    { name: "Tailwind CSS", category: "Styling", description: "Utility-first CSS framework" },
    { name: "shadcn/ui", category: "Components", description: "Modern React component library" },
    { name: "CesiumJS", category: "3D Graphics", description: "WebGL-based 3D globe and mapping" },
    { name: "Lucide React", category: "Icons", description: "Beautiful & consistent icon library" },
    { name: "Vercel", category: "Deployment", description: "Serverless deployment platform" },
  ]

  const stats = [
    { label: "API Integrations", value: "5+", icon: Database },
    { label: "Real-time Updates", value: "30s", icon: Zap },
    { label: "Space Topics", value: "1000+", icon: Globe },
    { label: "Satellite Tracking", value: "Live", icon: Satellite },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">About SpaceViz</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A comprehensive space exploration platform that brings the cosmos to your fingertips through real-time
            satellite tracking, historical space events, and interactive 3D visualization.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Code className="h-4 w-4 mr-2" />
              Open Source
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Real-time Data
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              Educational
            </Badge>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-600 rounded-lg flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* APIs Used */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">APIs & Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apis.map((api, index) => (
                <Card key={index} className="bg-slate-700 border-slate-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">{api.name}</CardTitle>
                    <p className="text-gray-300 text-sm">{api.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1 mb-4">
                      {api.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-gray-400 text-xs flex items-center">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                      onClick={() => window.open(api.url, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Visit API
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Technologies Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{tech.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {tech.category}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">{tech.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mission Statement */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  SpaceViz aims to make space exploration accessible to everyone by providing real-time data,
                  interactive visualizations, and educational content about humanity's journey into the cosmos.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Democratize access to space data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Inspire the next generation of space enthusiasts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Provide educational tools for learning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Foster appreciation for space exploration</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Key Principles</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-300">User-Centric Design</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Real-Time Accuracy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">Global Accessibility</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-gray-300">Educational Impact</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Explore SpaceViz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/satellite-tracker">
                <Card className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Satellite className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Satellite Tracker</h3>
                    <p className="text-gray-400 text-sm">Track satellites in real-time on 3D globe</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/space-events">
                <Card className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Space Events</h3>
                    <p className="text-gray-400 text-sm">Discover space events by date</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/space-achievements">
                <Card className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Rocket className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Achievements</h3>
                    <p className="text-gray-400 text-sm">Explore space exploration milestones</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
