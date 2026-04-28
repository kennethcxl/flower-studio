export type FlowerItem = {
  id: string;
  type: string;
  count: number;
  color?: string;
};

export type BouquetSpec = {
  flowers: FlowerItem[];
  wrapper: {
    material: string;
    color: string;
  };
  bow: {
    material: string;
    color: string;
  };
  style: {
    vibe: string;
    occasion?: string;
    floristTouch: boolean;
  };
};

export type SavedBouquetRecipe = {
  id: string;
  name: string;
  createdAt: string;
  spec: BouquetSpec;
  generatedImage?: string;
};

export type GenerateBouquetResponse = {
  image: string;
  prompt: string;
  provider: "mock" | "image-provider";
};
