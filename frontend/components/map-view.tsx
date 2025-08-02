"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Issue } from "@/types/issue" 

interface MapViewProps {
  issues: Issue[]
  onIssueSelect: (issue: Issue) => void
  selectedIssue: Issue | null
}

export function MapView({ issues, onIssueSelect, selectedIssue }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const userMarker = useRef<L.Marker | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported.")
      setUserLocation([28.6139, 77.2090])
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => {
        console.error("Geolocation error:", err)
        setUserLocation([28.6139, 77.2090])
      }
    )
  }, [])

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !userLocation) return

    const map = L.map(mapRef.current).setView(userLocation, 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    userMarker.current = L.marker(userLocation, {
      icon: L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }),
    }).addTo(map).bindPopup("📍 You are here").openPopup()

    L.circle(userLocation, {
      radius: 5000,
      color: "blue",
      fillColor: "#3b82f6",
      fillOpacity: 0.15,
    }).addTo(map)

    mapInstance.current = map
  }, [userLocation])

  useEffect(() => {
    if (!mapInstance.current) return

    const map = mapInstance.current

    map.eachLayer((layer) => {
      if (
        (layer as L.Marker).getLatLng &&
        !(layer instanceof L.TileLayer) &&
        !(layer instanceof L.Circle) &&
        layer !== userMarker.current
      ) {
        map.removeLayer(layer)
      }
    })

    issues.forEach((issue) => {
      const position: [number, number] = [issue.latitude, issue.longitude]

      const marker = L.marker(position)
        .addTo(map)
        .on("click", () => onIssueSelect(issue))

      if (selectedIssue?.id === issue.id) {
        marker.bindPopup(`<b>${issue.title}</b>`).openPopup()
        map.setView(position, 14)
      }
    })
  }, [issues, selectedIssue, onIssueSelect])

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="absolute inset-0 z-0 rounded-lg overflow-hidden" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-sm font-semibold mb-2">Issue Status</h4>
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
            <span>Reported</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <span>Resolved</span>
          </div>
        </div>
      </div>
    </div>
  )
}
