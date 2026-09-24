"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, Code } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Helper to format inline elements: links, bold, italic, inline code, inline math
  const formatInline = (text: string): React.ReactNode => {
    if (!text) return "";

    // 1. Links: [label](url)
    const linkRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
    const segments: (string | React.ReactNode)[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        segments.push(formatInlineFormatting(text.substring(lastIdx, match.index)));
      }
      const label = match[1];
      const url = match[2];
      segments.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-0.5 mx-0.5 transition-colors"
        >
          <span>{label}</span>
          <ExternalLink className="h-3 w-3 inline shrink-0" />
        </a>
      );
      lastIdx = linkRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      segments.push(formatInlineFormatting(text.substring(lastIdx)));
    }

    return segments.length > 0 ? segments : formatInlineFormatting(text);
  };

  // Handle inline code, bold, italic, and math ($...$)
  const formatInlineFormatting = (text: string): React.ReactNode => {
    // Tokenize by inline code (`...`), bold (**...**), math ($...$), italic (*...*)
    const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\$[^\$]+\$|\*[^*]+\*)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, idx) => {
      if (!part) return null;

      // Inline code: `code`
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-muted text-foreground border border-border font-mono text-[11px] font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold: **text**
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={idx} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Inline math: $formula$
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        return (
          <span
            key={idx}
            className="px-1 py-0.5 mx-0.5 font-mono text-[12px] bg-muted/60 text-primary rounded border border-border/60 font-semibold"
          >
            {part.slice(1, -1)}
          </span>
        );
      }

      // Italic: *text*
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={idx} className="italic text-foreground/90">
            {part.slice(1, -1)}
          </em>
        );
      }

      return part;
    });
  };

  // Process markdown block-by-block
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Code Block: ```lang ... ```
    if (line.startsWith("```")) {
      const lang = line.replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const fullCode = codeLines.join("\n");
      const blockKey = `code-${i}`;

      elements.push(
        <div
          key={blockKey}
          className="my-3 rounded-xl bg-card border border-border overflow-hidden font-mono text-xs shadow-xs"
        >
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted border-b border-border text-muted-foreground text-[11px]">
            <span className="font-bold uppercase tracking-wider text-foreground">
              {lang || "code"}
            </span>
            <button
              onClick={() => handleCopy(fullCode, blockKey)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background border border-border hover:bg-muted text-foreground transition-colors font-sans"
              title="Copy code"
            >
              {copiedKey === blockKey ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span>{copiedKey === blockKey ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-3.5 overflow-x-auto text-foreground font-mono leading-relaxed bg-background/50">
            {fullCode}
          </pre>
        </div>
      );
      continue;
    }

    // 2. Math Block: $$ ... $$
    if (line.startsWith("$$")) {
      const mathLines: string[] = [];
      if (line.endsWith("$$") && line.length > 2) {
        mathLines.push(line.slice(2, -2).trim());
        i++;
      } else {
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("$$")) {
          mathLines.push(lines[i]);
          i++;
        }
        i++; // skip closing $$
      }
      const mathText = mathLines.join("\n");
      elements.push(
        <div
          key={`math-${i}`}
          className="my-3 p-3 rounded-xl bg-muted/40 border border-border text-center overflow-x-auto font-mono text-xs text-primary font-semibold"
        >
          {mathText}
        </div>
      );
      continue;
    }

    // 3. Markdown Table: consecutive lines starting with |
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        // Parse Header
        const headerRow = tableLines[0];
        const headers = headerRow
          .split("|")
          .map((h) => h.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

        // Check if row 2 is delimiter (|---|---|)
        const isDelimiter = (r: string) => /^\|(\s*:?-+:?\s*\|)+$/.test(r);
        let startDataIdx = 1;
        if (tableLines.length > 1 && isDelimiter(tableLines[1])) {
          startDataIdx = 2;
        }

        const dataRows = tableLines.slice(startDataIdx).map((r) =>
          r
            .split("|")
            .map((c) => c.trim())
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        );

        elements.push(
          <div
            key={`table-${i}`}
            className="my-3 overflow-x-auto rounded-xl border border-border bg-card shadow-xs"
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-foreground font-bold">
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-3.5 py-2 text-[11px] tracking-wider uppercase">
                      {formatInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {dataRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`hover:bg-muted/40 transition-colors ${
                      rIdx % 2 === 1 ? "bg-muted/20" : "bg-card"
                    }`}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2.5 text-foreground/90 leading-relaxed">
                        {formatInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 4. Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-lg sm:text-xl font-extrabold text-foreground mt-4 mb-2 pb-1 border-b border-border">
          {formatInline(line.replace(/^#\s+/, ""))}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-base sm:text-lg font-bold text-foreground mt-3.5 mb-2 pb-1 border-b border-border/80">
          {formatInline(line.replace(/^##\s+/, ""))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm sm:text-base font-bold text-primary mt-3 mb-1.5">
          {formatInline(line.replace(/^###\s+/, ""))}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-xs sm:text-sm font-bold text-foreground mt-2.5 mb-1">
          {formatInline(line.replace(/^####\s+/, ""))}
        </h4>
      );
      i++;
      continue;
    }

    // 5. Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-primary pl-3.5 py-1.5 my-2.5 bg-muted/30 rounded-r-xl italic text-foreground/80 text-xs sm:text-sm leading-relaxed"
        >
          {formatInline(quoteLines.join(" "))}
        </blockquote>
      );
      continue;
    }

    // 6. Horizontal Rule
    if (line === "---" || line === "***" || line === "___") {
      elements.push(<hr key={`hr-${i}`} className="border-border my-3.5" />);
      i++;
      continue;
    }

    // 7. Bullet List (- or *)
    if (line.startsWith("* ") || line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("* ") || lines[i].trim().startsWith("- "))) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-2 ml-4 list-disc text-foreground/90 text-xs sm:text-sm leading-relaxed">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Numbered List (1. , 2. )
    if (/^\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1 my-2 ml-4 list-decimal text-foreground/90 text-xs sm:text-sm leading-relaxed">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{formatInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // 9. Empty line
    if (!line) {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // 10. Normal Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-foreground/90 leading-relaxed text-xs sm:text-sm my-1">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1.5 w-full">{elements}</div>;
}
