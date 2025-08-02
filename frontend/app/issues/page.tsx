"use client"

import { useEffect, useState } from "react"
import { Issue } from "@/types/issue"
import Link from "next/link"

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    // TEMP MOCK DATA — replace with API call later
    const mockIssues: Issue[] = [
      {
        id: "1",
        title: "Broken streetlight",
        description: "The light near my house is broken.",
        category: "Street Lighting",
        status: "reported",
        createdAt: new Date().toISOString(),
        latitude: 28.6139,
        longitude: 77.2090,
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
    ]
    setIssues(mockIssues)
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📋 Reported Issues</h1>

        {issues.length === 0 ? (
          <p className="text-gray-500">No issues reported yet.</p>
        ) : (
          <ul className="space-y-4">
            {issues.map((issue) => (
              <li key={issue.id} className="p-4 bg-white rounded-lg shadow border">
                <h2 className="text-xl font-semibold">{issue.title}</h2>
                <p className="text-sm text-gray-600">{issue.description}</p>
                <p className="mt-2 text-sm">
                  <span className="font-medium text-blue-600">Category:</span> {issue.category}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-green-600">Status:</span> {issue.status}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline text-sm inline-block"
          >
            ← Back to CivicTrack
          </Link>
        </div>
      </div>
    </div>
  )
}
