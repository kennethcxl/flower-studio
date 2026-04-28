"use client";

import { Loader2, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type GenerateButtonProps = {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
};

export function GenerateButton({ disabled, loading, onClick }: GenerateButtonProps) {
  return (
    <Button type="button" size="lg" className="w-full sm:w-auto" disabled={disabled || loading} onClick={onClick}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
      {loading ? "Generating bouquet" : "Generate bouquet"}
    </Button>
  );
}
