"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FlowerItem } from "@/types/bouquet";
import { FlowerRow } from "./FlowerRow";
import { SectionShell } from "./SectionShell";

type FlowerSelectorSectionProps = {
  flowers: FlowerItem[];
  onChange: (flowers: FlowerItem[]) => void;
  createFlower: () => FlowerItem;
};

export function FlowerSelectorSection({ flowers, onChange, createFlower }: FlowerSelectorSectionProps) {
  return (
    <SectionShell index="1" title="Flowers" description="Pick the ingredients and rough counts for your bouquet.">
      <div className="space-y-4">
        {flowers.map((flower) => (
          <FlowerRow
            key={flower.id}
            flower={flower}
            canRemove={flowers.length > 1}
            onChange={(next) => onChange(flowers.map((item) => (item.id === flower.id ? next : item)))}
            onRemove={() => onChange(flowers.filter((item) => item.id !== flower.id))}
          />
        ))}
        <Button type="button" variant="outline" onClick={() => onChange([...flowers, createFlower()])}>
          <Plus className="h-4 w-4" />
          Add flower
        </Button>
      </div>
    </SectionShell>
  );
}
