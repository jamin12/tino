import { Search } from "lucide-react";
import { cn } from "../cn";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  showButton?: boolean;
  width?: string;
}

export function SearchInput({
  onSearch,
  showButton = true,
  width = "300px",
  className,
  placeholder = "키워드 검색",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div
        className="flex h-8 items-center gap-2.5 p-2 bg-white rounded-sm border border-[#dddddd]"
        style={{ width }}
      >
        <input
          type="search"
          placeholder={placeholder}
          className="flex-1 text-[13px] font-normal tracking-[-0.13px] leading-5 text-[#333333] placeholder:text-[#999999] bg-transparent border-none outline-none"
          aria-label={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch?.(e.currentTarget.value);
            }
          }}
          {...props}
        />
      </div>
      {showButton && (
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center bg-[#f9f9f9] rounded-sm border border-[#dddddd] hover:bg-[#f0f0f0]"
          aria-label="검색"
          onClick={() => {}}
        >
          <Search className="w-4 h-4 text-[#555555]" />
        </button>
      )}
    </div>
  );
}
