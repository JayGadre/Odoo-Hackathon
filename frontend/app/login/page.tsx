"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const backendUrl = "http://127.0.0.1:8000"; // change if backend runs elsewhere

  const handleSubmit = async () => {
    const endpoint = isSignup ? "/auth/signup" : "/auth/login";
    const payload = isSignup ? { name, email, password } : { email, password };

    const res = await fetch(`${backendUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/main");
    } else {
      const err = await res.json();
      alert(err.detail || "Authentication failed");
    }
  };

  const handleGoogleLogin = () => {
    const clientId = "YOUR_GOOGLE_CLIENT_ID";
    const clientSecret = "YOUR_GOOGLE_CLIENT_SECRET";
    const redirectUri = `${backendUrl}/auth/google/callback`;
    window.location.href = `${backendUrl}/auth/google?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-md">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {isSignup ? "Join CivicTrack" : "Welcome Back"}
        </h1>
        <p className="text-gray-500 text-center mb-6">
          {isSignup
            ? "Create an account to start tracking community issues."
            : "Login to continue making an impact."}
        </p>

        {/* Form */}
        {isSignup && (
          <input
            className="border p-3 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="border p-3 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-3 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Buttons */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-md font-medium hover:opacity-90 transition mb-4"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-3 rounded-md font-medium hover:bg-red-600 transition"
        >
          Continue with Google
        </button>

        {/* Toggle */}
        <p
          className="mt-6 text-center text-blue-500 cursor-pointer hover:underline"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}
