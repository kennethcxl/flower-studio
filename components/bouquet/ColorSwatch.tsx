import { Check } from "lucide-react";
import { COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ColorSwatchProps = {
  color: (typeof COLORS)[number];
  selected: boolean;
  onClick: () => void;
};

export function ColorSwatch({ color, selected, onClick }: ColorSwatchProps) {
  const dark = color.name === "Black" || color.name === "Brown" || color.name === "Red" || color.name === "Blue";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-md border bg-white/70 px-2.5 py-2 text-left text-sm transition hover:border-primary/50",
        selected && "border-primary bg-muted",
      )}
      title={color.name}
    >
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full border"
        style={{ backgroundColor: color.value }}
        aria-hidden="true"
      >
        {selected ? <Check className={cn("h-3.5 w-3.5", dark ? "text-white" : "text-primary")} /> : null}
      </span>
      <span className="min-w-0 truncate">{color.name}</span>
    </button>
  );
}
