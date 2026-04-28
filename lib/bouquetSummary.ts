import type { BouquetSpec } from "@/types/bouquet";

export function buildSummaryText(spec: BouquetSpec): string {
  const flowers = spec.flowers
    .filter((flower) => flower.type && flower.count > 0)
    .map((flower) => `${flower.count} ${flower.color ? `${flower.color} ` : ""}${flower.type}`)
    .join(", ");

  const occasion = spec.style.occasion?.trim() ? ` for ${spec.style.occasion.trim()}` : "";
  const touch = spec.style.floristTouch ? "with florist touch" : "precise to your selected ingredients";

  return `${flowers || "No flowers selected"} in ${spec.wrapper.color || "unselected"} ${spec.wrapper.material || "wrapper"} with a ${spec.bow.color || "unselected"} ${spec.bow.material || "bow"} bow. ${spec.style.vibe || "Unselected"}${occasion}, ${touch}.`;
}
