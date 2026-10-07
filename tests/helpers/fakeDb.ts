import { vi } from "vitest";

type Result = { data: unknown; error: { message: string } | null };
type Call = [method: string, args: unknown[]];

export interface FakeDb {
  client: {
    from: (table: string) => unknown;
    storage: { from: (bucket: string) => unknown };
  };
  calls: Call[];
  uploads: { bucket: string; path: string; opts: Record<string, unknown> }[];
}

/**
 * Stand-in for the Supabase service-role client. The query builder is thenable
 * so both `await q.select()` and `await q.maybeSingle()` resolve to `result`.
 */
export function makeFakeDb(
  result: Result = { data: null, error: null },
  uploadResult: { data: unknown; error: { message: string } | null } = {
    data: { path: "ok" },
    error: null,
  }
): FakeDb {
  const calls: Call[] = [];
  const uploads: FakeDb["uploads"] = [];

  const builder: Record<string, unknown> = {};
  for (const m of ["select", "eq", "order", "update", "insert", "maybeSingle", "single"]) {
    builder[m] = (...args: unknown[]) => {
      calls.push([m, args]);
      return builder;
    };
  }
  builder.then = (resolve: (r: Result) => unknown) => resolve(result);

  return {
    calls,
    uploads,
    client: {
      from: (table: string) => {
        calls.push(["from", [table]]);
        return builder;
      },
      storage: {
        from: (bucket: string) => ({
          upload: vi.fn(async (path: string, _body: unknown, opts: Record<string, unknown>) => {
            uploads.push({ bucket, path, opts });
            return uploadResult;
          }),
          getPublicUrl: (path: string) => ({
            data: { publicUrl: `https://x.supabase.co/storage/v1/object/public/${bucket}/${path}` },
          }),
        }),
      },
    },
  };
}
