"use client"

import { useState, useEffect } from "react"
import { MapPin, Users, X } from "lucide-react"
import { MapView } from "@/components/map-view"
import { IssueForm } from "@/components/issue-form"
import { FilterSidebar } from "@/components/filter-sidebar"
import { IssueCard } from "@/components/issue-card"
import { type Issue } from "@/lib/mock-data"
import { fetchIssues } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function CivicTrack() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
    
  })

  // Load issues from backend
  useEffect(() => {
    fetchIssues().then(setIssues).catch(() => setIssues([]))
  }, [])

  useEffect(() => {
    let filtered = issues
    if (filters.category) filtered = filtered.filter((i) => i.category === filters.category)
    if (filters.status) filtered = filtered.filter((i) => i.status === filters.status)
    if (filters.search)
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          i.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    setFilteredIssues(filtered)
  }, [issues, filters])

  // Manual location state for map slider
  const [manualLocation, setManualLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationMode, setLocationMode] = useState<'auto' | 'manual'>("auto")

  // After submit, reload issues from backend
  const handleSubmitIssue = async () => {
    await fetchIssues().then(setIssues).catch(() => setIssues([]))
    toast({
      title: "�� Issue Submitted!",
      description: "Badge earned: Community Reporter",
      duration: 4000,
    })
  }

  // Close selected issue
  const handleCloseIssue = () => {
    setSelectedIssue(null)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">CivicTrack</h1>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            <Users className="w-3 h-3 mr-1" />
            {issues.length} Issues
          </Badge>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left: Filters */}
        <aside className="w-1/4 bg-white border-r overflow-y-auto">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            issueCount={filteredIssues.length}
          />
        </aside>

        {/* Center: Map */}
        <section className="w-2/4 relative">
          <MapView
            issues={filteredIssues}
            onIssueSelect={setSelectedIssue}
            selectedIssue={selectedIssue}
            manualMode={locationMode === 'manual'}
            onManualLocationSelect={(lat, lng) => setManualLocation({ lat, lng })}
          />
        </section>

        {/* Right: Issue Form or Selected Issue */}
        <aside className="w-1/4 bg-white border-l overflow-y-auto">
          {selectedIssue ? (
            <div className="h-full flex flex-col">
              {/* Close button */}
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Issue Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCloseIssue}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {/* Issue card */}
              <div className="flex-1 overflow-y-auto">
                <IssueCard issue={selectedIssue} onClose={handleCloseIssue} onVote={() => {}} />
              </div>
            </div>
          ) : (
            <IssueForm
              onSubmit={handleSubmitIssue}
              locationMode={locationMode}
              setLocationMode={setLocationMode}
              manualLocation={manualLocation}
            />
          )}
        </aside>
      </main>
    </div>
  )
}
