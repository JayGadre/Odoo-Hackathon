"use client"

import { useEffect, useRef } from "react"
import type { Issue } from "@/lib/mock-data"

interface MapViewProps {
  issues: Issue[]
  onIssueSelect: (issue: Issue) => void
  selectedIssue: Issue | null
}

export function MapView({ issues, onIssueSelect, selectedIssue }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Initialize map when component mounts
    const initMap = async () => {
      if (typeof window === "undefined" || !mapRef.current) return

      // Dynamically import Leaflet to avoid SSR issues
      const L = (await import("leaflet")).default

      // Fix for default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      // Initialize map centered on a default location (San Francisco)
      const map = L.map(mapRef.current).setView([37.7749, -122.4194], 13)

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      mapInstanceRef.current = map
    }

    initMap()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Update markers when issues change
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || typeof window === "undefined") return

      const L = (await import("leaflet")).default

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      // Add new markers
      issues.forEach((issue) => {
        const color = getStatusColor(issue.status)

        // Create custom icon based on status
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `
            <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold" 
                 style="background-color: ${color}">
              ${getStatusIcon(issue.status)}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const marker = L.marker([issue.location.lat, issue.location.lng], {
          icon: customIcon,
        })
          .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm mb-1">${issue.title}</h3>
            <p class="text-xs text-gray-600 mb-2">${issue.description.substring(0, 100)}...</p>
            <div class="flex items-center justify-between">
              <span class="text-xs px-2 py-1 rounded-full" style="background-color: ${color}20; color: ${color}">
                ${issue.status.replace("-", " ").toUpperCase()}
              </span>
              <span class="text-xs text-gray-500">${issue.votes} votes</span>
            </div>
          </div>
        `)
          .on("click", () => onIssueSelect(issue))
          .addTo(mapInstanceRef.current)

        markersRef.current.push(marker)
      })
    }

    updateMarkers()
  }, [issues, onIssueSelect])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "#f59e0b" // orange
      case "in-progress":
        return "#3b82f6" // blue
      case "resolved":
        return "#10b981" // green
      default:
        return "#6b7280" // gray
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
        return "!"
      case "in-progress":
        return "⟳"
      case "resolved":
        return "✓"
      default:
        return "?"
    }
  }

  return (
    <>
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-sm font-semibold mb-2">Issue Status</h4>
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span>Reported</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      {/* Load Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
    </>
  )
}
