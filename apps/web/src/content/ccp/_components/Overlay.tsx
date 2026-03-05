import type { ReactNode } from "react";

interface OverlayProps {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  children: ReactNode;
}

function toPx(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function Overlay({ top, left, right, bottom, children }: OverlayProps) {
  return (
    <div
      className="absolute"
      style={{
        top: toPx(top),
        left: toPx(left),
        right: toPx(right),
        bottom: toPx(bottom),
      }}
    >
      {children}
    </div>
  );
}
