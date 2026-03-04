import { useState } from "react";
import { domToFigmaSvg } from "@shared/lib";

interface Props {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function CopyToFigmaButton({ targetRef, className = "" }: Props) {
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copying" | "copied" | "error"
  >("idle");

  const handleCopy = async () => {
    if (!targetRef.current) return;
    try {
      setCopyStatus("copying");

      // Parse DOM to SVG format so Figma pastes them as separated nodes
      const svgString = await domToFigmaSvg(targetRef.current);
      if (!svgString) throw new Error("SVG extraction failed");

      // Figma natively parses plain text starting with <svg> into vector elements!
      await navigator.clipboard.writeText(svgString);

      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to copy element to Figma:", err);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copyStatus === "copying"}
      className={`flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 ${className}`}
    >
      {copyStatus === "idle" && (
        <>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy to Figma
        </>
      )}
      {copyStatus === "copying" && "Copying..."}
      {copyStatus === "copied" && "Copied! ✅"}
      {copyStatus === "error" && "Error ❌"}
    </button>
  );
}
