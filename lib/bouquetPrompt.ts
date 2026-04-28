import type { BouquetSpec, FlowerItem } from "@/types/bouquet";

export function formatFlowersForPrompt(flowers: FlowerItem[]): string {
  return flowers
    .filter((flower) => flower.type && flower.count > 0)
    .map((flower) => {
      const color = flower.color ? `${flower.color.toLowerCase()} ` : "";
      const plural = flower.count === 1 ? flower.type.toLowerCase() : `${flower.type.toLowerCase()}s`;
      return `${flower.count} ${color}${plural}`;
    })
    .join(", ");
}

export function buildFloristTouchInstruction(floristTouch: boolean): string {
  if (!floristTouch) {
    return [
      "Follow the selected ingredients closely.",
      "Maintain approximate flower counts.",
      "Do not add extra flower types.",
      "Prioritize fidelity to the user's selections.",
    ].join(" ");
  }

  return [
    "Improve spacing, layering, bouquet balance, and wrapping presentation.",
    "Keep the selected ingredients while refining composition.",
    "Create a professional florist arrangement.",
    "Do not introduce unrelated flower types.",
  ].join(" ");
}

export function buildOccasionFragment(occasion?: string): string {
  const cleaned = occasion?.trim();
  return cleaned ? `, suitable for ${cleaned}` : "";
}

export function buildBouquetPrompt(spec: BouquetSpec): string {
  const flowerList = formatFlowersForPrompt(spec.flowers);
  const occasion = buildOccasionFragment(spec.style.occasion);
  const floristTouch = buildFloristTouchInstruction(spec.style.floristTouch);

  return [
    `Ingredients: ${flowerList}.`,
    `Arrangement style: ${spec.style.vibe.toLowerCase()} bouquet${occasion}.`,
    `Presentation details: ${spec.wrapper.color.toLowerCase()} ${spec.wrapper.material.toLowerCase()} wrapper and ${spec.bow.color.toLowerCase()} ${spec.bow.material.toLowerCase()} bow.`,
    "Realism and professional quality: create a realistic florist-quality hand-tied bouquet with balanced composition, thoughtful layering, realistic bouquet structure, elegant wrapping, natural lighting, and crisp detail.",
    `Constraints: ${floristTouch} Keep the image visually faithful to the selected flowers, flower colors, materials, and colors. Plain neutral studio background. Avoid fantasy, illustration, cartoon, collage, surreal, or painterly styling.`,
  ].join(" ");
}
