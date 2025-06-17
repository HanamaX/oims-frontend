import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, School, Home, MapPin, Phone, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import { T } from "@/contexts/LanguageContext"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-blue-50/30">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl text-blue-700">
              <T k="app.name" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline"><T k="about.signin" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-100 to-blue-50/30 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-blue-800"><T k="about.hero.title" /></h1>
            <p className="max-w-[700px] text-blue-700 md:text-xl">
              <T k="about.hero.description" />
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-blue-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800"><T k="about.mission.title" /></h2>
                  <p className="text-gray-600">
                    <T k="about.mission.description" />
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <School className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800"><T k="about.vision.title" /></h2>
                  <p className="text-gray-600">
                    <T k="about.vision.description" />
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 bg-blue-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-800"><T k="about.story.title" /></h2>
              <p className="text-blue-600 mt-2"><T k="about.story.subtitle" /></p>
            </div>
            <div className="prose prose-blue max-w-none text-gray-600">
              <p>
                <T k="about.story.paragraph1" />
              </p>
              <p>
                <T k="about.story.paragraph2" />
              </p>
              <p>
                <T k="about.story.paragraph3" />
              </p>
              <p>
                <T k="about.story.paragraph4" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-800"><T k="about.whatwedo.title" /></h2>
            <p className="text-blue-600 mt-2"><T k="about.whatwedo.subtitle" /></p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-blue-100 transition-transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Home className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800"><T k="about.shelter.title" /></h3>
                  <p className="text-gray-600">
                    <T k="about.shelter.description" />
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100 transition-transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <School className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800"><T k="about.education.title" /></h3>
                  <p className="text-gray-600">
                    <T k="about.education.description" />
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100 transition-transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800"><T k="about.counseling.title" /></h3>
                  <p className="text-gray-600">
                    <T k="about.counseling.description" />
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-blue-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-800"><T k="about.contact.title" /></h2>
            <p className="text-blue-600 mt-2"><T k="about.contact.subtitle" /></p>
          </div>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="border-blue-100">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800"><T k="about.contact.office" /></h3>
                      <p className="text-gray-600"><T k="about.contact.address" /></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800"><T k="about.contact.phone" /></h3>
                      <p className="text-gray-600"><T k="about.contact.phoneNumber" /></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800"><T k="about.contact.email" /></h3>
                      <p className="text-gray-600"><T k="about.contact.emailAddress" /></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800"><T k="about.contact.hours" /></h3>
                      <p className="text-gray-600"><T k="about.contact.hoursDetails" /></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-blue-800"><T k="about.getinvolved.title" /></h3>
                  <p className="text-gray-600">
                    <T k="about.getinvolved.description" />
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Link href="/fundraiser/new">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700"><T k="about.getinvolved.fundraiser" /></Button>
                    </Link>
                    <Link href="/volunteer/register">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700"><T k="about.getinvolved.volunteer" /></Button>
                    </Link>
                    <Button variant="outline" className="w-full border-blue-200 text-blue-700">
                      <T k="about.getinvolved.donate" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-blue-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center text-sm text-blue-700">
              <p><T k="about.footer.copyright" /></p>
              <p className="mt-1"><T k="about.footer.nonprofit" /></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
