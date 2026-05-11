"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Leaf, Sparkles } from "lucide-react";
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

const STEPS = [
  {
    title: "Flowers",
    eyebrow: "Ingredients",
    description: "Pick the blooms and quantities.",
  },
  {
    title: "Wrap",
    eyebrow: "Presentation",
    description: "Choose the material and color.",
  },
  {
    title: "Bow",
    eyebrow: "Finishing",
    description: "Set the ribbon detail.",
  },
  {
    title: "Mood",
    eyebrow: "Styling",
    description: "Tune the occasion and vibe.",
  },
  {
    title: "Review",
    eyebrow: "Generate",
    description: "Check the recipe and create.",
  },
] as const;

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
  const [activeStep, setActiveStep] = useState(0);
  const [spec, setSpec] = useState<BouquetSpec>(() => createInitialSpec());
  const [generatedImage, setGeneratedImage] = useState<string>();
  const [savedRecipes, setSavedRecipes] = useState<SavedBouquetRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [savedNotice, setSavedNotice] = useState<string>();

  const valid = useMemo(() => isBouquetSpecValid(spec), [spec]);
  const isLastStep = activeStep === STEPS.length - 1;
  const canGoBack = activeStep > 0;
  const canGoNext = activeStep < STEPS.length - 1;

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
    goToStep(0);
  }

  function goToStep(step: number) {
    setActiveStep(step);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function renderStep() {
    if (activeStep === 0) {
      return (
        <FlowerSelectorSection
          flowers={spec.flowers}
          createFlower={createFlower}
          onChange={(flowers) => setSpec((current) => ({ ...current, flowers }))}
        />
      );
    }

    if (activeStep === 1) {
      return (
        <PresentationSection
          kind="wrapper"
          material={spec.wrapper.material}
          color={spec.wrapper.color}
          onMaterialChange={(material) => setSpec((current) => ({ ...current, wrapper: { ...current.wrapper, material } }))}
          onColorChange={(color) => setSpec((current) => ({ ...current, wrapper: { ...current.wrapper, color } }))}
        />
      );
    }

    if (activeStep === 2) {
      return (
        <PresentationSection
          kind="bow"
          material={spec.bow.material}
          color={spec.bow.color}
          onMaterialChange={(material) => setSpec((current) => ({ ...current, bow: { ...current.bow, material } }))}
          onColorChange={(color) => setSpec((current) => ({ ...current, bow: { ...current.bow, color } }))}
        />
      );
    }

    if (activeStep === 3) {
      return (
        <StyleSection
          vibe={spec.style.vibe}
          occasion={spec.style.occasion}
          floristTouch={spec.style.floristTouch}
          onVibeChange={(vibe) => setSpec((current) => ({ ...current, style: { ...current.style, vibe } }))}
          onOccasionChange={(occasion) => setSpec((current) => ({ ...current, style: { ...current.style, occasion } }))}
          onFloristTouchChange={(floristTouch) => setSpec((current) => ({ ...current, style: { ...current.style, floristTouch } }))}
        />
      );
    }

    return (
      <div className="space-y-6">
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
          onEdit={() => goToStep(0)}
          onQuickAction={(modifier) => generateBouquet(modifier)}
        />
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-lg border bg-white/55 p-4 shadow-soft sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Leaf className="h-3.5 w-3.5" />
              Bouquet Atelier
            </div>
            <h1 className="font-serif text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
              Build a bouquet, one detail at a time.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              A guided studio for choosing blooms, wrapping, finishing details, and florist styling before generating the final inspiration.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SavedRecipesPanel
              recipes={savedRecipes}
              onSelect={loadRecipe}
              onDelete={(id) => setSavedRecipes(deleteRecipeFromStorage(id))}
            />
            <Button type="button" variant="secondary" onClick={() => goToStep(STEPS.length - 1)}>
              <Sparkles className="h-4 w-4" />
              Review
            </Button>
          </div>
        </div>

        <nav aria-label="Bouquet builder steps" className="mt-6 grid gap-2 sm:grid-cols-5">
          {STEPS.map((step, index) => {
            const selected = activeStep === index;
            const complete = activeStep > index;

            return (
              <button
                key={step.title}
                type="button"
                onClick={() => goToStep(index)}
                className={[
                  "min-h-[5.75rem] rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected ? "border-primary bg-primary text-primary-foreground shadow-soft" : "bg-white/70 hover:border-primary/50 hover:bg-white",
                ].join(" ")}
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={[
                      "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold",
                      selected ? "bg-white/20" : complete ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                    ].join(" ")}
                  >
                    {complete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className={selected ? "text-xs opacity-80" : "text-xs text-muted-foreground"}>{step.eyebrow}</span>
                </span>
                <span className="mt-3 block text-sm font-semibold">{step.title}</span>
                <span className={selected ? "mt-1 block text-xs leading-5 opacity-80" : "mt-1 block text-xs leading-5 text-muted-foreground"}>
                  {step.description}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Step {activeStep + 1} of {STEPS.length}
              </p>
              <h2 className="font-serif text-3xl font-semibold">{STEPS[activeStep].title}</h2>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Button type="button" variant="outline" onClick={() => goToStep(activeStep - 1)} disabled={!canGoBack}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {canGoNext ? (
                <Button type="button" onClick={() => goToStep(activeStep + 1)}>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>

          {renderStep()}

          <div className="flex items-center justify-between gap-3 sm:hidden">
            <Button type="button" variant="outline" onClick={() => goToStep(activeStep - 1)} disabled={!canGoBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {canGoNext ? (
              <Button type="button" onClick={() => goToStep(activeStep + 1)}>
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="rounded-lg border bg-card p-4 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Studio progress</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {isLastStep ? "Ready for the final check." : `Next up: ${STEPS[activeStep + 1].title.toLowerCase()}.`}
            </p>
          </div>

          {isLastStep ? null : (
            <>
              <BouquetSummaryCard spec={spec} />
              <div className="rounded-lg border bg-card p-4 shadow-soft">
                <Button type="button" className="w-full" onClick={() => goToStep(STEPS.length - 1)}>
                  <Sparkles className="h-4 w-4" />
                  Review and generate
                </Button>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
