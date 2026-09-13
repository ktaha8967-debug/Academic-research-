"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sliders, ArrowLeft, Cloud, Key, Cpu, CheckCircle2, Info } from "lucide-react";
import { AIModelConfig } from "@/lib/types";

export default function SettingsPage() {
  const [provider, setProvider] = useState<AIModelConfig["provider"]>("fallback");
  const [apiKey, setApiKey] = useState("");
  const [modelName, setModelName] = useState("llama-3.3-70b-versatile");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("academic_ai_config");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.provider) setProvider(parsed.provider);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.modelName) setModelName(parsed.modelName);
      }
    } catch {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config: AIModelConfig = {
      provider,
      apiKey: apiKey.trim(),
      modelName: modelName.trim(),
    };
    try {
      localStorage.setItem("academic_ai_config", JSON.stringify(config));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/80 px-4 sm:px-8 py-3.5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ChatGPT Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            <h1 className="font-extrabold text-sm sm:text-base text-foreground">Cloud Open-Source AI Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Settings Form */}
      <main className="mx-auto max-w-3xl w-full flex-1 p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-foreground">Select Cloud Open-Source Model Provider</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              100% Free Cloud Inference — No Local GPU or Local Setup Required
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "fallback", name: "Free Built-In Cloud Intelligence", desc: "Zero key required, high precision (Default)" },
                { id: "groq", name: "Groq Cloud (Free Tier)", desc: "Ultra-fast Llama-3.3-70B, Mixtral-8x7B" },
                { id: "openrouter", name: "OpenRouter (Free Tier)", desc: "Qwen-2.5-72B, Llama-3.3-70B Free" },
                { id: "huggingface", name: "Hugging Face Serverless", desc: "Open-Weights Cloud Endpoints" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProvider(p.id as any);
                    if (p.id === "groq") setModelName("llama-3.3-70b-versatile");
                    if (p.id === "openrouter") setModelName("meta-llama/llama-3.3-70b-instruct:free");
                  }}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                    provider === p.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border bg-background hover:bg-muted/40"
                  }`}
                >
                  <span className="font-bold text-xs text-foreground">{p.name}</span>
                  <span className="text-[11px] text-muted-foreground mt-1">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {provider !== "fallback" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {provider === "groq" ? "Groq API Key (Free at console.groq.com)" : "API Key (Free Tier)"}
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="gsk_... or sk-or-..."
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Model Identifier</label>
                <div className="relative">
                  <Cpu className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="llama-3.3-70b-versatile"
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 items-start text-xs text-muted-foreground">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-bold">100% Free & Open-Source Guarantee:</strong>
              <p className="mt-1 leading-relaxed">
                AcademicAI connects to public open-access scholarly databases and hosted cloud open-weight models. You will never be forced into proprietary paid subscription lock-ins.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
            >
              {saved ? <CheckCircle2 className="h-4 w-4" /> : null}
              <span>{saved ? "Settings Saved!" : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
