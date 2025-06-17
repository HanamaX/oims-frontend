import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function LoadingCampaignDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="h-6 w-32 mb-8">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-64 relative">
              <Skeleton className="h-full w-full" />
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-7 w-40 mb-3" />
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex">
                        <Skeleton className="h-5 w-5 mr-2" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-24 mb-1" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-7 w-48 mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  
                  <Skeleton className="h-7 w-36 mb-2" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="text-center">
                  <Skeleton className="h-5 w-48 mx-auto mb-4" />
                  <Skeleton className="h-12 w-64 mx-auto" />
                </div>
              </div>
            </div>
          </Card>
          
          <div className="text-center mt-12">
            <Skeleton className="h-5 w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
