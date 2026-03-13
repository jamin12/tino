import { ChevronDown } from "lucide-react";

interface YamlImportModalProps {
  /** Initial YAML content in the editor */
  yamlContent?: string;
  /** Namespace options */
  namespaces?: string[];
  /** Selected namespace */
  selectedNamespace?: string;
  /** Called when the modal should close */
  onClose?: () => void;
}

export function YamlImportModal({
  yamlContent = "",
  namespaces = ["default", "kube-system", "monitoring"],
  selectedNamespace = "default",
  onClose,
}: YamlImportModalProps) {
  return (
    /* Backdrop */
    <div
      className="absolute inset-0 z-50 flex items-start justify-center bg-black/30 pt-[80px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/* Modal */}
      <div className="w-[900px] bg-white rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.18)] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-5 pb-4">
          <h2 className="text-[15px] font-bold text-[#222]">YAML 가져오기</h2>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 pb-3">
          {/* 파일에서 읽기 */}
          <button
            type="button"
            className="flex items-center gap-1 px-4 py-1.5 rounded border border-[#2196f3] text-[#2196f3] text-[13px] font-medium hover:bg-[#e3f2fd] transition-colors cursor-pointer"
          >
            파일에서 읽기
          </button>

          {/* 기본 네임스페이스 Select */}
          <div className="relative flex flex-col items-end gap-0.5">
            <span className="text-[11px] text-[#888]">기본 네임스페이스</span>
            <div className="relative inline-flex h-8 items-center gap-2 px-3 py-1.5 bg-white rounded border border-[#ddd] min-w-[200px]">
              <span className="flex-1 text-[13px] text-[#333]">
                {selectedNamespace}
              </span>
              <select
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                defaultValue={selectedNamespace}
                aria-label="기본 네임스페이스"
              >
                {namespaces.map((ns) => (
                  <option key={ns} value={ns}>
                    {ns}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#555] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* YAML Editor Area */}
        <div className="mx-6 mb-5 border border-[#e0e6ed] rounded bg-[#f0f5fa] min-h-[380px] relative">
          {/* Line number gutter */}
          <div className="absolute top-0 left-0 w-8 h-full bg-[#e8edf3] rounded-l flex flex-col items-end pt-2 pr-1.5">
            <span className="text-[12px] text-[#999] leading-[20px]">1</span>
          </div>
          {/* Content area */}
          <div className="pl-10 pt-2 pr-3 pb-2">
            <pre className="text-[13px] text-[#555] font-mono leading-[20px] whitespace-pre-wrap">
              {yamlContent}
            </pre>
            {/* Blinking cursor effect */}
            {!yamlContent && (
              <span className="inline-block w-[1px] h-[16px] bg-[#333] animate-pulse" />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-[#eee]">
          <button
            type="button"
            className="flex items-center justify-center px-6 py-2 rounded border border-[#2196f3] text-[#2196f3] text-[13px] font-medium hover:bg-[#e3f2fd] transition-colors cursor-pointer min-w-[80px]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="flex items-center justify-center px-6 py-2 rounded bg-[#e0e0e0] text-[#999] text-[13px] font-medium cursor-not-allowed min-w-[80px]"
          >
            가져오기
          </button>
        </div>
      </div>
    </div>
  );
}
