import { cn } from "@/lib/utils";

type OptionChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function OptionChip({ label, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary bg-primary text-primary-foreground" : "bg-white/70 hover:border-primary/50 hover:bg-muted",
      )}
    >
      {label}
    </button>
  );
}
