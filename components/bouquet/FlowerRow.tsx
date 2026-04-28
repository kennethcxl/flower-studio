"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FLOWER_TYPES, getFlowerColorOptions } from "@/lib/constants";
import type { FlowerItem } from "@/types/bouquet";
import { ColorSwatch } from "./ColorSwatch";
import { OptionChip } from "./OptionChip";
import { QuantityStepper } from "./QuantityStepper";

type FlowerRowProps = {
  flower: FlowerItem;
  canRemove: boolean;
  onChange: (flower: FlowerItem) => void;
  onRemove: () => void;
};

export function FlowerRow({ flower, canRemove, onChange, onRemove }: FlowerRowProps) {
  const colorOptions = getFlowerColorOptions(flower.type);

  function selectFlowerType(type: string) {
    const nextColorOptions = getFlowerColorOptions(type);
    const colorStillApplies = flower.color ? nextColorOptions.some((color) => color.name === flower.color) : false;

    onChange({
      ...flower,
      type,
      color: colorStillApplies ? flower.color : undefined,
    });
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Label>Flower</Label>
          <p className="text-xs text-muted-foreground">Choose type, amount, and color.</p>
        </div>
        <div className="flex items-center gap-2">
          <QuantityStepper value={flower.count} onChange={(count) => onChange({ ...flower, count })} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove flower"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FLOWER_TYPES.map((type) => (
          <OptionChip key={type} label={type} selected={flower.type === type} onClick={() => selectFlowerType(type)} />
        ))}
      </div>

      <div>
        <Label>Optional color</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          <OptionChip label="Any natural shade" selected={!flower.color} onClick={() => onChange({ ...flower, color: undefined })} />
          {colorOptions.map((color) => (
            <ColorSwatch
              key={color.name}
              color={color}
              selected={flower.color === color.name}
              onClick={() => onChange({ ...flower, color: color.name })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
