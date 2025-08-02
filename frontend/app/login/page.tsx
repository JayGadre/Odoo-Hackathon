"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()

  const backendUrl = "http://127.0.0.1:8000" // change if deployed

  const handleSubmit = async () => {
    const endpoint = isSignup ? "/auth/signup" : "/auth/login"
    const payload = isSignup ? { name, email, password } : { email, password }

    const res = await fetch(`${backendUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem("token", data.access_token)
      router.push("/")
    } else {
      alert("Authentication failed")
    }
  }

  const handleGoogleLogin = () => {
    const clientId = "YOUR_GOOGLE_CLIENT_ID"
    const clientSecret = "YOUR_GOOGLE_CLIENT_SECRET"
    const redirectUri = `${backendUrl}/auth/google/callback`
    window.location.href = `${backendUrl}/auth/google?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">{isSignup ? "Sign Up" : "Login"}</h1>

        {isSignup && (
          <input
            className="border p-2 w-full mb-4"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="border p-2 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Continue with Google
        </button>

        <p
          className="mt-4 text-blue-500 cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  )
}
