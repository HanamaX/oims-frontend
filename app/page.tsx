"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Menu, UserPlus, Facebook, Twitter, Instagram } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { T, useLanguage } from "@/contexts/LanguageContext"

export default function HomePage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const handleVolunteerRegistration = () => {
    router.push("/volunteer/register")
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50/30">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl text-blue-700">
              <T k="app.name" />
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/about-us" className="text-sm font-medium hover:text-blue-700">
                <T k="nav.about" />
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="outline">
                <T k="nav.login" />
              </Button>
            </Link>
            <Button
              className="md:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container py-4 space-y-2">
              <Link
                href="/about-us"
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <T k="nav.about" />
              </Link>
              <div className="flex items-center gap-2 pt-2">
                <div className="text-sm font-medium">
                  <T k="language.title" />:
                </div>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with High-Quality Image */}
      <section className="relative py-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/70 z-10"></div>
        <div className="relative h-[500px] overflow-hidden">
          <img
            src="/placeholder.svg?height=500&width=1200&text=Ultra+4K+Image+of+Children+in+Care"
            alt="Children in care"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container absolute inset-0 z-20 flex items-center">
          <div className="max-w-2xl text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter drop-shadow-md">
              <T k="home.hero.title" />
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow">
              <T k="home.hero.description" />
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 transition-all transform hover:scale-105"
                onClick={handleVolunteerRegistration}
              >
                <T k="home.volunteer.register" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 transition-all">
                <T k="home.learn.more" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Stats with improved styling */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              <T k="home.mission.title" />
            </h2>
            <p className="text-blue-600 mt-2 max-w-2xl mx-auto">
              <T k="home.mission.description" />
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
              <div className="text-5xl font-bold text-blue-700 mb-2">100+</div>
              <p className="text-lg text-gray-600">
                <T k="home.mission.children" />
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
              <div className="text-5xl font-bold text-blue-700 mb-2">$50K+</div>
              <p className="text-lg text-gray-600">
                <T k="home.mission.funds" />
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
              <div className="text-5xl font-bold text-blue-700 mb-2">25+</div>
              <p className="text-lg text-gray-600">
                <T k="home.mission.campaigns" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Registration Card with improved styling */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              <T k="home.volunteer.title" />
            </h2>
            <p className="text-blue-600 mt-2 max-w-2xl mx-auto">
              <T k="home.volunteer.subtitle" />
            </p>
          </div>
          <Card className="max-w-2xl mx-auto border-blue-100 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader className="bg-white border-b border-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-800">
                    <T k="home.volunteer.become" />
                  </CardTitle>
                  <CardDescription>
                    <T k="home.volunteer.help" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              <div className="space-y-4">
                <p className="text-gray-600">
                  <T k="home.volunteer.description" />
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-gray-600">Flexible scheduling</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-gray-600">Various roles available</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-gray-600">Training provided</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-gray-600">Make a real impact</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white border-t border-blue-50">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
                onClick={handleVolunteerRegistration}
              >
                <T k="home.volunteer.register" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer with improved styling */}
      <footer className="py-12 bg-blue-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-200">About</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    Why HopeFoundation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    Our Impact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-200">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    Discover Campaigns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-200">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-200">Connect</h3>
              <div className="flex gap-4 mb-4">
                <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-blue-200">Sign up for our newsletter to stay updated</p>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-8 text-center">
            <p className="text-blue-200">
              <T k="footer.support" />
            </p>
            <p className="mt-2 text-blue-300">
              <T k="footer.copyright" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
