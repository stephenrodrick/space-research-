import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Satellite, Calendar, Rocket, Calculator, Info, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Space Visualization Hub</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the cosmos through real-time satellite tracking, historical space events, professional space tools,
            and humanity's greatest achievements in space exploration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-600 rounded-full w-fit">
                <Satellite className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Real-Time Satellite Tracker</CardTitle>
              <CardDescription className="text-gray-400">
                Track satellites in real-time on an interactive 3D globe
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-300 mb-6 space-y-2">
                <li>• Interactive 3D Earth visualization</li>
                <li>• Live satellite positions & orbits</li>
                <li>• Pass predictions & visibility</li>
                <li>• Detailed satellite information</li>
              </ul>
              <Link href="/satellite-tracker">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Launch Tracker</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-600 rounded-full w-fit">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Space Events by Date</CardTitle>
              <CardDescription className="text-gray-400">
                Discover what happened in space on any given date
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-300 mb-6 space-y-2">
                <li>• NASA Astronomy Picture of the Day</li>
                <li>• Historical space events timeline</li>
                <li>• NASA image galleries by year</li>
                <li>• Random date exploration</li>
              </ul>
              <Link href="/space-events">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Explore Events</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-orange-600 rounded-full w-fit">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Human Space Achievements</CardTitle>
              <CardDescription className="text-gray-400">
                Explore humanity's greatest milestones in space
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-300 mb-6 space-y-2">
                <li>• Historic space missions database</li>
                <li>• Milestone achievements timeline</li>
                <li>• Wikipedia integration & search</li>
                <li>• Detailed mission information</li>
              </ul>
              <Link href="/space-achievements">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">View Achievements</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-600 rounded-full w-fit">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Space Tools & Calculators</CardTitle>
              <CardDescription className="text-gray-400">Professional space mission planning tools</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-300 mb-6 space-y-2">
                <li>• Orbital mechanics calculators</li>
                <li>• Mission planning tools</li>
                <li>• Real-time space weather data</li>
                <li>• Reference tables & constants</li>
              </ul>
              <Link href="/space-tools">
                <Button className="w-full bg-green-600 hover:bg-green-700">Access Tools</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-cyan-600 rounded-full w-fit">
                <Info className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">About SpaceViz</CardTitle>
              <CardDescription className="text-gray-400">Learn about the platform and technologies</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-300 mb-6 space-y-2">
                <li>• Platform features overview</li>
                <li>• APIs & data sources used</li>
                <li>• Technology stack details</li>
                <li>• Mission & principles</li>
              </ul>
              <Link href="/about">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Learn More</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-yellow-600 rounded-full w-fit">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Live Space Data</CardTitle>
              <CardDescription className="text-gray-400">Real-time information from space</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-300 mb-6 space-y-2">
                <li>• ISS current position</li>
                <li>• Solar activity monitoring</li>
                <li>• Near-Earth object tracking</li>
                <li>• Space weather conditions</li>
              </ul>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/satellite-tracker">
                  <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                    ISS Tracker
                  </Button>
                </Link>
                <Link href="/space-tools">
                  <Button size="sm" variant="outline" className="w-full">
                    Space Weather
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">Powered by NASA APIs, N2YO Satellite Data, CesiumJS, and Wikipedia</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>• Real-time satellite tracking</span>
            <span>• Educational content</span>
            <span>• Professional tools</span>
            <span>• Open source</span>
          </div>
        </div>
      </div>
    </div>
  )
}
