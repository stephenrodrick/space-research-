import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Satellite, Calendar, Rocket } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Space Visualization Hub</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the cosmos through real-time satellite tracking, historical space events, and humanity's greatest
            achievements in space exploration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                <li>• Live satellite positions</li>
                <li>• Search and filter satellites</li>
                <li>• Location-based tracking</li>
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
                <li>• Historical space events</li>
                <li>• NASA image galleries</li>
                <li>• Mission timelines</li>
                <li>• Astronomy pictures</li>
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
                <li>• Historic space missions</li>
                <li>• Milestone achievements</li>
                <li>• Wikipedia integration</li>
                <li>• Interactive timeline</li>
              </ul>
              <Link href="/space-achievements">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">View Achievements</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400">Powered by NASA APIs, N2YO Satellite Data, and CesiumJS</p>
        </div>
      </div>
    </div>
  )
}
