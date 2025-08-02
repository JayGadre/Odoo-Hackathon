"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { MapView } from "@/components/map-view";
import { IssueForm } from "@/components/issue-form";
import { FilterSidebar } from "@/components/filter-sidebar";
import type { Issue } from "@/types/issue";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Broken streetlight",
    description: "The light near my house is broken.",
    category: "Street Lighting",
    status: "reported",
    createdAt: new Date().toISOString(),
    latitude: 28.6139,
    longitude: 77.209,
    votes: 0,
    comments: [],
    history: [
      {
        status: "reported",
        timestamp: new Date().toISOString(),
        note: "Reported by user",
      },
    ],
  },
];

export default function CivicTrack() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
    distance: 5,
  });

  useEffect(() => {
    let filtered = issues;
    if (filters.category) filtered = filtered.filter((i) => i.category === filters.category);
    if (filters.status) filtered = filtered.filter((i) => i.status === filters.status);
    if (filters.search)
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          i.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    setFilteredIssues(filtered);
  }, [issues, filters]);

  const handleSubmitIssue = (
    newIssue: Omit<Issue, "id" | "createdAt" | "votes" | "comments" | "history">
  ) => {
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
    };

    setIssues((prev) => [issue, ...prev]);
    toast({
      title: "🎉 Issue Submitted!",
      description: "Badge earned: Community Reporter",
      duration: 4000,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">CivicTrack</h1>
          </div>
          <Link href="/issues">
            <Badge
              variant="secondary"
              className="hidden sm:flex cursor-pointer hover:bg-gray-200 transition"
            >
              <Users className="w-3 h-3 mr-1" />
              {issues.length} Issues
            </Badge>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-1/4 bg-white border-r overflow-y-auto">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            issueCount={filteredIssues.length}
          />
        </aside>

        <section className="w-2/4 relative">
          <MapView
            issues={filteredIssues}
            onIssueSelect={setSelectedIssue}
            selectedIssue={selectedIssue}
          />
        </section>

        <aside className="w-1/4 bg-white border-l overflow-y-auto">
          <IssueForm onSubmit={handleSubmitIssue} />
        </aside>
      </main>
    </div>
  );
}

