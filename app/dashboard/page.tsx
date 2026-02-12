import Link from "next/link";

type PatchListItem = {
  version: string;
  release_date: string;
  is_test: boolean;
  note: string | null;
};

type PatchListResponse = {
  patches: PatchListItem[];
};

async function getPatchList(): Promise<PatchListItem[]> {
  const apiBaseUrl =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://127.0.0.1:8000";
  const response = await fetch(`${apiBaseUrl}/patch/list`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load patch list (${response.status})`);
  }
  const data = (await response.json()) as PatchListResponse;
  return data.patches;
}

export default async function Page() {
  try {
    const patches = await getPatchList();
    return (
      <main className="mx-auto max-w-3xl space-y-4 p-6">
        <h1 className="text-2xl font-bold">Patch Dashboard</h1>
        <p className="text-sm text-zinc-600">
          Select a patch to view notes, ranking, and impact distribution.
        </p>

        <section className="space-y-3">
          {patches.length === 0 ? (
            <p>No patches available yet.</p>
          ) : (
            patches.map((patch) => (
              <div key={patch.version} className="rounded-md border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Patch {patch.version}</p>
                    <p className="text-sm text-zinc-600">
                      Release Date: {patch.release_date}
                    </p>
                  </div>
                  <Link
                    href={`/patch/${patch.version}`}
                    className="rounded border px-3 py-1 text-sm hover:bg-zinc-100"
                  >
                    Open
                  </Link>
                </div>
                {patch.is_test ? (
                  <p className="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">
                    {patch.note}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </section>
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error occurred.";
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Patch Dashboard</h1>
        <p className="mt-3 text-red-600">Could not load patch list. {message}</p>
      </main>
    );
  }
}

