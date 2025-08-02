"use client";

import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/hero-section";

export default function LandingPage() {
  const router = useRouter();

  return (
    <HeroSection
      isLoggedIn={false}
      onLogin={() => router.push("/login")}
      onContinueAnonymous={() => router.push("/main")}
      onGetStarted={() => router.push("/main")}
    />
  );
}