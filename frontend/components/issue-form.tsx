"use client"

import { useState, useEffect } from "react"
import { fetchIssues, createIssue } from "@/lib/api"
import { getCurrentLocation, isWithinAllowedRadius } from "@/lib/geolocation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Camera, Upload, AlertTriangle } from "lucide-react"
import type { Issue } from "@/lib/mock-data"

interface IssueFormProps {
  onSubmit: () => void
  locationMode: 'auto' | 'manual'
  setLocationMode: (mode: 'auto' | 'manual') => void
  manualLocation: { lat: number; lng: number } | null
}

export function IssueForm({ onSubmit, locationMode, setLocationMode, manualLocation }: IssueFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    photo: null as File | null,
    location: { lat: 37.7749, lng: -122.4194 }, // Default to SF
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationStatus, setLocationStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle")
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationError, setLocationError] = useState<string>("")

  const categories = [
    "Road Maintenance",
    "Street Lighting", 
    "Waste Management",
    "Parks & Recreation",
    "Public Safety",
    "Noise Complaint",
    "Other",
  ]

  // Get user's location on component mount
  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        setUserLocation(location)
        setFormData(prev => ({ ...prev, location }))
      })
      .catch((error) => {
        console.error('Error getting user location:', error)
      })
  }, [])

  const handleGetLocation = () => {
    setLocationStatus("loading")
    setLocationError("")
    
    getCurrentLocation()
      .then((location) => {
        setUserLocation(location)
        setFormData((prev) => ({
          ...prev,
          location
        }))
        setLocationStatus("success")
      })
      .catch((error) => {
        setLocationStatus("error")
        setLocationError("Unable to get your location. Please try again or use manual location.")
      })
  }

  const validateLocation = (lat: number, lng: number): boolean => {
    if (!userLocation) {
      setLocationError("Please enable location access to submit issues.")
      return false
    }

    if (!isWithinAllowedRadius(userLocation.lat, userLocation.lng, lat, lng, 5)) {
      setLocationError("You can only report issues within 5km of your current location.")
      return false
    }

    setLocationError("")
    return true
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
    }
  }

  // Update form location from manual map slider
  useEffect(() => {
    if (locationMode === 'manual' && manualLocation) {
      setFormData(prev => ({ ...prev, location: manualLocation }))
      // Validate the manual location
      validateLocation(manualLocation.lat, manualLocation.lng)
    }
  }, [locationMode, manualLocation, userLocation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate location before submission
    if (!validateLocation(formData.location.lat, formData.location.lng)) {
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare data for backend
      const payload = {
        user_id: 1, // TODO: Replace with real user if available
        title: formData.title,
        description: formData.description,
        category: formData.category,
        latitude: formData.location.lat,
        longitude: formData.location.lng,
      }
      await createIssue(payload)
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        photo: null,
        location: userLocation || { lat: 37.7749, lng: -122.4194 },
      })
      
      onSubmit()
    } catch (err) {
      setLocationError("Failed to submit issue. Please try again.")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="p-4 overflow-auto h-full">
      <h2 className="text-xl font-semibold mb-4">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Issue Title *</Label>
          <Input
            id="title"
            placeholder="Brief description of the issue"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
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

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="More details about the issue..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            required
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Photo (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <Label htmlFor="photo" className="cursor-pointer">
              <div className="flex flex-col items-center">
                {formData.photo ? (
                  <>
                    <Camera className="w-8 h-8 text-green-500 mb-2" />
                    <span className="text-sm text-green-600 font-medium">
                      {formData.photo.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Click to change
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload a photo
                    </span>
                    <span className="text-xs text-gray-500">
                      JPG, PNG up to 10MB
                    </span>
                  </>
                )}
              </div>
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant={locationMode === 'auto' ? 'default' : 'outline'}
              onClick={() => {
                setLocationMode('auto');
                handleGetLocation();
              }}
            >
              Use my location
            </Button>
            <Button
              type="button"
              variant={locationMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setLocationMode('manual')}
            >
              Select on map
            </Button>
          </div>

          {locationError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {locationMode === 'auto' ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">
                You can only report issues within 5km of your current location.
              </p>
              <div className="text-xs text-gray-700">
                Lat: {formData.location.lat.toFixed(5)}, Lng: {formData.location.lng.toFixed(5)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500 mb-1">
                Use the map to select a location within 5km of your current position.
              </p>
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="0.00001"
                value={formData.location.lat}
                onChange={e => {
                  const lat = parseFloat(e.target.value)
                  setFormData(prev => ({ ...prev, location: { ...prev.location, lat } }))
                  validateLocation(lat, formData.location.lng)
                }}
                required
              />
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="0.00001"
                value={formData.location.lng}
                onChange={e => {
                  const lng = parseFloat(e.target.value)
                  setFormData(prev => ({ ...prev, location: { ...prev.location, lng } }))
                  validateLocation(formData.location.lat, lng)
                }}
                required
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.title ||
            !formData.description ||
            !formData.category ||
            !!locationError
          }
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        >
          {isSubmitting ? "Submitting..." : "Submit Issue"}
        </Button>
      </form>
    </div>
  )
}
