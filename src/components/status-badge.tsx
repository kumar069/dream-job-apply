import { Check, X, Loader2 } from "lucide-react";
import type { ApplicationStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STYLES: Record<
  ApplicationStatus,
  { label: string; cls: string; icon?: React.ReactNode }
> = {
  EXTRACTING: {
    label: "Extracting",
    cls: "bg-[oklch(0.95_0.06_85)] text-[oklch(0.45_0.12_75)] border-[oklch(0.45_0.12_75)]/20",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  DRAFT: {
    label: "Draft",
    cls: "bg-[oklch(0.94_0.04_245)] text-[oklch(0.4_0.14_255)] border-[oklch(0.4_0.14_255)]/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    cls: "bg-[oklch(0.94_0.05_300)] text-[oklch(0.42_0.16_300)] border-[oklch(0.42_0.16_300)]/20",
  },
  SENDING: {
    label: "Sending",
    cls: "bg-[oklch(0.93_0.08_50)] text-[oklch(0.5_0.16_45)] border-[oklch(0.5_0.16_45)]/20",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  SENT: {
    label: "Sent",
    cls: "bg-[oklch(0.94_0.06_150)] text-[oklch(0.42_0.13_150)] border-[oklch(0.42_0.13_150)]/20",
    icon: <Check className="h-3 w-3" />,
  },
  FAILED: {
    label: "Failed",
    cls: "bg-[oklch(0.94_0.06_25)] text-[oklch(0.48_0.18_25)] border-[oklch(0.48_0.18_25)]/20",
    icon: <X className="h-3 w-3" />,
  },
  DISCARDED: {
    label: "Discarded",
    cls: "bg-muted text-muted-foreground border-muted-foreground/15 line-through",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        s.cls,
        className,
      )}
    >
      {s.icon}
      {s.label}
    </span>
  );
}
