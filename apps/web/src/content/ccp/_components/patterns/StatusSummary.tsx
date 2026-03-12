import { useState } from "react";
import { Tabs } from "../composites/Tabs";
import { StatusCard } from "../composites/StatusCard";

interface StatusSummaryTab {
  id: string;
  label: string;
  count?: number;
}

interface StatusSummaryCard {
  label: string;
  count: number;
  color: string;
}

interface StatusSummaryProps {
  tabs: StatusSummaryTab[];
  activeTabId: string;
  cards: StatusSummaryCard[];
  cardsByTab?: Record<string, StatusSummaryCard[]>;
}

export function StatusSummary({
  tabs,
  activeTabId,
  cards,
  cardsByTab,
}: StatusSummaryProps) {
  const [currentTab, setCurrentTab] = useState(activeTabId);

  const activeCards = cardsByTab?.[currentTab] ?? cards;

  return (
    <div data-name="StatusSummary">
      <Tabs
        items={tabs}
        activeId={currentTab}
        onTabChange={setCurrentTab}
      />
      <div className="flex items-start gap-5 mt-6 justify-center">
        {activeCards.map((card) => (
          <StatusCard
            key={card.label}
            label={card.label}
            count={card.count}
            color={card.color}
          />
        ))}
      </div>
    </div>
  );
}
