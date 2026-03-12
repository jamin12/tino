import { Plus, Trash2 } from "lucide-react";
import { TextInput } from "./TextInput";
import { Button } from "../primitives/Button";
import { cn } from "../cn";

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  pairs: KeyValuePair[];
}

export function KeyValueEditor({
  label,
  pairs,
  className,
  ...props
}: KeyValueEditorProps) {
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#333333] tracking-[-0.13px] leading-5">
          {label}
        </span>
        <Button variant="icon" size="icon" aria-label="추가">
          <Plus className="w-4 h-4 text-[#0077ff]" />
        </Button>
      </div>
      {pairs.map((pair, index) => (
        <div key={index} className="flex items-center gap-2">
          <TextInput
            placeholder="key"
            defaultValue={pair.key}
            readOnly
            className="flex-1"
          />
          <TextInput
            placeholder="value"
            defaultValue={pair.value}
            readOnly
            className="flex-1"
          />
          <Button variant="icon" size="icon" aria-label="삭제">
            <Trash2 className="w-4 h-4 text-[#da1e28]" />
          </Button>
        </div>
      ))}
    </div>
  );
}
