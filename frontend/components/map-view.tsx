import { useEffect, useRef, useState } from "react"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import type { Issue } from "@/lib/mock-data"

interface MapViewProps {
  issues: Issue[]
  onIssueSelect: (issue: Issue) => void
  selectedIssue: Issue | null
  manualMode?: boolean
  onManualLocationSelect?: (lat: number, lng: number) => void
}

export function MapView({ issues, onIssueSelect, selectedIssue, manualMode = false, onManualLocationSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const markersRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)
  const manualMarkerRef = useRef<any>(null)
  const [manualLatLng, setManualLatLng] = useState<[number, number] | null>(null)

  useEffect(() => {
    setIsClient(typeof window !== 'undefined')
    if (typeof window === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
        setManualLatLng([pos.coords.latitude, pos.coords.longitude])
      },
      () => {
        setUserLocation([28.6139, 77.2090])
        setManualLatLng([28.6139, 77.2090])
      }
    )
  }, [])

  useEffect(() => {
    if (!isClient) return
    if (!mapRef.current || !userLocation || map) return
    const L = require('leaflet')
    require('leaflet/dist/leaflet.css')
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    })

    const leafletMap = L.map(mapRef.current).setView(userLocation, 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(leafletMap)

    L.marker(userLocation).addTo(leafletMap).bindPopup("You are here").openPopup()
    L.circle(userLocation, {
      radius: 5000,
      color: "blue",
      fillColor: "blue",
      fillOpacity: 0.3,
    }).addTo(leafletMap)

    const markersLayer = L.layerGroup().addTo(leafletMap)
    markersRef.current = markersLayer

    setMap(leafletMap)
  }, [userLocation, isClient])

  // Manual draggable marker for selecting location
  useEffect(() => {
    if (!isClient || !map || !userLocation) return
    const L = require('leaflet')
    if (manualMode) {
      // If already exists, remove
      if (manualMarkerRef.current) {
        map.removeLayer(manualMarkerRef.current)
        manualMarkerRef.current = null
      }
      const marker = L.marker(manualLatLng || userLocation, { draggable: true })
      marker.addTo(map)
      marker.on('dragend', function (e: any) {
        const { lat, lng } = marker.getLatLng()
        setManualLatLng([lat, lng])
        if (onManualLocationSelect) onManualLocationSelect(lat, lng)
      })
      manualMarkerRef.current = marker
    } else {
      // Remove manual marker if not in manual mode
      if (manualMarkerRef.current) {
        map.removeLayer(manualMarkerRef.current)
        manualMarkerRef.current = null
      }
    }
    // Clean up on unmount
    return () => {
      if (manualMarkerRef.current) {
        map.removeLayer(manualMarkerRef.current)
        manualMarkerRef.current = null
      }
    }
  }, [manualMode, isClient, map, userLocation, onManualLocationSelect, manualLatLng])

  useEffect(() => {
    if (!isClient) return
    if (!map || !markersRef.current) return
    const L = require('leaflet')
    const markersLayer = markersRef.current
    markersLayer.clearLayers()
    
    issues.forEach((issue) => {
      let color = "orange"
      if ((issue as any).status === "In Progress") color = "blue"
      if ((issue as any).status === "Resolved") color = "green"
      
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style='background:${color};width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px #888'></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })
      
      const lat = (issue as any).latitude ?? (issue as any).location?.lat
      const lng = (issue as any).longitude ?? (issue as any).location?.lng
      
      if (lat && lng) {
        const marker = L.marker([lat, lng], { icon })
        marker.on("click", () => onIssueSelect(issue))
        
        // Create enhanced popup with image support
        const imageHtml = (issue as any).image 
          ? `<div style="text-align: center; margin-bottom: 8px;">
               <img src="${(issue as any).image}" alt="Issue photo" style="max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
             </div>` 
          : ''
        
        const popupContent = `
          <div style="min-width: 200px;">
            ${imageHtml}
            <div style="padding: 4px 0;">
              <strong style="color: #1f2937; font-size: 14px;">${issue.title}</strong>
            </div>
            <div style="color: #6b7280; font-size: 12px; margin: 4px 0;">
              <span style="background: ${color}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px;">
                ${(issue as any).status || 'Reported'}
              </span>
              <span style="margin-left: 8px;">${issue.category}</span>
            </div>
            <div style="color: #4b5563; font-size: 12px; margin-top: 4px;">
              ${issue.description.length > 100 ? issue.description.substring(0, 100) + '...' : issue.description}
            </div>
            <div style="color: #9ca3af; font-size: 10px; margin-top: 8px;">
              ${new Date((issue as any).created_at || Date.now()).toLocaleDateString()}
            </div>
          </div>
        `
        
        marker.bindPopup(popupContent, {
          maxWidth: 250,
          className: 'custom-popup'
        })
        markersLayer.addLayer(marker)
      }
    })
    
    // Only add user marker if not in manual mode
    if (userLocation && !manualMode) {
      L.marker(userLocation).addTo(map).bindPopup("You are here")
    }
  }, [issues, map, onIssueSelect, isClient, userLocation, manualMode])

  if (!isClient) return null
  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="absolute inset-0 z-0" />
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
      
      {/* Add custom CSS for better popup styling */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  )
}
