"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, Leaf } from "lucide-react";
import { BouquetSummaryCard } from "@/components/bouquet/BouquetSummaryCard";
import { FlowerSelectorSection } from "@/components/bouquet/FlowerSelectorSection";
import { GenerateButton } from "@/components/bouquet/GenerateButton";
import { PresentationSection } from "@/components/bouquet/PresentationSection";
import { ResultPanel } from "@/components/bouquet/ResultPanel";
import { SavedRecipesPanel } from "@/components/bouquet/SavedRecipesPanel";
import { StyleSection } from "@/components/bouquet/StyleSection";
import { Button } from "@/components/ui/button";
import { buildSummaryText } from "@/lib/bouquetSummary";
import { deleteRecipeFromStorage, loadSavedRecipes, saveRecipeToStorage } from "@/lib/storage";
import { isBouquetSpecValid } from "@/lib/validation";
import type { BouquetSpec, FlowerItem, GenerateBouquetResponse, SavedBouquetRecipe } from "@/types/bouquet";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createFlower(overrides?: Partial<FlowerItem>): FlowerItem {
  return {
    id: createId(),
    type: "Rose",
    count: 6,
    ...overrides,
  };
}

function createInitialSpec(): BouquetSpec {
  return {
    flowers: [createFlower({ color: "Blush pink" })],
    wrapper: {
      material: "Matte paper",
      color: "Cream",
    },
    bow: {
      material: "Satin",
      color: "Sage green",
    },
    style: {
      vibe: "Elegant",
      occasion: "",
      floristTouch: true,
    },
  };
}

export default function BouquetBuilderPage() {
  const [spec, setSpec] = useState<BouquetSpec>(() => createInitialSpec());
  const [generatedImage, setGeneratedImage] = useState<string>();
  const [savedRecipes, setSavedRecipes] = useState<SavedBouquetRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [savedNotice, setSavedNotice] = useState<string>();

  const valid = useMemo(() => isBouquetSpecValid(spec), [spec]);

  useEffect(() => {
    queueMicrotask(() => setSavedRecipes(loadSavedRecipes()));
  }, []);

  async function generateBouquet(modifier?: string) {
    if (!valid || loading) return;

    setLoading(true);
    setError(undefined);
    setSavedNotice(undefined);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec, modifier }),
      });

      const data = (await response.json()) as GenerateBouquetResponse | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Generation failed.");
      }

      setGeneratedImage(data.image);
      window.requestAnimationFrame(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function saveRecipe() {
    const recipe: SavedBouquetRecipe = {
      id: createId(),
      name: buildSummaryText(spec).split(".")[0],
      createdAt: new Date().toISOString(),
      spec,
      generatedImage,
    };

    setSavedRecipes(saveRecipeToStorage(recipe));
    setSavedNotice("Recipe saved locally.");
  }

  function loadRecipe(recipe: SavedBouquetRecipe) {
    setSpec(recipe.spec);
    setGeneratedImage(recipe.generatedImage);
    setError(undefined);
    setSavedNotice(`Loaded ${recipe.name}.`);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Leaf className="h-3.5 w-3.5" />
            Bouquet Atelier
          </div>
          <h1 className="font-serif text-5xl font-semibold tracking-normal text-foreground sm:text-6xl">
            Your flowers, professionally styled.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Choose ingredients, wrapping, and mood. The builder turns your structured selections into florist-quality bouquet inspiration.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SavedRecipesPanel
            recipes={savedRecipes}
            onSelect={loadRecipe}
            onDelete={(id) => setSavedRecipes(deleteRecipeFromStorage(id))}
          />
          <Button type="button" variant="secondary" onClick={() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" })}>
            <ArrowDown className="h-4 w-4" />
            Result
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
        <div className="space-y-6">
          <FlowerSelectorSection
            flowers={spec.flowers}
            createFlower={createFlower}
            onChange={(flowers) => setSpec((current) => ({ ...current, flowers }))}
          />
          <PresentationSection
            kind="wrapper"
            material={spec.wrapper.material}
            color={spec.wrapper.color}
            onMaterialChange={(material) => setSpec((current) => ({ ...current, wrapper: { ...current.wrapper, material } }))}
            onColorChange={(color) => setSpec((current) => ({ ...current, wrapper: { ...current.wrapper, color } }))}
          />
          <PresentationSection
            kind="bow"
            material={spec.bow.material}
            color={spec.bow.color}
            onMaterialChange={(material) => setSpec((current) => ({ ...current, bow: { ...current.bow, material } }))}
            onColorChange={(color) => setSpec((current) => ({ ...current, bow: { ...current.bow, color } }))}
          />
          <StyleSection
            vibe={spec.style.vibe}
            occasion={spec.style.occasion}
            floristTouch={spec.style.floristTouch}
            onVibeChange={(vibe) => setSpec((current) => ({ ...current, style: { ...current.style, vibe } }))}
            onOccasionChange={(occasion) => setSpec((current) => ({ ...current, style: { ...current.style, occasion } }))}
            onFloristTouchChange={(floristTouch) => setSpec((current) => ({ ...current, style: { ...current.style, floristTouch } }))}
          />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6">
          <BouquetSummaryCard spec={spec} />
          <div className="rounded-lg border bg-card p-4 shadow-soft">
            <GenerateButton disabled={!valid} loading={loading} onClick={() => generateBouquet()} />
            {savedNotice ? <p className="mt-3 text-sm text-muted-foreground">{savedNotice}</p> : null}
          </div>
          <ResultPanel
            image={generatedImage}
            loading={loading}
            error={error}
            onRegenerate={() => generateBouquet()}
            onSave={saveRecipe}
            onEdit={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onQuickAction={(modifier) => generateBouquet(modifier)}
          />
        </aside>
      </div>
    </main>
  );
}
