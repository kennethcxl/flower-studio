"use client";

import { Label } from "@/components/ui/label";
import { DEFAULT_OCCASIONS, VIBES } from "@/lib/constants";
import { FloristTouchToggle } from "./FloristTouchToggle";
import { OptionChip } from "./OptionChip";
import { SectionShell } from "./SectionShell";

type StyleSectionProps = {
  vibe: string;
  occasion?: string;
  floristTouch: boolean;
  onVibeChange: (vibe: string) => void;
  onOccasionChange: (occasion: string) => void;
  onFloristTouchChange: (checked: boolean) => void;
};

export function StyleSection({
  vibe,
  occasion,
  floristTouch,
  onVibeChange,
  onOccasionChange,
  onFloristTouchChange,
}: StyleSectionProps) {
  return (
    <SectionShell index="4" title="Style" description="Set the mood and how much arranging freedom the florist has.">
      <div className="space-y-5">
        <div>
          <Label>Vibe</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {VIBES.map((item) => (
              <OptionChip key={item} label={item} selected={vibe === item} onClick={() => onVibeChange(item)} />
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="occasion">Occasion</Label>
          <input
            id="occasion"
            value={occasion ?? ""}
            onChange={(event) => onOccasionChange(event.target.value)}
            placeholder="Optional, e.g. anniversary"
            className="mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {DEFAULT_OCCASIONS.map((item) => (
              <OptionChip key={item} label={item} selected={occasion === item} onClick={() => onOccasionChange(item)} />
            ))}
          </div>
        </div>
        <FloristTouchToggle checked={floristTouch} onChange={onFloristTouchChange} />
      </div>
    </SectionShell>
  );
}
