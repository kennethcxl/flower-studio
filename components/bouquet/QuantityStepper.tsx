import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantityStepper({ value, onChange }: QuantityStepperProps) {
  return (
    <div className="flex h-10 items-center rounded-md border bg-white">
      <Button
        type="button"
        aria-label="Decrease quantity"
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <Button
        type="button"
        aria-label="Increase quantity"
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => onChange(Math.min(24, value + 1))}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
