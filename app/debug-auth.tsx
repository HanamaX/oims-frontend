"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DebugAuth() {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50/50 py-12 px-4">
      <Card className="w-full max-w-md border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>Check your current authentication status</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Authentication Status:</h3>
              <p>{user ? `Authenticated as ${user.role}` : "Not authenticated"}</p>
            </div>

            <div>
              <h3 className="font-medium">LocalStorage Content:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {typeof window !== "undefined"
                  ? JSON.stringify(localStorage.getItem("user"), null, 2)
                  : "Not available on server"}
              </pre>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
          {user && (
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
