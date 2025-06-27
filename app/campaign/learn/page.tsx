"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronRight, Gift, Heart } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function CampaignLearnPage() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { t } = useLanguage()

  const handleStartCampaign = () => {
    router.push("/fundraiser/new")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          {t("campaign.learn.backToHome")}
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">{t("campaign.learn.title")}</h1>
            <p className="text-xl text-blue-600">{t("campaign.learn.subtitle")}</p>
          </div>

          <Card className="mb-12 border-blue-100 shadow-xl overflow-hidden animate-slide-up">
            <div className="h-64 overflow-hidden">
              <img
                src="/image/c1.jpg"
                alt="Campaign"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-8 pb-6">
              <div className="prose lg:prose-lg">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">{t("campaign.learn.howToStart")}</h2>
                <p className="mb-6">
                  {t("campaign.learn.description")}
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-12">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">1</span>
                      {t("campaign.learn.step1.title")}
                    </h3>
                    <p className="text-gray-700">
                      {t("campaign.learn.step1.description")}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">2</span>
                      {t("campaign.learn.step2.title")}
                    </h3>
                    <p className="text-gray-700">
                      {t("campaign.learn.step2.description")}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">3</span>
                      {t("campaign.learn.step3.title")}
                    </h3>
                    <p className="text-gray-700">
                      {t("campaign.learn.step3.description")}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                      <span className="flex items-center justify-center bg-blue-700 text-white rounded-full w-8 h-8 mr-3">4</span>
                      {t("campaign.learn.step4.title")}
                    </h3>
                    <p className="text-gray-700">
                      {t("campaign.learn.step4.description")}
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-blue-800 mb-4">{t("campaign.learn.impact.title")}</h3>
                <p>
                  {t("campaign.learn.impact.description")}
                </p>
                
                <ul className="my-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>{t("campaign.learn.impact.education")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>{t("campaign.learn.impact.medical")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>{t("campaign.learn.impact.sports")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>{t("campaign.learn.impact.basic")}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t border-blue-100 bg-blue-50/50 p-6">
              <div className="w-full space-y-4">
                <h4 className="text-center text-xl font-medium text-blue-800">{t("campaign.learn.ready")}</h4>
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-6 text-lg"
                  onClick={() => setShowConfirmation(true)}
                >
                  <Gift className="mr-2 h-5 w-5" /> {t("campaign.learn.startButton")}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <Card className="w-full max-w-md border-blue-100 animate-scale-in bg-white/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-blue-800">{t("campaign.learn.confirmDialog.title")}</CardTitle>
                  <CardDescription className="text-center">
                    {t("campaign.learn.confirmDialog.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Heart className="h-16 w-16 text-red-500 animate-pulse" />
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="w-full sm:w-1/2 bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                  >
                    {t("campaign.learn.confirmDialog.cancel")}
                  </Button>
                  <Button
                    className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700"
                    onClick={handleStartCampaign}
                  >
                    {t("campaign.learn.confirmDialog.confirm")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              {t("campaign.learn.returnHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
