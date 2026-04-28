export const FLOWER_TYPES = [
  "Rose",
  "Tulip",
  "Lily",
  "Baby's breath",
  "Carnation",
  "Sunflower",
  "Peony",
  "Hydrangea",
] as const;

export const WRAPPER_MATERIALS = ["Matte paper", "Kraft paper", "Tissue", "Mesh"] as const;

export const BOW_MATERIALS = ["Satin", "Organza", "Twine", "Velvet"] as const;

export const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Cream", value: "#f6eddc" },
  { name: "Blush pink", value: "#f4c7c9" },
  { name: "Pink", value: "#ea8fb2" },
  { name: "Red", value: "#b6403f" },
  { name: "Lavender", value: "#bda8da" },
  { name: "Yellow", value: "#f4d35e" },
  { name: "Peach", value: "#f1ab82" },
  { name: "Blue", value: "#7ea2c9" },
  { name: "Sage green", value: "#9cad8f" },
  { name: "Black", value: "#242321" },
  { name: "Brown", value: "#8a6449" },
] as const;

export const FLOWER_COLOR_NAMES_BY_TYPE = {
  Rose: ["White", "Cream", "Blush pink", "Pink", "Red", "Lavender", "Yellow", "Peach"],
  Tulip: ["White", "Cream", "Pink", "Red", "Lavender", "Yellow", "Peach"],
  Lily: ["White", "Cream", "Blush pink", "Pink", "Yellow"],
  "Baby's breath": ["White", "Cream"],
  Carnation: ["White", "Cream", "Blush pink", "Pink", "Red", "Lavender", "Yellow", "Peach"],
  Sunflower: ["Yellow", "Cream", "Brown"],
  Peony: ["White", "Cream", "Blush pink", "Pink", "Red", "Lavender", "Peach"],
  Hydrangea: ["White", "Cream", "Pink", "Lavender", "Blue", "Sage green"],
} satisfies Record<(typeof FLOWER_TYPES)[number], readonly (typeof COLORS)[number]["name"][]>;

export function getFlowerColorOptions(type: string) {
  const colorNames = FLOWER_COLOR_NAMES_BY_TYPE[type as keyof typeof FLOWER_COLOR_NAMES_BY_TYPE] as readonly string[] | undefined;

  if (!colorNames) return COLORS;

  return COLORS.filter((color) => colorNames.includes(color.name));
}

export const VIBES = ["Romantic", "Cheerful", "Elegant", "Soft", "Rustic", "Grand", "Modern"] as const;

export const DEFAULT_OCCASIONS = ["Birthday", "Anniversary", "Thank you", "Wedding", "Just because"] as const;
