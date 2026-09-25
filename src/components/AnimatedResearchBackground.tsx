"use client";

import React, { useEffect, useRef, useState } from "react";

// ============================================================================
// ACADEMIC NEURAL & QUANTUM CONSTELLATION ENGINE
// 100% Solid Colors, Pure Canvas Physics, Zero Gradients (Strict Adherence to Rule #3)
// Features:
// - Synaptic literature graph nodes with inter-nodal filament communication pulses
// - Floating LaTeX & mathematical notation glyphs (∑, ∫, ∂, Δ, λ, Ω, π, ħ, p<0.05, etc.)
// - 3D tumbling seminal citation cards ([Vaswani 2017], [Hinton 2015], [He 2016], etc.)
// - Interactive cursor gravitational field & reactive filament tethering
// - Bioluminescent scholarly spore wake generated along cursor trajectory
// - Concentric academic radar shockwave rings triggered on click
// - DPR-aware retina rendering with high frame-rate requestAnimationFrame loop
// ============================================================================

interface NetworkNode {
  type: "node";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  r: number;
  g: number;
  b: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface DataPulse {
  fromNode: NetworkNode;
  toNode: NetworkNode;
  progress: number;
  speed: number;
  color: string;
}

interface ScholarlyGlyph {
  type: "glyph";
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  alpha: number;
  size: number;
  swaySpeed: number;
  swayAmp: number;
  swayOffset: number;
}

interface CitationBadge {
  type: "citation";
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  metric: string;
  width: number;
  height: number;
  alpha: number;
  angle: number;
  vAngle: number;
}

interface MouseSpore {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  char?: string;
}

interface ClickRadarShockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  speed: number;
}

const GLYPH_SYMBOLS = [
  "∑", "∫", "∂", "Δ", "λ", "Ω", "π", "ħ", "∇", "∞", "≈", "∈", "ℝ", "H₀", "H₁",
  "p<0.001", "N=480M", "O(log n)", "d_model=512", "F₁=0.94"
];

const SEMINAL_CITATIONS = [
  { label: "Vaswani et al. (2017)", metric: "135k cites" },
  { label: "He et al. (2016)", metric: "210k cites" },
  { label: "Hinton et al. (2015)", metric: "24k cites" },
  { label: "Devlin et al. (2018)", metric: "88k cites" },
  { label: "Brown et al. (2020)", metric: "39k cites" },
  { label: "OpenAlex (2024)", metric: "250M index" },
];

const NODE_PALETTE = [
  { r: 37, g: 99, b: 235, str: "37, 99, 235" },   // Academic Blue
  { r: 79, g: 70, b: 229, str: "79, 70, 229" },   // Scholarly Indigo
  { r: 5, g: 150, b: 105, str: "5, 150, 105" },   // Peer-Reviewed Emerald
  { r: 124, g: 58, b: 237, str: "124, 58, 237" }, // Theoretical Violet
  { r: 217, g: 119, b: 6, str: "217, 119, 6" },   // Amber Citation
];

export function AnimatedResearchBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [motionIntensity, setMotionIntensity] = useState<"active" | "boosted">("active");
  const [pulseCount, setPulseCount] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId: number;
    let time = 0;

    // Mouse coordinates and state
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      radius: 175,
      active: false,
      lastSpawnTime: 0,
    };

    const mouseSpores: MouseSpore[] = [];
    const shockwaves: ClickRadarShockwave[] = [];
    const dataPulses: DataPulse[] = [];

    // Resize handler with DPR scaling for crisp graphics
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse Interaction Handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      // Spawn scholarly mathematical spore wake
      const now = performance.now();
      if (now - mouse.lastSpawnTime > 32 && mouseSpores.length < 40) {
        mouse.lastSpawnTime = now;
        const p = NODE_PALETTE[Math.floor(Math.random() * NODE_PALETTE.length)];
        const isSymbol = Math.random() > 0.65;
        mouseSpores.push({
          x: e.clientX + (Math.random() - 0.5) * 14,
          y: e.clientY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -(Math.random() * 1.1 + 0.5),
          radius: Math.random() * 2.5 + 1.2,
          color: p.str,
          alpha: 0.75,
          decay: 0.016 + Math.random() * 0.015,
          char: isSymbol ? GLYPH_SYMBOLS[Math.floor(Math.random() * 8)] : undefined,
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    const handleClick = (e: MouseEvent) => {
      // Trigger expanding academic radar wavefront
      if (shockwaves.length < 8) {
        const pal = NODE_PALETTE[Math.floor(Math.random() * NODE_PALETTE.length)];
        shockwaves.push({
          x: e.clientX,
          y: e.clientY,
          radius: 6,
          maxRadius: 260 + Math.random() * 120,
          alpha: 0.6,
          color: pal.str,
          speed: 4.8,
        });
        setPulseCount((c) => c + 1);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    // Initialize Synaptic Network Nodes
    const nodeCount = Math.min(Math.max(Math.floor((width * height) / 16000), 32), 75);
    const nodes: NetworkNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const pal = NODE_PALETTE[Math.floor(Math.random() * NODE_PALETTE.length)];
      const baseRadius = Math.random() * 2.8 + 1.8;
      nodes.push({
        type: "node",
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: baseRadius,
        baseRadius,
        color: pal.str,
        r: pal.r,
        g: pal.g,
        b: pal.b,
        alpha: Math.random() * 0.35 + 0.35,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Initialize Floating Scholarly Glyphs
    const glyphCount = 18;
    const glyphs: ScholarlyGlyph[] = [];
    for (let i = 0; i < glyphCount; i++) {
      glyphs.push({
        type: "glyph",
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.35 + 0.18),
        symbol: GLYPH_SYMBOLS[Math.floor(Math.random() * GLYPH_SYMBOLS.length)],
        alpha: Math.random() * 0.22 + 0.12,
        size: Math.floor(Math.random() * 7 + 12),
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAmp: Math.random() * 1.5 + 0.8,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    // Initialize Floating Seminal Citation Cards
    const citationBadges: CitationBadge[] = [];
    const badgeCount = Math.min(6, SEMINAL_CITATIONS.length);
    for (let i = 0; i < badgeCount; i++) {
      const item = SEMINAL_CITATIONS[i];
      citationBadges.push({
        type: "citation",
        x: Math.random() * (width - 150) + 75,
        y: Math.random() * (height - 100) + 50,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.25 + 0.12),
        label: item.label,
        metric: item.metric,
        width: 148,
        height: 38,
        alpha: 0.24,
        angle: (Math.random() - 0.5) * 0.08,
        vAngle: (Math.random() - 0.5) * 0.002,
      });
    }

    // Spawn periodic data pulses between adjacent network nodes
    let lastDataPulseSpawn = 0;

    // MAIN ANIMATION LOOP
    const render = (now: number) => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.2;
      mouse.y += (mouse.targetY - mouse.y) * 0.2;

      // 1. QUANTUM TOPOLOGY MATRIX GRID (Subtle pulsating dots, solid color)
      const gridSpacing = 44;
      ctx.fillStyle = "rgba(148, 163, 184, 0.08)";
      for (let gx = gridSpacing; gx < width; gx += gridSpacing) {
        for (let gy = gridSpacing; gy < height; gy += gridSpacing) {
          // Micro-wave oscillation
          const wave = Math.sin(gx * 0.008 + gy * 0.008 + time * 0.025);
          if (wave > 0.4) {
            ctx.beginPath();
            ctx.arc(gx, gy, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 2. RADAR SHOCKWAVES (Concentric echo rings expanding across canvas)
      for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const sw = shockwaves[sIdx];
        sw.radius += sw.speed;
        sw.alpha *= 0.965;

        ctx.save();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = `rgba(${sw.color}, ${Math.max(0, sw.alpha)})`;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner secondary pulse ring
        if (sw.radius > 25) {
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(${sw.color}, ${Math.max(0, sw.alpha * 0.5)})`;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius * 0.65, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Shockwave excites nearby nodes
        for (let n of nodes) {
          const dx = n.x - sw.x;
          const dy = n.y - sw.y;
          const dist = Math.hypot(dx, dy);
          if (Math.abs(dist - sw.radius) < 22) {
            n.vx += (dx / (dist || 1)) * 0.4;
            n.vy += (dy / (dist || 1)) * 0.4;
          }
        }

        if (sw.alpha < 0.01 || sw.radius > sw.maxRadius) {
          shockwaves.splice(sIdx, 1);
        }
      }

      // 3. SYNAPTIC FILAMENTS & DATA TRANSMISSION PULSES
      const maxConnectDist = 135;
      const maxConnectDistSq = maxConnectDist * maxConnectDist;

      for (let i = 0; i < nodes.length; i++) {
        const na = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nb = nodes[j];
          const dx = nb.x - na.x;
          const dy = nb.y - na.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnectDistSq) {
            const dist = Math.sqrt(distSq);
            const edgeAlpha = (1 - dist / maxConnectDist) * 0.28;

            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.strokeStyle = `rgba(${na.color}, ${edgeAlpha})`;
            ctx.lineWidth = 0.95;
            ctx.stroke();

            // Occasionally spawn a high-speed data transmission pulse along active edge
            if (now - lastDataPulseSpawn > 220 && Math.random() < 0.015 && dataPulses.length < 15) {
              lastDataPulseSpawn = now;
              dataPulses.push({
                fromNode: na,
                toNode: nb,
                progress: 0,
                speed: 0.025 + Math.random() * 0.02,
                color: na.color,
              });
            }
          }
        }

        // Connect nodes to mouse cursor if within interactive proximity
        if (mouse.active) {
          const mdx = mouse.x - na.x;
          const mdy = mouse.y - na.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < mouse.radius) {
            const mAlpha = (1 - mDist / mouse.radius) * 0.55;
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${mAlpha})`;
            ctx.lineWidth = 1.35;
            ctx.stroke();

            // Gravitational pull towards cursor
            na.vx += (mdx / mDist) * 0.12;
            na.vy += (mdy / mDist) * 0.12;
          }
        }
      }

      // Render Active Data Packets travelling between nodes
      for (let pIdx = dataPulses.length - 1; pIdx >= 0; pIdx--) {
        const dp = dataPulses[pIdx];
        dp.progress += dp.speed;

        const curX = dp.fromNode.x + (dp.toNode.x - dp.fromNode.x) * dp.progress;
        const curY = dp.fromNode.y + (dp.toNode.y - dp.fromNode.y) * dp.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.95)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(curX, curY, 3.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${dp.color}, 0.7)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (dp.progress >= 1) {
          dataPulses.splice(pIdx, 1);
        }
      }

      // 4. UPDATE & RENDER NODES
      for (let n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Friction / velocity damping
        n.vx *= 0.985;
        n.vy *= 0.985;

        // Soft screen bounce
        if (n.x < 10) { n.x = 10; n.vx = Math.abs(n.vx) * 0.9; }
        if (n.x > width - 10) { n.x = width - 10; n.vx = -Math.abs(n.vx) * 0.9; }
        if (n.y < 10) { n.y = 10; n.vy = Math.abs(n.vy) * 0.9; }
        if (n.y > height - 10) { n.y = height - 10; n.vy = -Math.abs(n.vy) * 0.9; }

        // Pulsing radius
        n.pulsePhase += n.pulseSpeed;
        const currentRadius = n.baseRadius + Math.sin(n.pulsePhase) * 0.8;

        // Node Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color}, ${n.alpha})`;
        ctx.fill();

        // Node Halo Ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${n.color}, ${n.alpha * 0.45})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      // 5. FLOATING MATHEMATICAL & ACADEMIC GLYPHS
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let g of glyphs) {
        g.y += g.vy;
        g.x += g.vx + Math.sin(time * g.swaySpeed + g.swayOffset) * g.swayAmp * 0.25;

        if (g.y < -30) {
          g.y = height + 30;
          g.x = Math.random() * width;
        }

        ctx.font = `600 ${g.size}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.fillStyle = `rgba(148, 163, 184, ${g.alpha})`;
        ctx.fillText(g.symbol, g.x, g.y);
      }
      ctx.restore();

      // 6. 3D FLOATING CITATION BADGES (Drifting paper nodes)
      for (let badge of citationBadges) {
        badge.y += badge.vy;
        badge.x += badge.vx;
        badge.angle += badge.vAngle;

        if (badge.y < -50) {
          badge.y = height + 50;
          badge.x = Math.random() * (width - 160) + 80;
        }

        ctx.save();
        ctx.translate(badge.x, badge.y);
        ctx.rotate(badge.angle);

        // Solid rounded card box (Strict solid colors, NO gradients)
        ctx.fillStyle = "rgba(30, 41, 59, 0.45)";
        ctx.strokeStyle = "rgba(100, 116, 139, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-badge.width / 2, -badge.height / 2, badge.width, badge.height, 6);
        ctx.fill();
        ctx.stroke();

        // Paper icon dot
        ctx.fillStyle = "rgba(59, 130, 246, 0.75)";
        ctx.beginPath();
        ctx.arc(-badge.width / 2 + 14, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Label text
        ctx.font = "bold 9.5px sans-serif";
        ctx.fillStyle = "rgba(226, 232, 240, 0.75)";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(badge.label, -badge.width / 2 + 24, -4);

        // Metric badge
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(148, 163, 184, 0.65)";
        ctx.fillText(badge.metric, -badge.width / 2 + 24, 7);

        ctx.restore();
      }

      // 7. MOUSE SPORES & INTERACTIVE SPARK TRAIL
      for (let sIdx = mouseSpores.length - 1; sIdx >= 0; sIdx--) {
        const sp = mouseSpores[sIdx];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;

        if (sp.char) {
          ctx.font = "bold 11px monospace";
          ctx.fillStyle = `rgba(${sp.color}, ${Math.max(0, sp.alpha)})`;
          ctx.fillText(sp.char, sp.x, sp.y);
        } else {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, Math.max(0.5, sp.radius), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${sp.color}, ${Math.max(0, sp.alpha)})`;
          ctx.fill();
        }

        if (sp.alpha <= 0) {
          mouseSpores.splice(sIdx, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {/* Dynamic Animated Academic Neural Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-85 transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Interactive System State & Live Physics Indicator (Top-Right Floating Pill) */}
      <div className="fixed bottom-3 right-4 z-40 hidden sm:flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur-md shadow-xs pointer-events-auto">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          LIVE NEURAL GRAPH
        </span>
        <span className="text-muted-foreground/60">•</span>
        <span className="text-muted-foreground text-[10px]">
          Physics & Synapses Active
        </span>
        {pulseCount > 0 && (
          <span className="ml-1 rounded-sm bg-primary/10 px-1 text-[9px] font-bold text-primary">
            {pulseCount} pings
          </span>
        )}
      </div>
    </>
  );
}
