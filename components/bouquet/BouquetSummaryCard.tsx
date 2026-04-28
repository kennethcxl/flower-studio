"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildSummaryText } from "@/lib/bouquetSummary";
import { getBouquetValidationErrors } from "@/lib/validation";
import type { BouquetSpec } from "@/types/bouquet";

type BouquetSummaryCardProps = {
  spec: BouquetSpec;
};

export function BouquetSummaryCard({ spec }: BouquetSummaryCardProps) {
  const errors = getBouquetValidationErrors(spec);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            5
          </span>
          <div>
            <CardTitle>Review</CardTitle>
            <CardDescription>A concise check before the image is generated.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="rounded-lg bg-muted/55 p-4 text-sm leading-6">{buildSummaryText(spec)}</p>
        {errors.length > 0 ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4" />
              Required before generation
            </div>
            <ul className="space-y-1">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
