import type { BouquetSpec } from "@/types/bouquet";

export type AlphaBouquetSpecPayload = {
  bow: BouquetSpec["bow"];
  flowers: Array<{
    color?: string;
    count: number;
    id: string;
    type: string;
  }>;
  style: {
    occasion?: string;
    vibe: string;
  };
  wrapper: BouquetSpec["wrapper"];
};

type AlphaFileLike =
  | string
  | {
      id?: string;
      file_id?: string;
      fileId?: string;
      url?: string;
      file_url?: string;
      download_url?: string;
      signed_url?: string;
      preview_url?: string;
      mime_type?: string;
      mimeType?: string;
    };

type AlphaWorkflowResponse = {
  request_id?: string;
  data?: {
    status?: string;
    outputs?: {
      images?: AlphaFileLike[];
    };
  };
};

export function buildAlphaBouquetSpecPayload(
  spec: BouquetSpec,
): AlphaBouquetSpecPayload {
  return {
    bow: {
      color: spec.bow.color,
      material: spec.bow.material,
    },
    flowers: spec.flowers
      .filter((flower) => flower.type && flower.count > 0)
      .map(({ color, count, id, type }) => ({ color, count, id, type })),
    style: {
      occasion: spec.style.occasion?.trim() || undefined,
      vibe: spec.style.vibe,
    },
    wrapper: {
      color: spec.wrapper.color,
      material: spec.wrapper.material,
    },
  };
}

function getAlphaConfig() {
  const apiKey = process.env.ALPHA_API_KEY || process.env.IMAGE_PROVIDER_API_KEY;
  const workflowId = process.env.ALPHA_WORKFLOW_ID || "20177";
  const baseUrl = process.env.ALPHA_API_BASE_URL || "https://ai.insea.io";

  return { apiKey, workflowId, baseUrl };
}

function getFirstImageFile(response: AlphaWorkflowResponse): AlphaFileLike | undefined {
  return response.data?.outputs?.images?.[0];
}

function getDirectImageUrl(file: AlphaFileLike | undefined): string | undefined {
  if (!file) return undefined;
  if (typeof file === "string") return file.startsWith("http") || file.startsWith("data:") ? file : undefined;

  return file.url || file.file_url || file.download_url || file.signed_url || file.preview_url;
}

function getFileId(file: AlphaFileLike | undefined): string | undefined {
  if (!file || typeof file === "string") return undefined;
  return file.id || file.file_id || file.fileId;
}

async function fetchAlphaFileAsDataUrl(baseUrl: string, apiKey: string, fileId: string) {
  const response = await fetch(`${baseUrl}/api/files?id=${encodeURIComponent(fileId)}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Alpha file fetch failed with status ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return `data:${contentType};base64,${base64}`;
}

export async function runAlphaBouquetWorkflow(spec: BouquetSpec) {
  const { apiKey, workflowId, baseUrl } = getAlphaConfig();

  if (!apiKey) {
    return undefined;
  }

  const response = await fetch(`${baseUrl}/api/workflows/${workflowId}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bouquet_spec: buildAlphaBouquetSpecPayload(spec),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Alpha workflow failed with status ${response.status}.${detail ? ` ${detail}` : ""}`);
  }

  const data = (await response.json()) as AlphaWorkflowResponse;
  const firstImage = getFirstImageFile(data);
  const directUrl = getDirectImageUrl(firstImage);

  if (directUrl) {
    return {
      image: directUrl,
      requestId: data.request_id,
      raw: data,
    };
  }

  const fileId = getFileId(firstImage);

  if (fileId) {
    return {
      image: await fetchAlphaFileAsDataUrl(baseUrl, apiKey, fileId),
      requestId: data.request_id,
      raw: data,
    };
  }

  throw new Error("Alpha workflow completed without an image output.");
}
