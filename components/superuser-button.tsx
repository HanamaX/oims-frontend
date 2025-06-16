"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { T } from "@/contexts/LanguageContext"

export default function SuperuserButton() {
  return (
    <Link href="/superuser/dashboard">
      <Button variant="default" className="bg-green-600 hover:bg-green-700 z-50">
        <T k="nav.superuser" />
      </Button>
    </Link>
  )
}
