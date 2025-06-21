"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Satellite, Calendar, Rocket, Home, Info, Calculator, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/satellite-tracker", label: "Satellites", icon: Satellite },
    { href: "/space-events", label: "Events", icon: Calendar },
    { href: "/space-achievements", label: "Achievements", icon: Rocket },
    { href: "/space-tools", label: "Tools", icon: Calculator },
    { href: "/about", label: "About", icon: Info },
  ]

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Satellite className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg">SpaceViz</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link key={href} href={href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`text-white hover:text-white ${isActive ? "bg-slate-700" : "hover:bg-slate-800"}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Dark / light toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-white hover:text-white hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
