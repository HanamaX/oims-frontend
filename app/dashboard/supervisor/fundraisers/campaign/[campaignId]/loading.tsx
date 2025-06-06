import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" disabled>Campaign Details</TabsTrigger>
          <TabsTrigger value="contributors" disabled>Contributors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full" />
                
                <div className="space-y-6">
                  <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-start">
                        <Skeleton className="h-5 w-5 mr-2 flex-shrink-0" />
                        <div className="w-full">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <Skeleton className="h-6 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  
                  <Skeleton className="h-6 w-48 mt-6 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                </div>
                
                <div>
                  <Skeleton className="h-6 w-48 mb-3" />
                  <Skeleton className="h-32 w-full rounded-md mb-6" />
                  
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 rounded-md" />
                    <Skeleton className="h-20 rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
