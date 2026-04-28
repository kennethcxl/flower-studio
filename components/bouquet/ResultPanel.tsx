"use client";

import { Download, Edit3, RefreshCw, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ResultPanelProps = {
  image?: string;
  loading: boolean;
  error?: string;
  onRegenerate: () => void;
  onSave: () => void;
  onEdit: () => void;
  onQuickAction: (modifier: string) => void;
};

export function ResultPanel({
  image,
  loading,
  error,
  onRegenerate,
  onSave,
  onEdit,
  onQuickAction,
}: ResultPanelProps) {
  return (
    <Card id="result">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            6
          </span>
          <div>
            <CardTitle>Generated result</CardTitle>
            <CardDescription>Your flowers, professionally styled.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-lg border bg-muted">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Generated bouquet" className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center p-8 text-center">
              <div>
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {loading ? "Arranging your bouquet..." : "Your generated bouquet will appear here."}
                </p>
                {loading ? <p className="mt-2 text-xs text-muted-foreground">This usually takes a few seconds.</p> : null}
              </div>
            </div>
          )}
        </div>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}

        {image ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button type="button" className="w-full" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button type="button" className="w-full" variant="outline" onClick={onEdit}>
              <Edit3 className="h-4 w-4" />
              Edit details
            </Button>
            <Button type="button" className="w-full" variant="secondary" onClick={onSave}>
              <Save className="h-4 w-4" />
              Save recipe
            </Button>
            <Button asChild className="w-full" variant="outline">
              <a href={image} download="bouquet-inspiration.png">
                <Download className="h-4 w-4" />
                Download photo
              </a>
            </Button>
          </div>
        ) : null}

        {image ? (
          <div className="flex flex-wrap gap-2">
            {["Make it fuller", "Make it neater", "Make it more premium"].map((item) => (
              <Button key={item} type="button" variant="ghost" size="sm" onClick={() => onQuickAction(item)} disabled={loading}>
                {item}
              </Button>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
