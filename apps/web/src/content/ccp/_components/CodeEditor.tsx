import { cn } from "./cn";
import { Toggle } from "./Toggle";
import { Button } from "./Button";
import { Minus, Plus, Copy } from "lucide-react";

interface CodeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  theme?: "light" | "dark";
  fontSize?: number;
  showLineNumbers?: boolean;
  wordWrap?: boolean;
  onThemeChange?: (theme: "light" | "dark") => void;
  onFontSizeChange?: (size: number) => void;
  onWordWrapChange?: (wrap: boolean) => void;
  onLineNumbersChange?: (show: boolean) => void;
}

function highlightSyntax(line: string, theme: "light" | "dark") {
  const keyColor = theme === "light" ? "text-[#0077ff]" : "text-[#5cb3ff]";
  const valueColor = theme === "light" ? "text-[#e8720c]" : "text-[#ffa657]";
  const stringColor = theme === "light" ? "text-[#009d32]" : "text-[#7ee787]";
  const numberColor = theme === "light" ? "text-[#da1e28]" : "text-[#ff7b72]";
  const baseColor = theme === "light" ? "text-[#333]" : "text-[#e6edf3]";

  const parts: { text: string; className: string }[] = [];
  const regex = /("(?:[^"\\]|\\.)*")\s*:\s*("(?:[^"\\]|\\.)*"|[\d.]+(?:,)?|true|false|null)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: line.slice(lastIndex, match.index), className: baseColor });
    }
    parts.push({ text: match[1], className: keyColor });
    parts.push({ text: ": ", className: baseColor });
    const val = match[2];
    if (val.startsWith('"')) {
      parts.push({ text: val, className: stringColor });
    } else if (/^[\d.]/.test(val)) {
      parts.push({ text: val, className: numberColor });
    } else {
      parts.push({ text: val, className: valueColor });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    parts.push({ text: line.slice(lastIndex), className: baseColor });
  }

  if (parts.length === 0) {
    parts.push({ text: line, className: baseColor });
  }

  return parts;
}

export function CodeEditor({
  code,
  language = "json",
  theme = "light",
  fontSize = 14,
  showLineNumbers = true,
  wordWrap = true,
  onThemeChange,
  onFontSizeChange,
  onWordWrapChange,
  onLineNumbersChange,
  className,
  ...props
}: CodeEditorProps) {
  const lines = code.split("\n");
  const gutterWidth = String(lines.length).length;

  return (
    <div
      className={cn(
        "flex flex-col rounded border overflow-hidden",
        theme === "light"
          ? "bg-white border-[#e0e0e0]"
          : "bg-[#0d1117] border-[#30363d]",
        className,
      )}
      {...props}
    >
      {/* Toolbar */}
      <div
        className={cn(
          "flex items-center gap-3 px-3 h-[36px] border-b",
          theme === "light"
            ? "bg-[#f6f8fa] border-[#e0e0e0]"
            : "bg-[#161b22] border-[#30363d]",
        )}
      >
        {/* Font size */}
        <div className="flex items-center gap-1">
          <Button
            variant="icon"
            size="icon"
            className="!w-5 !h-5"
            onClick={() => onFontSizeChange?.(Math.max(10, fontSize - 1))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span
            className={cn(
              "text-[12px] font-medium min-w-[32px] text-center",
              theme === "light" ? "text-[#333]" : "text-[#e6edf3]",
            )}
          >
            {fontSize}px
          </span>
          <Button
            variant="icon"
            size="icon"
            className="!w-5 !h-5"
            onClick={() => onFontSizeChange?.(Math.min(24, fontSize + 1))}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-[12px] font-medium",
              theme === "light" ? "text-[#333]" : "text-[#e6edf3]",
            )}
          >
            테마
          </span>
          <Button
            variant={theme === "light" ? "primary" : "ghost"}
            size="sm"
            className="!h-5 !min-w-0 !px-1.5 !text-[11px]"
            onClick={() => onThemeChange?.(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "Light" : "Dark"}
          </Button>
        </div>

        {/* Word wrap toggle */}
        <Toggle
          label="자동 줄바꿈"
          checked={wordWrap}
          onChange={onWordWrapChange}
        />

        {/* Line numbers toggle */}
        <Toggle
          label="라인 넘버"
          checked={showLineNumbers}
          onChange={onLineNumbersChange}
        />

        {/* Copy button */}
        <button
          type="button"
          className={cn(
            "ml-auto p-1 rounded hover:bg-black/5",
            theme === "dark" && "hover:bg-white/10",
          )}
          onClick={() => navigator.clipboard.writeText(code)}
        >
          <Copy
            className={cn(
              "w-3.5 h-3.5",
              theme === "light" ? "text-[#666]" : "text-[#8b949e]",
            )}
          />
        </button>
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto p-3">
        <pre
          className={cn("font-mono", wordWrap && "whitespace-pre-wrap")}
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.5" }}
        >
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span
                  className={cn(
                    "select-none text-right pr-3 shrink-0",
                    theme === "light" ? "text-[#999]" : "text-[#484f58]",
                  )}
                  style={{ minWidth: `${gutterWidth + 1}ch` }}
                >
                  {i + 1}
                </span>
              )}
              <span className="flex-1">
                {language === "json"
                  ? highlightSyntax(line, theme).map((part, j) => (
                      <span key={j} className={part.className}>
                        {part.text}
                      </span>
                    ))
                  : (
                    <span className={theme === "light" ? "text-[#333]" : "text-[#e6edf3]"}>
                      {line}
                    </span>
                  )}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
