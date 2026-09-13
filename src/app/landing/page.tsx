"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";

export default function MarketingLandingRoute() {
  const router = useRouter();

  const handleLaunchApp = (agentId?: string) => {
    router.push("/");
  };

  return <LandingPage onLaunchApp={handleLaunchApp} savedPapersCount={24} />;
}
