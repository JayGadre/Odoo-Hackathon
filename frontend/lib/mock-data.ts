export interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: "reported" | "in-progress" | "resolved"
  location: {
    lat: number
    lng: number
  }
  author: string
  createdAt: string
  votes: number
  photo?: string
  comments: Comment[]
  history: StatusHistory[]
}

export interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface StatusHistory {
  status: "reported" | "in-progress" | "resolved"
  timestamp: string
  note?: string
}

export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description:
      "Large pothole near the intersection of Main St and Oak Ave. It's been growing larger after recent rains and is causing damage to vehicles. The hole is approximately 2 feet wide and 6 inches deep.",
    category: "Road Maintenance",
    status: "reported",
    location: { lat: 37.7849, lng: -122.4094 },
    author: "Sarah Johnson",
    createdAt: "2024-01-15T10:30:00Z",
    votes: 12,
    photo: "/placeholder.svg?height=300&width=400",
    comments: [
      {
        id: "1",
        author: "Mike Chen",
        content: "I hit this pothole yesterday and it damaged my tire. This needs to be fixed ASAP!",
        createdAt: "2024-01-15T14:20:00Z",
      },
      {
        id: "2",
        author: "City Worker",
        content:
          "Thank you for reporting this. We have added it to our maintenance queue and will address it within the next week.",
        createdAt: "2024-01-16T09:15:00Z",
      },
    ],
    history: [
      {
        status: "reported",
        timestamp: "2024-01-15T10:30:00Z",
        note: "Issue reported by community member",
      },
    ],
  },
  {
    id: "2",
    title: "Broken Street Light",
    description:
      "Street light at the corner of Pine St and 2nd Ave has been out for over a week. This area gets quite dark at night and poses a safety concern for pedestrians.",
    category: "Street Lighting",
    status: "in-progress",
    location: { lat: 37.7749, lng: -122.4194 },
    author: "David Rodriguez",
    createdAt: "2024-01-10T18:45:00Z",
    votes: 8,
    comments: [
      {
        id: "3",
        author: "Jennifer Liu",
        content: "I walk through this area every evening after work. It's really unsafe without proper lighting.",
        createdAt: "2024-01-11T07:30:00Z",
      },
    ],
    history: [
      {
        status: "reported",
        timestamp: "2024-01-10T18:45:00Z",
        note: "Issue reported by community member",
      },
      {
        status: "in-progress",
        timestamp: "2024-01-12T11:00:00Z",
        note: "Maintenance crew dispatched to assess and repair",
      },
    ],
  },
  {
    id: "3",
    title: "Overflowing Trash Bin",
    description:
      "The public trash bin in Riverside Park is consistently overflowing. Trash is scattered around the area, attracting pests and creating an unsanitary environment.",
    category: "Waste Management",
    status: "resolved",
    location: { lat: 37.7649, lng: -122.4294 },
    author: "Emily Watson",
    createdAt: "2024-01-05T12:15:00Z",
    votes: 15,
    photo: "/placeholder.svg?height=300&width=400",
    comments: [
      {
        id: "4",
        author: "Park Maintenance",
        content: "We have increased the pickup frequency for this location and added an additional bin nearby.",
        createdAt: "2024-01-08T10:00:00Z",
      },
    ],
    history: [
      {
        status: "reported",
        timestamp: "2024-01-05T12:15:00Z",
        note: "Issue reported by community member",
      },
      {
        status: "in-progress",
        timestamp: "2024-01-06T09:30:00Z",
        note: "Waste management team notified",
      },
      {
        status: "resolved",
        timestamp: "2024-01-08T15:45:00Z",
        note: "Additional bin installed and pickup schedule updated",
      },
    ],
  },
  {
    id: "4",
    title: "Playground Equipment Needs Repair",
    description:
      "The swing set at Maple Grove Playground has a broken chain on one of the swings. The swing is currently unusable and potentially dangerous.",
    category: "Parks & Recreation",
    status: "reported",
    location: { lat: 37.7549, lng: -122.4394 },
    author: "Robert Kim",
    createdAt: "2024-01-18T16:20:00Z",
    votes: 6,
    comments: [],
    history: [
      {
        status: "reported",
        timestamp: "2024-01-18T16:20:00Z",
        note: "Issue reported by community member",
      },
    ],
  },
  {
    id: "5",
    title: "Loud Construction After Hours",
    description:
      "Construction work at the new apartment complex on Elm Street continues well past 10 PM on weekdays, violating city noise ordinances and disturbing residents.",
    category: "Noise Complaint",
    status: "in-progress",
    location: { lat: 37.7949, lng: -122.3994 },
    author: "Lisa Thompson",
    createdAt: "2024-01-12T22:30:00Z",
    votes: 9,
    comments: [
      {
        id: "5",
        author: "Code Enforcement",
        content:
          "We have contacted the construction company and issued a warning. Please continue to report if violations persist.",
        createdAt: "2024-01-13T08:45:00Z",
      },
    ],
    history: [
      {
        status: "reported",
        timestamp: "2024-01-12T22:30:00Z",
        note: "Noise complaint filed",
      },
      {
        status: "in-progress",
        timestamp: "2024-01-13T08:45:00Z",
        note: "Code enforcement investigating",
      },
    ],
  },
  {
    id: "6",
    title: "Graffiti on Public Building",
    description:
      "Large graffiti tags have appeared on the side wall of the community center. The graffiti is visible from the main street and detracts from the neighborhood appearance.",
    category: "Public Safety",
    status: "resolved",
    location: { lat: 37.7449, lng: -122.4494 },
    author: "Carlos Martinez",
    createdAt: "2024-01-08T14:10:00Z",
    votes: 4,
    photo: "/placeholder.svg?height=300&width=400",
    comments: [
      {
        id: "6",
        author: "Maintenance Team",
        content:
          "Graffiti has been removed and we have installed additional lighting in the area to deter future vandalism.",
        createdAt: "2024-01-10T11:30:00Z",
      },
    ],
    history: [
      {
        status: "reported",
        timestamp: "2024-01-08T14:10:00Z",
        note: "Graffiti reported",
      },
      {
        status: "in-progress",
        timestamp: "2024-01-09T08:00:00Z",
        note: "Cleaning crew scheduled",
      },
      {
        status: "resolved",
        timestamp: "2024-01-10T16:00:00Z",
        note: "Graffiti removed and preventive measures installed",
      },
    ],
  },
]
