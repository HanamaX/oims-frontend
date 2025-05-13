"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function ProfileRedirect() {
  // Redirect to the new profile page location
  useEffect(() => {
    redirect("/dashboard/profile")
  }, [])
  
  return null
}
