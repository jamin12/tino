import {
  ChevronDown,
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "./cn";

interface SubMenuItem {
  label: string;
  active?: boolean;
  bold?: boolean;
}

interface MenuSection {
  label: string;
  items?: SubMenuItem[];
  children?: { label: string; items?: SubMenuItem[] }[];
}

interface SideMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  expanded?: boolean;
  expandIcon?: "plus" | "minus";
  sections?: MenuSection[];
}

interface SideMenuProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  items: SideMenuItem[];
}

export function SideMenu({ logo, items, className, ...props }: SideMenuProps) {
  return (
    <aside
      className={cn(
        "flex flex-col w-[220px] h-full bg-[#1b2c3f] text-white shrink-0",
        className,
      )}
      {...props}
    >
      {/* Logo */}
      {logo && (
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
          {logo}
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2">
        {items.map((item) => (
          <div key={item.id}>
            {/* Top-level item */}
            <div
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 cursor-pointer transition-colors",
                item.active
                  ? "bg-[#0077ff] text-white"
                  : "text-white/80 hover:bg-white/5",
              )}
            >
              <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="flex-1 text-base font-medium leading-6 tracking-[-0.16px]">
                {item.label}
              </span>
              {item.expandIcon === "plus" && (
                <Plus className="w-4 h-4 opacity-60" />
              )}
              {item.expandIcon === "minus" && (
                <Minus className="w-4 h-4 opacity-60" />
              )}
            </div>

            {/* Expanded sections */}
            {item.expanded && item.sections && (
              <div className="pb-1">
                {item.sections.map((section) => (
                  <div key={section.label}>
                    {/* Section label */}
                    <div className="px-5 py-1.5 pl-12">
                      <span className="text-white/50 text-sm font-normal leading-5 tracking-[-0.14px]">
                        {section.label}
                      </span>
                    </div>
                    {/* Section items */}
                    {section.items?.map((sub) => (
                      <div
                        key={sub.label}
                        className={cn(
                          "px-5 py-1 pl-14 cursor-pointer",
                          sub.active
                            ? "text-white"
                            : "text-white/50 hover:text-white/70",
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm leading-5 tracking-[-0.14px]",
                            sub.bold || sub.active
                              ? "font-bold"
                              : "font-normal",
                          )}
                        >
                          · {sub.label}
                        </span>
                      </div>
                    ))}
                    {/* Children groups */}
                    {section.children?.map((child) => (
                      <div key={child.label}>
                        <div className="px-5 py-1.5 pl-12">
                          <span className="text-white/50 text-sm font-normal leading-5 tracking-[-0.14px]">
                            {child.label}
                          </span>
                        </div>
                        {child.items?.map((sub) => (
                          <div
                            key={sub.label}
                            className={cn(
                              "px-5 py-1 pl-14 cursor-pointer",
                              sub.active
                                ? "text-white"
                                : "text-white/50 hover:text-white/70",
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm leading-5 tracking-[-0.14px]",
                                sub.bold || sub.active
                                  ? "font-bold"
                                  : "font-normal",
                              )}
                            >
                              · {sub.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export type { SideMenuItem, MenuSection, SubMenuItem };
