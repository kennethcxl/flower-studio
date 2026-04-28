import { NextResponse } from "next/server";
import { runAlphaBouquetWorkflow } from "@/lib/alphaWorkflow";
import { buildBouquetPrompt } from "@/lib/bouquetPrompt";
import { isBouquetSpecValid } from "@/lib/validation";
import type { BouquetSpec, GenerateBouquetResponse } from "@/types/bouquet";

type GenerateRequest = {
  spec: BouquetSpec;
  modifier?: string;
};

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function createMockBouquetImage(spec: BouquetSpec, modifier?: string) {
  const flowers = spec.flowers.filter((flower) => flower.type && flower.count > 0);
  const title = `${spec.style.vibe} bouquet`;
  const flowerText = flowers.map((flower) => `${flower.count} ${flower.color ?? ""} ${flower.type}`.trim()).join(" • ");
  const modifierText = modifier ? `Refinement: ${modifier}` : "Florist inspiration mock";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f7f2ea"/>
          <stop offset="100%" stop-color="#e9ded1"/>
        </linearGradient>
        <radialGradient id="petal" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#fff8f5"/>
          <stop offset="100%" stop-color="#d8899a"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <ellipse cx="600" cy="735" rx="310" ry="48" fill="#9b8c7b" opacity="0.18"/>
      <g transform="translate(600 410)">
        <path d="M-210 90 C-145 275, 150 275, 215 90 L135 360 C80 410,-85 410,-135 360 Z" fill="#d9c5b2"/>
        <path d="M-190 120 C-80 180, 82 180, 190 120 L125 338 C62 370,-64 370,-125 338 Z" fill="#f3eadf"/>
        <path d="M-95 372 C-38 398, 40 398, 96 372" stroke="#42624d" stroke-width="22" stroke-linecap="round"/>
        <path d="M-142 385 C-58 342, 55 342, 142 385" stroke="#8b4e55" stroke-width="18" stroke-linecap="round"/>
        ${flowers
          .slice(0, 8)
          .map((flower, index) => {
            const angle = (index / Math.max(flowers.length, 1)) * Math.PI * 2;
            const radius = 75 + (index % 3) * 42;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.55 - 45 - (index % 2) * 20;
            const scale = 0.9 + Math.min(flower.count, 12) / 26;
            return `
              <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(2)})">
                <line x1="0" y1="62" x2="${(-x / 2).toFixed(1)}" y2="265" stroke="#5d7b61" stroke-width="7" stroke-linecap="round"/>
                <circle cx="0" cy="0" r="50" fill="url(#petal)"/>
                <circle cx="-30" cy="-10" r="28" fill="#f3c0c6" opacity="0.88"/>
                <circle cx="30" cy="-8" r="28" fill="#e9a5b3" opacity="0.88"/>
                <circle cx="0" cy="-32" r="26" fill="#f7d1d5" opacity="0.92"/>
                <circle cx="0" cy="0" r="16" fill="#c98963"/>
              </g>
            `;
          })
          .join("")}
      </g>
      <text x="600" y="95" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="#2f2a24">${title}</text>
      <text x="600" y="143" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#6b5e52">${modifierText}</text>
      <text x="600" y="820" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#4d473f">${flowerText}</text>
      <text x="600" y="855" text-anchor="middle" font-family="Arial, sans-serif" font-size="19" fill="#776b60">${spec.wrapper.color} ${spec.wrapper.material} wrapper • ${spec.bow.color} ${spec.bow.material} bow</text>
    </svg>
  `;

  return svgToDataUrl(svg);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.spec || !isBouquetSpecValid(body.spec)) {
      return NextResponse.json({ error: "Bouquet spec is incomplete." }, { status: 400 });
    }

    const basePrompt = buildBouquetPrompt(body.spec);
    const prompt = body.modifier ? `${basePrompt} Additional refinement: ${body.modifier}.` : basePrompt;
    const alphaResult = await runAlphaBouquetWorkflow(body.spec);

    if (alphaResult) {
      const response: GenerateBouquetResponse = {
        image: alphaResult.image,
        prompt,
        provider: "image-provider",
      };

      return NextResponse.json(response);
    }

    // Fallback when no provider key is configured.
    const response: GenerateBouquetResponse = {
      image: createMockBouquetImage(body.spec, body.modifier),
      prompt,
      provider: "mock",
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Unable to generate bouquet." }, { status: 500 });
  }
}
