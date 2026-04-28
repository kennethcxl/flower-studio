"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type FloristTouchToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function FloristTouchToggle({ checked, onChange }: FloristTouchToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "border-primary bg-accent" : "bg-white/70 hover:bg-muted",
      )}
      aria-pressed={checked}
    >
      <span className="flex items-center gap-3">
        <span className={cn("grid h-10 w-10 place-items-center rounded-full", checked ? "bg-primary text-primary-foreground" : "bg-muted")}>
          <Sparkles className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Florist touch</span>
          <span className="text-sm text-muted-foreground">
            {checked ? "On: professionally styled with subtle adjustments" : "Off: precise to your chosen ingredients"}
          </span>
        </span>
      </span>
      <span className={cn("flex h-6 w-11 items-center rounded-full p-1 transition", checked ? "bg-primary" : "bg-border")}>
        <span className={cn("h-4 w-4 rounded-full bg-white transition", checked && "translate-x-5")} />
      </span>
    </button>
  );
}
