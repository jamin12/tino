import { Plus, Minus, ChevronLeft } from "lucide-react";
import { cn } from "../cn";

interface SubMenuItem {
  id?: string;
  label: string;
  active?: boolean;
  bold?: boolean;
}

interface MenuSection {
  label?: string;
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
  showCollapseButton?: boolean;
}

/**
 * Figma measurements (node 93:20565):
 * - Nav group: 270 x 1050
 * - Background rect: 260px wide, fill #1b2c3f
 * - Menu frame: 220px wide, starts 20px from nav left
 * - Top-level item: 220 x 56, icon at 12px, text at 32px (from menu left)
 * - Active item: 264 x 56, bg #0077FF, rounded-r ~28px
 * - Sub-item: 220 x 32, content at 16px from menu left
 * - Section header: 220 x 32, bold, no dot prefix
 * - Close button: 20x20 circle at (250, 58), white + #0077FF stroke
 */
export function SideMenu({
  logo,
  items,
  showCollapseButton = true,
  className,
  ...props
}: SideMenuProps) {
  return (
    <aside
      data-name="SideMenu"
      className={cn(
        "relative z-10 flex flex-col w-[284px] h-full text-white shrink-0",
        className,
      )}
      {...props}
    >
      {/* Dark background - 260px from left */}
      <div className="absolute inset-0 w-[260px] bg-[#1b2c3f]" />

      {/* Collapse button */}
      {showCollapseButton && (
        <button className="absolute z-20 top-[58px] left-[250px] w-5 h-5 rounded-full bg-white border border-[#0077FF] flex items-center justify-center">
          <ChevronLeft className="w-3 h-3 text-[#0077FF]" />
        </button>
      )}

      {/* Logo - 30px from nav left */}
      {logo && (
        <div className="relative z-10 pl-[30px] pt-[35px] pb-[25px]">
          {logo}
        </div>
      )}

      {/* Menu - offset 20px from nav left */}
      <nav className="relative z-10 flex-1 pl-5">
        {items.map((item) => {
          const isExpanded = item.expanded && item.sections;

          return (
            <div
              key={item.id}
              className={cn(isExpanded && "border-b border-white/20")}
            >
              {/* Top-level menu item: 220px normal / 264px active, 56px tall */}
              <div
                className={cn(
                  "flex items-center h-[56px] px-3 cursor-pointer transition-colors",
                  item.active
                    ? "w-[264px] bg-[#0077FF] text-white rounded-r-[28px]"
                    : "w-[220px] text-white hover:bg-white/5",
                )}
              >
                {/* Icon 14x14 */}
                <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5">
                  {item.icon}
                </span>

                {/* Label - Pretendard Medium 16px, line-height 24px */}
                <span className="flex-1 ml-[6px] text-[16px] font-medium leading-6 tracking-[-0.16px]">
                  {item.label}
                </span>

                {/* Expand icon 20x20 */}
                {item.expandIcon === "plus" && (
                  <Plus
                    className="w-5 h-5 text-[#d8d8d8] shrink-0"
                    strokeWidth={1.5}
                  />
                )}
                {item.expandIcon === "minus" && (
                  <Minus
                    className={cn(
                      "w-5 h-5 shrink-0",
                      item.active ? "text-white" : "text-[#d8d8d8]",
                    )}
                    strokeWidth={1.5}
                  />
                )}
              </div>

              {/* Expanded 2-depth section */}
              {isExpanded && (
                <div className="w-[220px] py-4">
                  {item.sections!.map((section, idx) => (
                    <div key={idx}>
                      {/* Section header - Bold 14px, no dot */}
                      {section.label && (
                        <div className="h-8 flex items-center pl-4">
                          <span className="text-[14px] font-bold leading-5 tracking-[-0.14px] text-white">
                            {section.label}
                          </span>
                        </div>
                      )}

                      {/* Section items - 14px with dot prefix */}
                      {section.items?.map((sub) => (
                        <div
                          key={sub.label}
                          className="h-8 flex items-center pl-4 cursor-pointer hover:bg-white/5"
                        >
                          <span
                            className={cn(
                              "text-[14px] leading-5 tracking-[-0.14px] text-white",
                              sub.active || sub.bold
                                ? "font-bold"
                                : "font-normal",
                            )}
                          >
                            <span className="inline-block w-[17px]">·</span>
                            {sub.label}
                          </span>
                        </div>
                      ))}

                      {/* Children groups (legacy) */}
                      {section.children?.map((child) => (
                        <div key={child.label}>
                          <div className="h-8 flex items-center pl-4">
                            <span className="text-[14px] font-bold leading-5 tracking-[-0.14px] text-white">
                              {child.label}
                            </span>
                          </div>
                          {child.items?.map((sub) => (
                            <div
                              key={sub.label}
                              className="h-8 flex items-center pl-4 cursor-pointer hover:bg-white/5"
                            >
                              <span
                                className={cn(
                                  "text-[14px] leading-5 tracking-[-0.14px] text-white",
                                  sub.active || sub.bold
                                    ? "font-bold"
                                    : "font-normal",
                                )}
                              >
                                <span className="inline-block w-[17px]">
                                  ·
                                </span>
                                {sub.label}
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
          );
        })}
      </nav>
    </aside>
  );
}

export type { SideMenuItem, MenuSection, SubMenuItem };
