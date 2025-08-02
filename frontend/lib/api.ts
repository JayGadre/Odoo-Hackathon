// API utility for issues
export async function fetchIssues() {
  const res = await fetch("http://localhost:8080/api/v1/issues/issues");
  if (!res.ok) throw new Error("Failed to fetch issues");
  const rawData = await res.json();
  
  // Transform API response to match frontend expectations
  return rawData.map((item: any) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.description,
    category: item.category,
    status: item.status.toLowerCase(),
    location: {
      lat: item.latitude,
      lng: item.longitude
    },
    author: "Community Member", // Default since API doesn't provide this
    createdAt: item.created_at,
    votes: 0, // Default since API doesn't provide this
    photo: item.photos && item.photos.length > 0 ? item.photos[0].photo_url : undefined,
    comments: [], // Default empty array
    history: [{
      status: item.status.toLowerCase(),
      timestamp: item.created_at,
      note: "Issue reported by community member"
    }]
  }));
}

export async function createIssue(data: any) {
  const res = await fetch("http://localhost:8080/api/v1/issues/report-issue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create issue");
  return res.json();
}
