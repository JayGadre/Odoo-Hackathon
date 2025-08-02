"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, MapPin, Camera, Upload } from "lucide-react"
import type { Issue } from "@/lib/mock-data"

interface IssueFormProps {
  onSubmit: (issue: Omit<Issue, "id" | "createdAt" | "votes" | "comments" | "history">) => void
  onClose: () => void
}

export function IssueForm({ onSubmit, onClose }: IssueFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    photo: null as File | null,
    location: { lat: 37.7749, lng: -122.4194 }, // Default to SF
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const categories = [
    "Road Maintenance",
    "Street Lighting",
    "Waste Management",
    "Parks & Recreation",
    "Public Safety",
    "Noise Complaint",
    "Other",
  ]

  const handleGetLocation = () => {
    setLocationStatus("loading")

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }))
          setLocationStatus("success")
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationStatus("error")
        },
      )
    } else {
      setLocationStatus("error")
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const issue = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      status: "reported" as const,
      author: "Anonymous User",
      photo: formData.photo ? URL.createObjectURL(formData.photo) : undefined,
    }

    onSubmit(issue)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Report an Issue</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
                className="w-full"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about the issue..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                className="w-full"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Photo (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    {formData.photo ? (
                      <>
                        <Camera className="w-8 h-8 text-green-500 mb-2" />
                        <span className="text-sm text-green-600 font-medium">{formData.photo.name}</span>
                        <span className="text-xs text-gray-500">Click to change</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload a photo</span>
                        <span className="text-xs text-gray-500">JPG, PNG up to 10MB</span>
                      </>
                    )}
                  </div>
                </Label>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetLocation}
                  disabled={locationStatus === "loading"}
                  className="flex-1 bg-transparent"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {locationStatus === "loading" && "Getting location..."}
                  {locationStatus === "success" && "Location captured ✓"}
                  {locationStatus === "error" && "Location failed - using default"}
                  {locationStatus === "idle" && "Use my current location"}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                We'll use your location to help others find and address the issue.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Issue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
