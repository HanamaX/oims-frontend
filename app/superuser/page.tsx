"use client"

import { useEffect } from "react"

export default function SuperuserPage() {
  useEffect(() => {
    // Direct browser navigation with replace to avoid history issues
    window.location.replace("/superuser/dashboard")
  }, [])
  
  // Immediately render dashboard redirect content
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Superuser Dashboard</h1>
        <p className="mb-4">If you are not redirected automatically, click the button below:</p>
        <button 
          onClick={() => window.location.replace("/superuser/dashboard")}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
