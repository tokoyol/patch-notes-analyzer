export type DistributionItem = {
  champion: string;
  value: number;
  buffs: number;
  nerfs: number;
};

export type PatchDistribution = {
  version: string;
  metric: "impact_score";
  items: DistributionItem[];
};

function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://127.0.0.1:8000"
  );
}

export async function getPatchDistribution(
  version: string,
): Promise<PatchDistribution> {
  const response = await fetch(`${getApiBaseUrl()}/patch/${version}/distribution`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load distribution (${response.status})`);
  }

  return (await response.json()) as PatchDistribution;
}

