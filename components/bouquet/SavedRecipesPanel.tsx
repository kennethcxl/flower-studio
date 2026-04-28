"use client";

import { BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buildSummaryText } from "@/lib/bouquetSummary";
import type { SavedBouquetRecipe } from "@/types/bouquet";

type SavedRecipesPanelProps = {
  recipes: SavedBouquetRecipe[];
  onSelect: (recipe: SavedBouquetRecipe) => void;
  onDelete: (id: string) => void;
};

export function SavedRecipesPanel({ recipes, onSelect, onDelete }: SavedRecipesPanelProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <BookOpen className="h-4 w-4" />
          Saved recipes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saved recipes</DialogTitle>
          <DialogDescription>Load a past bouquet back into the builder.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {recipes.length === 0 ? (
            <p className="rounded-lg border bg-muted/45 p-4 text-sm text-muted-foreground">No saved bouquets yet.</p>
          ) : (
            recipes.map((recipe) => (
              <article key={recipe.id} className="rounded-lg border bg-white/70 p-4">
                <div className="flex gap-4">
                  {recipe.generatedImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={recipe.generatedImage} alt="" className="h-20 w-20 rounded-md object-cover" />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{recipe.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(recipe.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{buildSummaryText(recipe.spec)}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button type="button" size="sm" onClick={() => onSelect(recipe)}>
                    Load
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => onDelete(recipe.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
