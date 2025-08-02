"use client"

import type { Issue } from "@/lib/mock-data"

interface MapViewProps {
  issues: Issue[]
  onIssueSelect: (issue: Issue) => void
  selectedIssue: Issue | null
}

export function MapView({ issues, onIssueSelect, selectedIssue }: MapViewProps) {
  return (
    <div className="w-full h-full relative">
      {/* Placeholder content while Leaflet is disabled */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
        📍 Map is temporarily disabled for debugging. Please check back later.
      </div>

      {/* Optional Legend if you still want it visible */}
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
    </div>
  )
}
