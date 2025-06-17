"use client"

import React from "react"

interface FullWidthContainerProps {
  children: React.ReactNode
  className?: string
}

export default function FullWidthContainer({ children, className = "" }: FullWidthContainerProps) {
  return (
    <div className={`w-full px-4 md:px-6 ${className}`}>
      {children}
    </div>
  )
}
