"use client"

import { useEffect, useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { Issue } from "@/types/issue"

// ✅ Correct type for form data
type IssueFormFields = Omit<Issue, "id" | "createdAt" | "votes" | "comments" | "history">

type IssueFormProps = {
  onSubmit: (newIssue: IssueFormFields) => void
}

export function IssueForm({ onSubmit }: IssueFormProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState<IssueFormFields>({
    title: "",
    description: "",
    category: "",
    latitude: 0,
    longitude: 0,
    status: "reported",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Road Maintenance",
    "Street Lighting",
    "Waste Management",
    "Parks & Recreation",
    "Public Safety",
    "Noise Complaint",
    "Other",
  ]

  // ✅ Fetch live location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))
        },
        (err) => {
          toast({
            title: "Location Error",
            description: "Unable to access your location. Please allow location access.",
            variant: "destructive",
          })
        }
      )
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      onSubmit(formData)

      toast({
        title: "Issue Submitted",
        description: "Thanks for doing your civic duty 🫡",
      })

      setFormData({
        title: "",
        description: "",
        category: "",
        latitude: 0,
        longitude: 0,
        status: "reported",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report issue. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

        {/* Optional: Show lat/lng as read-only for transparency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              value={formData.latitude}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              value={formData.longitude}
              readOnly
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.title ||
            !formData.description ||
            !formData.category
          }
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        >
          {isSubmitting ? "Submitting..." : "Submit Issue"}
        </Button>
      </form>
    </div>
  )
}
