// API utility for issues
export async function fetchIssues() {
  const res = await fetch("http://localhost:8080/api/v1/issues/issues");
  if (!res.ok) throw new Error("Failed to fetch issues");
  return res.json();
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
