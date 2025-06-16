"use client"

import { useEffect, useState } from "react"

export default function SuperuserTestPage() {
  const [message, setMessage] = useState("Testing navigation...")
  
  useEffect(() => {
    // Log the current URL
    console.log("Current URL:", window.location.href)
    
    // Attempt to navigate to dashboard using timeout
    setTimeout(() => {
      try {
        window.location.href = "/superuser/dashboard"
        setMessage("Redirecting to dashboard...")
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setMessage(`Error: ${errorMessage}`)
      }
    }, 2000)
  }, [])
  
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold mb-4">Navigation Test Page</h1>
      <p>{message}</p>
      <div className="mt-4">
        <button 
          onClick={() => window.location.href = "/superuser/dashboard"}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Click here to go to dashboard
        </button>
      </div>
    </div>
  )
}
