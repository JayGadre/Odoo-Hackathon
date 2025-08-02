"use client"

import { HeroSection } from "@/components/hero-section"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <HeroSection
      onLogin={() => router.push("/login")}
      onContinueAnonymous={() => router.push("/")}
      onGetStarted={() => router.push("/")}
      isLoggedIn={isLoggedIn}
    />
  )
}
