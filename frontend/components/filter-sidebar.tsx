"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, MapPin } from "lucide-react"

interface FilterSidebarProps {
  filters: {
    category: string
    status: string
    search: string
    distance: number
  }
  onFiltersChange: (filters: any) => void
  issueCount: number
}

export function FilterSidebar({ filters, onFiltersChange, issueCount }: FilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const categories = [
    "Road Maintenance",
    "Street Lighting",
    "Waste Management",
    "Parks & Recreation",
    "Public Safety",
    "Noise Complaint",
    "Other",
  ]

  const statuses = [
    { value: "reported", label: "Reported", color: "bg-orange-500" },
    { value: "in-progress", label: "In Progress", color: "bg-blue-500" },
    { value: "resolved", label: "Resolved", color: "bg-green-500" },
  ]

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: "",
      status: "",
      search: "",
      distance: 5,
    })
  }

  const hasActiveFilters = filters.category || filters.status || filters.search

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="mb-4">
          <Filter className="w-4 h-4" />
        </Button>
        {hasActiveFilters && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)} className="lg:hidden">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {issueCount} issues found
          </Badge>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search Issues
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by title or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Status</Label>
          <div className="space-y-2">
            <Button
              variant={filters.status === "" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("status", "")}
              className="w-full justify-start"
            >
              All statuses
            </Button>
            {statuses.map((status) => (
              <Button
                key={status.value}
                variant={filters.status === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("status", status.value)}
                className="w-full justify-start"
              >
                <div className={`w-3 h-3 rounded-full ${status.color} mr-2`}></div>
                {status.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Distance Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Distance: {filters.distance} miles</Label>
          <div className="px-2">
            <Slider
              value={[filters.distance]}
              onValueChange={(value) => handleFilterChange("distance", value[0])}
              max={25}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 mile</span>
            <span>25 miles</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200">
        <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-blue-600" />
              Your Area
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-600">Showing issues within {filters.distance} miles of your location</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
