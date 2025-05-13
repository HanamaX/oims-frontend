import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, School, Home, MapPin, Phone, Mail, Calendar } from "lucide-react"
import Link from "next/link"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-blue-50/30">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl text-blue-700">
              HopeFoundation
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-100 to-blue-50/30 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-blue-800">About Hope Foundation</h1>
            <p className="max-w-[700px] text-blue-700 md:text-xl">
              Dedicated to providing care, education, and opportunities for orphaned children since 2010
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
                  <h2 className="text-2xl font-bold text-blue-800">Our Mission</h2>
                  <p className="text-gray-600">
                    To provide a nurturing and supportive environment for orphaned children, ensuring they receive the
                    care, education, and opportunities they need to thrive and become self-sufficient adults.
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
                  <h2 className="text-2xl font-bold text-blue-800">Our Vision</h2>
                  <p className="text-gray-600">
                    A world where every orphaned child has access to quality care, education, and the opportunity to
                    reach their full potential, regardless of their background or circumstances.
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
              <h2 className="text-3xl font-bold text-blue-800">Our Story</h2>
              <p className="text-blue-600 mt-2">How Hope Foundation began and where we are today</p>
            </div>
            <div className="prose prose-blue max-w-none text-gray-600">
              <p>
                Hope Foundation was established in 2010 by a group of dedicated individuals who recognized the urgent
                need to provide care and support for orphaned children in our community. What began as a small
                initiative with just 10 children has now grown into a comprehensive orphanage management system
                supporting over 150 children across multiple branches.
              </p>
              <p>
                Our journey has been one of continuous growth and learning. We started with a single facility and
                limited resources, but through the generosity of donors and the dedication of our volunteers and staff,
                we have expanded our reach and improved our services year after year.
              </p>
              <p>
                Today, Hope Foundation operates four branches, each providing a safe and nurturing environment for
                orphaned children. We offer comprehensive care that includes not just shelter and food, but also
                education, healthcare, counseling, and various developmental programs designed to help our children grow
                into confident, self-sufficient adults.
              </p>
              <p>
                Our success stories are numerous, with many of our former residents now pursuing higher education,
                building successful careers, and giving back to the community that once supported them. We remain
                committed to our mission and continue to seek ways to improve and expand our services to reach more
                children in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-800">What We Do</h2>
            <p className="text-blue-600 mt-2">Our comprehensive approach to orphan care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-blue-100 transition-transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Home className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">Shelter & Care</h3>
                  <p className="text-gray-600">
                    We provide safe, comfortable housing and daily care for all children, ensuring their basic needs are
                    met in a loving environment.
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
                  <h3 className="text-xl font-bold text-blue-800">Education</h3>
                  <p className="text-gray-600">
                    We ensure all children receive quality education, from primary school through higher education,
                    tailored to their abilities and interests.
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
                  <h3 className="text-xl font-bold text-blue-800">Counseling & Support</h3>
                  <p className="text-gray-600">
                    Our professional counselors provide emotional support and guidance to help children overcome trauma
                    and build resilience.
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
            <h2 className="text-3xl font-bold text-blue-800">Contact Us</h2>
            <p className="text-blue-600 mt-2">Get in touch with Hope Foundation</p>
          </div>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="border-blue-100">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">Main Office</h3>
                      <p className="text-gray-600">123 Hope Street, Springfield, ST 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">Phone</h3>
                      <p className="text-gray-600">(123) 456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">Email</h3>
                      <p className="text-gray-600">info@hopefoundation.org</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">Office Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-blue-800">Get Involved</h3>
                  <p className="text-gray-600">
                    There are many ways you can support our mission and make a difference in the lives of orphaned
                    children.
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Link href="/fundraiser/new">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Start a Fundraiser</Button>
                    </Link>
                    <Link href="/volunteer/register">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Volunteer With Us</Button>
                    </Link>
                    <Button variant="outline" className="w-full border-blue-200 text-blue-700">
                      Make a Donation
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
              <p>© 2025 Hope Foundation. All rights reserved.</p>
              <p className="mt-1">A registered non-profit organization dedicated to orphan care.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
