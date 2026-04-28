"use client";

import { Label } from "@/components/ui/label";
import { BOW_MATERIALS, COLORS, WRAPPER_MATERIALS } from "@/lib/constants";
import { ColorSwatch } from "./ColorSwatch";
import { OptionChip } from "./OptionChip";
import { SectionShell } from "./SectionShell";

type PresentationSectionProps = {
  kind: "wrapper" | "bow";
  material: string;
  color: string;
  onMaterialChange: (material: string) => void;
  onColorChange: (color: string) => void;
};

export function PresentationSection({
  kind,
  material,
  color,
  onMaterialChange,
  onColorChange,
}: PresentationSectionProps) {
  const isWrapper = kind === "wrapper";
  const materials = isWrapper ? WRAPPER_MATERIALS : BOW_MATERIALS;

  return (
    <SectionShell
      index={isWrapper ? "2" : "3"}
      title={isWrapper ? "Wrapping" : "Bow"}
      description={isWrapper ? "Set the paper or textile that frames the bouquet." : "Choose the finishing detail at the stems."}
    >
      <div className="space-y-5">
        <div>
          <Label>{isWrapper ? "Wrapper material" : "Bow material"}</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {materials.map((item) => (
              <OptionChip key={item} label={item} selected={material === item} onClick={() => onMaterialChange(item)} />
            ))}
          </div>
        </div>
        <div>
          <Label>{isWrapper ? "Wrapper color" : "Bow color"}</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {COLORS.map((item) => (
              <ColorSwatch key={item.name} color={item} selected={color === item.name} onClick={() => onColorChange(item.name)} />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
