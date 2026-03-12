import { Terminal, Copy, Download } from "lucide-react";

interface LogViewerProps {
  title: string;
  content: string;
  showCursor?: boolean;
}

export function LogViewer({
  title,
  content,
  showCursor = true,
}: LogViewerProps) {
  return (
    <div className="h-full border border-[#e0e0e0] rounded-lg flex flex-col bg-[#1e1e1e] overflow-hidden">
      <div className="px-4 py-2 border-b border-[#333333] bg-[#252526] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#cccccc]" />
          <span className="text-[#cccccc] text-xs font-medium tracking-wide font-mono">
            {title}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-[#cccccc] hover:text-white p-1 rounded"
            aria-label="복사"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="text-[#cccccc] hover:text-white p-1 rounded"
            aria-label="다운로드"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto bg-[#1e1e1e]">
        <pre className="text-[#d4d4d4] font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
          {content}
          {showCursor && <span className="animate-pulse">_</span>}
        </pre>
      </div>
    </div>
  );
}
