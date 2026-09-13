"use client";

import React, { useState } from "react";
import { AIModelConfig } from "@/lib/types";
import { X, Cloud, Key, CheckCircle, Cpu, Info, Shield } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIModelConfig;
  onSaveConfig: (config: AIModelConfig) => void;
}

export function SettingsModal({ isOpen, onClose, config, onSaveConfig }: SettingsModalProps) {
  const [provider, setProvider] = useState<AIModelConfig["provider"]>(config.provider || "fallback");
  const [apiKey, setApiKey] = useState(config.apiKey || "");
  const [modelName, setModelName] = useState(config.modelName || "llama-3.3-70b-versatile");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey: apiKey.trim(),
      modelName: modelName.trim(),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">Cloud Open-Source AI Settings</h2>
              <p className="text-xs text-muted-foreground">Configure 100% Free Cloud LLM Providers</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 p-6 text-sm">
          <div>
            <label className="block font-medium text-foreground mb-1.5">AI Provider (Hosted in Cloud)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "fallback", name: "Free Cloud Intelligence", desc: "Zero API key required (Built-in)" },
                { id: "groq", name: "Groq Cloud (Free)", desc: "Llama-3.3-70B, Mixtral (Ultra Fast)" },
                { id: "openrouter", name: "OpenRouter (Free)", desc: "Qwen-2.5, Llama-3.3 Free Tiers" },
                { id: "huggingface", name: "Hugging Face (Free)", desc: "Serverless Inference API" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProvider(p.id as any);
                    if (p.id === "groq") setModelName("llama-3.3-70b-versatile");
                    if (p.id === "openrouter") setModelName("meta-llama/llama-3.3-70b-instruct:free");
                  }}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    provider === p.id
                      ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
                      : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="font-semibold text-foreground text-xs">{p.name}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {provider !== "fallback" && (
            <>
              <div>
                <label className="block font-medium text-foreground mb-1">
                  {provider === "groq" ? "Groq API Key (Free from console.groq.com)" : "API Key (Free Tier)"}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="gsk_... or sk-or-..."
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  API keys are stored only in your local browser session and sent directly to the official cloud endpoint.
                </p>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Open-Source Model Identifier</label>
                <div className="relative">
                  <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="llama-3.3-70b-versatile"
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </>
          )}

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex gap-2.5 items-start text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold">100% Free & Open-Source Guarantee:</strong>
              <p className="mt-0.5">
                This platform uses public scholarly APIs (OpenAlex, arXiv, Crossref) and cloud inference for open weights models without requiring paid subscription APIs.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-3 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {saved ? <CheckCircle className="h-4 w-4" /> : null}
            <span>{saved ? "Saved!" : "Apply Settings"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
