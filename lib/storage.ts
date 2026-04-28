"use client";

import type { SavedBouquetRecipe } from "@/types/bouquet";

const STORAGE_KEY = "bouquet-atelier-recipes";

export function loadSavedRecipes(): SavedBouquetRecipe[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecipeToStorage(recipe: SavedBouquetRecipe): SavedBouquetRecipe[] {
  const recipes = [recipe, ...loadSavedRecipes()].slice(0, 18);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return recipes;
}

export function deleteRecipeFromStorage(id: string): SavedBouquetRecipe[] {
  const recipes = loadSavedRecipes().filter((recipe) => recipe.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return recipes;
}
