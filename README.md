# Bouquet Atelier

Minimal MVP web app for generating florist-styled bouquet inspiration from structured bouquet specs.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- Local storage for saved recipes
- Server route abstraction for image generation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Alpha Intelligence Workflow

The app is wired for the Alpha Intelligence workflow exported in `Flowers - Alpha Intelligence.mhtml`.

Create `.env.local`:

```bash
ALPHA_API_KEY=your_api_key_here
ALPHA_WORKFLOW_ID=20177
ALPHA_API_BASE_URL=https://ai.insea.io
```

The server route posts to:

```text
POST https://ai.insea.io/api/workflows/20177/run
Authorization: Bearer <ALPHA_API_KEY>
Content-Type: application/json
```

The request body maps the app inputs into the workflow's required `bouquet_spec` input. It intentionally matches the Alpha schema exactly:

```json
{
  "bouquet_spec": {
    "bow": { "material": "Satin", "color": "Sage green" },
    "flowers": [{ "id": "1", "type": "Rose", "count": 6, "color": "Blush pink" }],
    "style": { "vibe": "Elegant", "occasion": "Anniversary" },
    "wrapper": { "material": "Matte paper", "color": "Cream" }
  }
}
```

The app still builds and displays its deterministic local prompt, but `prompt`, `modifier`, and `floristTouch` are not sent to Alpha because they are not present in the provided workflow input schema.

If `ALPHA_API_KEY` is not present, the app falls back to the built-in mock image generator.

## Key Files

- `types/bouquet.ts` defines the core domain types.
- `lib/constants.ts` contains sample flowers, materials, colors, and vibes.
- `lib/bouquetPrompt.ts` builds deterministic image prompts.
- `lib/validation.ts` validates the MVP spec before generation.
- `lib/storage.ts` handles local saved bouquet recipes.
- `app/api/generate/route.ts` is the swappable generation endpoint.
- `app/page.tsx` contains the single-page bouquet builder flow.

## Prompt Behavior

`Florist touch` changes only arrangement flexibility.

- Off: follows selected ingredients closely, maintains approximate counts, and forbids extra flower types.
- On: improves spacing, layering, balance, and wrapping while keeping the selected ingredients.

The MVP does not automatically add new flower types.
