import { StatusDot } from "../primitives/StatusDot";

interface GitOpsStatusBadgeProps {
  status: string;
  statusColor?: string;
  health?: string;
  synced?: boolean;
}

export function GitOpsStatusBadge({
  status,
  statusColor = "success",
  health,
  synced,
}: GitOpsStatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1b2c3f] rounded-[0px_12px_12px_12px] shadow-[4px_4px_8px_#1b2c3f33]">
      <StatusDot color={statusColor} size="sm" />
      <span className="text-white text-[11px] font-normal leading-[14.3px] tracking-[-0.11px]">
        {status}
      </span>
      {health && (
        <>
          <span className="text-white/30 text-[11px] mx-1">|</span>
          <span className="text-[#18be94] text-[11px]">&#9829;</span>
          <span className="text-white text-[11px] font-normal">{health}</span>
        </>
      )}
      {synced && (
        <>
          <span className="text-[#18be94] text-[11px]">&#10003;</span>
          <span className="text-white text-[11px] font-normal">Synced</span>
        </>
      )}
    </div>
  );
}
