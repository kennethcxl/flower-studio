import type { BouquetSpec } from "@/types/bouquet";

export function getBouquetValidationErrors(spec: BouquetSpec): string[] {
  const errors: string[] = [];
  const validFlowers = spec.flowers.filter((flower) => flower.type && flower.count > 0);

  if (validFlowers.length === 0) errors.push("Add at least one flower.");
  if (!spec.wrapper.material) errors.push("Choose a wrapper material.");
  if (!spec.wrapper.color) errors.push("Choose a wrapper color.");
  if (!spec.bow.material) errors.push("Choose a bow material.");
  if (!spec.bow.color) errors.push("Choose a bow color.");
  if (!spec.style.vibe) errors.push("Choose a bouquet style.");

  return errors;
}

export function isBouquetSpecValid(spec: BouquetSpec): boolean {
  return getBouquetValidationErrors(spec).length === 0;
}
