"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Menu, UserPlus, Facebook, Twitter, Instagram, Newspaper, Gift } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { T, useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"
import { ScrollAnimation } from "@/components/scroll-animation"

export default function HomePage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const handleVolunteerRegistration = () => {
    router.push("/volunteer/register")
  }

  const handleVolunteerInfo = () => {
    router.push("/volunteer/info")
  }

  const handleFundraiserStart = () => {
    router.push("/fundraiser/new")
  }

  const handleCampaignLearnMore = () => {
    router.push("/campaign/learn")
  }

  const handleNewsExplore = () => {
    router.push("/news/ongoing")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Content wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-white">
          <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-3xl text-blue-700">
                OIMS
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/about-us" className="text-sm font-medium hover:text-blue-700">
                  <T k="nav.about" />
                </Link>
                <Link href="/register-orphanage" className="text-sm font-medium hover:text-blue-700">
                  Register
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
            <div className="md:hidden bg-white border-t w-full">
              <div className="w-full px-4 md:px-8 py-4 space-y-2">
                <Link
                  href="/about-us"
                  className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <T k="nav.about" />
                </Link>
                <Link
                  href="/register-orphanage"
                  className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
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

        {/* Hero Section with image2.jpg background for entire top section */}
        <section className="relative min-h-[600px] py-12 md:py-24 flex items-center">
          {/* Image background for entire hero section with subtle zoom animation */}
          <div
            className="absolute inset-0 w-full h-full -z-10 animate-zoom-bg bg-hero-image"
            aria-hidden="true"
          ></div>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-900/70 to-blue-900/30"></div>
          <div className="w-full px-4 md:px-8 z-20">
            <div
              className="max-w-2xl text-white space-y-8 p-8 backdrop-blur-sm bg-blue-900/10 rounded-lg shadow-xl relative overflow-hidden"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter drop-shadow-md">
                <T k="home.hero.title" />
              </h1>
              <p className="text-xl md:text-2xl text-white/90 drop-shadow">
                <T k="home.hero.description" />
              </p>
            </div>
          </div>
        </section>
        {/* Rest of the content with background */}
        <div className="flex-grow bg-gradient-animate bg-wallpaper">
          {/* Background overlay with subtle animation for better text readability */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>

          {/* Content wrapper */}
          <div className="relative z-10">
            {/* Mission Stats with improved styling and performance optimized animation */}
            <section className="py-16 bg-white/90 backdrop-blur-md mt-10 rounded-t-3xl">
              <div className="w-full px-4 md:px-8">
                <ScrollAnimation className="text-center mb-12" animationClass="animate-fade-in">
                  <h2 className="text-3xl font-bold text-blue-800 mb-4 relative inline-block">
                    <T k="home.mission.title" />
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </h2>
                  <p className="text-blue-600 mt-2 max-w-2xl mx-auto">
                    <T k="home.mission.description" />
                  </p>
                </ScrollAnimation>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <ScrollAnimation className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all" animationClass="animate-fade-in" delay={100}>
                    <div className="text-5xl font-bold text-blue-700 mb-2">100+</div>
                    <p className="text-lg text-gray-600">
                      <T k="home.mission.children" />
                    </p>
                  </ScrollAnimation>
                  <ScrollAnimation className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all" animationClass="animate-fade-in" delay={200}>
                    <div className="text-5xl font-bold text-blue-700 mb-2">Tshs 50K+</div>
                    <p className="text-lg text-gray-600">
                      <T k="home.mission.funds" />
                    </p>
                  </ScrollAnimation>
                  <ScrollAnimation className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all" animationClass="animate-fade-in" delay={300}>
                    <div className="text-5xl font-bold text-blue-700 mb-2">25+</div>
                    <p className="text-lg text-gray-600">
                      <T k="home.mission.campaigns" />
                    </p>
                  </ScrollAnimation>
                </div>
              </div>
            </section>

      {/* Volunteer Card with improved styling */}
      {/* <section className="py-16 bg-gradient-to-b from-blue-50/80 to-white/80 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              Become a Volunteer
            </h2>
            <p className="text-blue-600 mt-2 max-w-2xl mx-auto">
              Your time and dedication can transform children's lives
            </p>
          </div>
          <Card className="max-w-2xl mx-auto border-blue-100 shadow-xl hover:shadow-2xl transition-all overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img
                src="/image/image1.jpg"
                alt="Volunteering"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardHeader className="bg-white border-b border-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-800">
                    Join Our Volunteer Team
                  </CardTitle>
                  <CardDescription>
                    Make a direct impact in children's lives through service
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Become a volunteer and help create a nurturing environment for children. Your skills and compassion can provide support, guidance, and opportunities that change lives forever.
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
                onClick={handleVolunteerInfo}
              >
                Become a Volunteer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section> */}

      {/* Impact and Involvement Cards Section with performance optimized animation */}
      <section className="py-16 bg-white/90 backdrop-blur-sm">
        <div className="container px-4 md:px-6">          <ScrollAnimation className="text-center mb-12" animationClass="animate-fade-in">
            <h2 className="text-3xl font-bold text-blue-800 mb-4 drop-shadow-md">
              <T k="home.impact.title" />
            </h2>
            <p className="text-blue-700 mt-2 max-w-2xl mx-auto">
              <T k="home.impact.subtitle" />
            </p>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Volunteer Card */}
            <ScrollAnimation className="" animationClass="animate-slide-up" delay={100}>
            <Card className="border-blue-100 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/image/c2.jpg"
                  alt="Volunteering"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
              <CardHeader className="bg-white border-b border-blue-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>                    <CardTitle className="text-blue-800">
                      <T k="home.volunteer.card.title" />
                    </CardTitle>
                    <CardDescription>
                      <T k="home.volunteer.card.description" />
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <p className="text-gray-600">
                  <T k="home.volunteer.card.content" />
                </p>
              </CardContent>              <CardFooter className="bg-white border-t border-blue-50">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
                  onClick={handleVolunteerInfo}
                >
                  <T k="home.volunteer.card.button" />
                </Button>
              </CardFooter>
            </Card>
            </ScrollAnimation>

            {/* News Card */}
            <ScrollAnimation className="" animationClass="animate-slide-up" delay={200}>
            <Card className="border-blue-100 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/image/card2.jpg"
                  alt="Ongoing News"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
              <CardHeader className="bg-white border-b border-blue-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Newspaper className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>                    <CardTitle className="text-blue-800">
                      <T k="home.news.card.title" />
                    </CardTitle>
                    <CardDescription>
                      <T k="home.news.card.description" />
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>              <CardContent className="pt-6 bg-white">
                <p className="text-gray-600">
                  <T k="home.news.card.content" />
                </p>
              </CardContent>              <CardFooter className="bg-white border-t border-blue-50">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
                  onClick={handleNewsExplore}
                >
                  <T k="home.news.card.button" />
                </Button>
              </CardFooter>
            </Card>
            </ScrollAnimation>

            {/* Campaign Impact Card */}
            <ScrollAnimation className="" animationClass="animate-slide-up" delay={300}>
            <Card className="border-blue-100 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/image/image2.jpg"
                  alt="Campaign Impact"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
              <CardHeader className="bg-white border-b border-blue-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Gift className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>                    <CardTitle className="text-blue-800">
                      <T k="home.campaign.card.title" />
                    </CardTitle>
                    <CardDescription>
                      <T k="home.campaign.card.description" />
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>              <CardContent className="pt-6 bg-white">
                <p className="text-gray-600">
                  <T k="home.campaign.card.content" />
                </p>
              </CardContent>              <CardFooter className="bg-white border-t border-blue-50">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
                  onClick={handleCampaignLearnMore}
                >
                  <T k="home.campaign.card.button" />
                </Button>
              </CardFooter>
            </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

            {/* Footer with improved styling */}
            <footer className="py-12 bg-blue-900/85 backdrop-blur-md text-white mt-10">
              <div className="container px-4 md:px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-200">
                      <T k="footer.about.title" />
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="text-blue-100 hover:text-white transition-colors" title="About Us">
                          <T k="footer.about.aboutUs" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-100 hover:text-white transition-colors" title="Why Choose Us">
                          <T k="footer.about.why" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-100 hover:text-white transition-colors" title="Our Impact">
                          <T k="footer.about.impact" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-200">
                      <T k="footer.resources.title" />
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="text-blue-100 hover:text-white transition-colors" title="FAQ">
                          <T k="footer.resources.faq" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-100 hover:text-white transition-colors" title="Campaigns">
                          <T k="footer.resources.campaigns" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-200">
                      <T k="footer.legal.title" />
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="text-blue-100 hover:text-white transition-colors" title="Terms of Service">
                          <T k="footer.legal.terms" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-100 hover:text-white transition-colors" title="Privacy Policy">
                          <T k="footer.legal.privacy" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-200">
                      <T k="footer.connect.title" />
                    </h3>
                    <div className="flex gap-4 mb-4">
                      <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors" title="Facebook" aria-label="Visit our Facebook page">
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors" title="Twitter" aria-label="Visit our Twitter page">
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors" title="Instagram" aria-label="Visit our Instagram page">
                        <Instagram className="h-5 w-5" />
                      </a>
                    </div>
                    <p className="text-sm text-blue-200">
                      <T k="footer.newsletter" />
                    </p>
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
        </div>
      </div>
    </div>
  )
}