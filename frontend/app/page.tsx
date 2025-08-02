"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { MapView } from "@/components/map-view"
import { IssueForm } from "@/components/issue-form"
import { FilterSidebar } from "@/components/filter-sidebar"
import { IssueCard } from "@/components/issue-card"
import { mockIssues, type Issue } from "@/lib/mock-data"
import { toast } from "@/hooks/use-toast"

export default function CivicTrack() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues)
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(mockIssues)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
    distance: 5,
  })

  // Filter issues based on current filters
  useEffect(() => {
    let filtered = issues

    if (filters.category) {
      filtered = filtered.filter((issue) => issue.category === filters.category)
    }

    if (filters.status) {
      filtered = filtered.filter((issue) => issue.status === filters.status)
    }

    if (filters.search) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          issue.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    setFilteredIssues(filtered)
  }, [issues, filters])

  const handleSubmitIssue = (newIssue: Omit<Issue, "id" | "createdAt" | "votes" | "comments" | "history">) => {
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      votes: 0,
      comments: [],
      history: [
        {
          status: "reported",
          timestamp: new Date().toISOString(),
          note: "Issue reported",
        },
      ],
    }

    setIssues((prev) => [issue, ...prev])
    setShowForm(false)

    // Show success toast with badge earned animation
    toast({
      title: "🎉 Issue Submitted!",
      description: "Badge earned: Community Reporter",
      duration: 4000,
    })
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    toast({
      title: "Welcome to CivicTrack!",
      description: "Ready to make your community better?",
    })
  }

  const getStatusStats = () => {
    const reported = issues.filter((i) => i.status === "reported").length
    const inProgress = issues.filter((i) => i.status === "in-progress").length
    const resolved = issues.filter((i) => i.status === "resolved").length

    return { reported, inProgress, resolved }
  }

  const stats = getStatusStats()

  if (!showMap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <HeroSection
          onLogin={handleLogin}
          onContinueAnonymous={() => setShowMap(true)}
          onGetStarted={() => setShowMap(true)}
          isLoggedIn={isLoggedIn}
        />

        {/* Community Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Community Impact</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Together, we're making our neighborhoods better, one issue at a time.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stats.reported}</div>
                  <div className="text-gray-600">Issues Reported</div>
                </CardContent>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.inProgress}</div>
                  <div className="text-gray-600">In Progress</div>
                </CardContent>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.resolved}</div>
                  <div className="text-gray-600">Resolved</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b z-50 relative">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">CivicTrack</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="hidden sm:flex">
              <Users className="w-3 h-3 mr-1" />
              {issues.length} Issues
            </Badge>
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Report Issue
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Filter Sidebar */}
        <FilterSidebar filters={filters} onFiltersChange={setFilters} issueCount={filteredIssues.length} />

        {/* Main Content */}
        <div className="flex-1 relative">
          <MapView issues={filteredIssues} onIssueSelect={setSelectedIssue} selectedIssue={selectedIssue} />
        </div>
      </div>

      {/* Issue Form Modal */}
      {showForm && <IssueForm onSubmit={handleSubmitIssue} onClose={() => setShowForm(false)} />}

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueCard
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onVote={(issueId) => {
            setIssues((prev) =>
              prev.map((issue) => (issue.id === issueId ? { ...issue, votes: issue.votes + 1 } : issue)),
            )
          }}
        />
      )}
    </div>
  )
}
