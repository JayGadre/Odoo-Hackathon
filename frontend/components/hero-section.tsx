"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Heart, ArrowRight } from "lucide-react"

interface HeroSectionProps {
  onLogin: () => void
  onContinueAnonymous: () => void
  onGetStarted: () => void
  isLoggedIn: boolean
}

export function HeroSection({ onLogin, onContinueAnonymous, onGetStarted, isLoggedIn }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cityscape Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-green-500/10 to-blue-600/10" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-green-200/30 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-300/30 rounded-full animate-pulse delay-2000" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Main Hero Content */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Your Voice,
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {" "}
              Your Community
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Report neighborhood issues, track progress, and work together to make your community better.
            <span className="text-blue-600 font-medium"> We're all in this together.</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              <span>Community-Driven</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Heart className="w-5 h-5 mr-2 text-green-500" />
              <span>Neighbor-Friendly</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <span>Location-Based</span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Join the Community</h3>
              <p className="text-gray-600 mb-6">
                Create an account to earn badges, track your impact, and connect with neighbors.
              </p>
              <Button
                onClick={onLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3"
                size="lg"
              >
                Sign Up / Log In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Start Exploring</h3>
              <p className="text-gray-600 mb-6">
                Browse issues in your area and see how your community is working together.
              </p>
              <Button
                onClick={onContinueAnonymous}
                variant="outline"
                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-medium py-3 bg-transparent"
                size="lg"
              >
                Continue as Guest
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {isLoggedIn && (
          <div className="mt-8">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium px-8 py-3"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
