import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function LoadingOngoingCampaigns() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="h-6 w-32 mb-8">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-3/4 max-w-md mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 max-w-sm mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array(6).fill(0).map((_, index) => (
              <Card key={index} className="shadow-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <Skeleton className="h-4 w-1/3 mt-2" />
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <Skeleton className="h-7 w-3/4 mx-auto" />
              </CardHeader>
              <CardContent className="text-center">
                <Skeleton className="h-5 w-2/3 mx-auto mb-4" />
              </CardContent>
              <CardFooter className="justify-center">
                <Skeleton className="h-10 w-40 mx-auto" />
              </CardFooter>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Skeleton className="h-5 w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
