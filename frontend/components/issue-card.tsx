"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { X, ThumbsUp, MessageCircle, MapPin, Calendar, User, Send } from "lucide-react"
import type { Issue } from "@/lib/mock-data"

interface IssueCardProps {
  issue: Issue
  onClose: () => void
  onVote: (issueId: string) => void
}

export function IssueCard({ issue, onClose, onVote }: IssueCardProps) {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(issue.comments)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      createdAt: new Date().toISOString(),
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{issue.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {issue.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(issue.createdAt)}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {issue.category}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(issue.status)}>{issue.status.replace("-", " ").toUpperCase()}</Badge>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVote(issue.id)}
                className="flex items-center space-x-1"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{issue.votes}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </Button>
            </div>
          </div>

          {/* Photo */}
          {issue.photo && (
            <div className="rounded-lg overflow-hidden">
              <img src={issue.photo || "/placeholder.svg"} alt="Issue photo" className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Status History */}
          <div>
            <h3 className="font-semibold mb-3">Status History</h3>
            <div className="space-y-3">
              {issue.history.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${
                      entry.status === "reported"
                        ? "bg-orange-500"
                        : entry.status === "in-progress"
                          ? "bg-blue-500"
                          : "bg-green-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{entry.status.replace("-", " ").toUpperCase()}</span>
                      <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                    </div>
                    {entry.note && <p className="text-sm text-gray-600 mt-1">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="font-semibold mb-3">Comments ({comments.length})</h3>

            {/* Add Comment */}
            <div className="mb-4">
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>CU</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
