import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface OverlayProps extends Omit<ComponentPropsWithoutRef<"div">, "style"> {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  position?: "absolute" | "fixed";
  children: ReactNode;
}

function toPx(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function Overlay({ top, left, right, bottom, position = "absolute", children, className, ...rest }: OverlayProps) {
  return (
    <div
      className={`${position} ${className ?? ""}`}
      style={{
        top: toPx(top),
        left: toPx(left),
        right: toPx(right),
        bottom: toPx(bottom),
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
