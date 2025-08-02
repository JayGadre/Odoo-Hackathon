export type Issue = {
  id: string
  title: string
  description: string
  category: string
  status: "reported" | "in progress" | "resolved"
  createdAt: string
  latitude: number
  longitude: number
  votes: number
  comments: string[]
  imageUrl?: string // ✅ New field
  history: {
    status: string
    timestamp: string
    note: string
  }[]
}
