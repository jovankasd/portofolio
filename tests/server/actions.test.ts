import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeFakeDb, type FakeDb } from "../helpers/fakeDb";

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  verifyAdminSession: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/server/db/server", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("@/server/auth/session", () => ({ verifyAdminSession: mocks.verifyAdminSession }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { getAllPages, getPageBySlug } from "@/server/db/queries";
import { updatePageAction } from "@/server/actions/pages.actions";
import { uploadAsset } from "@/server/actions/storage.actions";

const MB = 1024 * 1024;
const ascii = (s: string) => new TextEncoder().encode(s);
const PDF = ascii("%PDF-1.7\n%âãÏÓ\n");
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
const WEBP = new Uint8Array(12);
WEBP.set(ascii("RIFF"), 0);
WEBP.set(ascii("WEBP"), 8);
const EXE = ascii("MZ\x90\x00\x03\x00\x00\x00");

function upload(file: File, kind: string = "cv") {
  const fd = new FormData();
  fd.set("file", file);
  fd.set("kind", kind);
  return uploadAsset(fd);
}

let db: FakeDb;
function useDb(result?: Parameters<typeof makeFakeDb>[0], uploadResult?: Parameters<typeof makeFakeDb>[1]) {
  db = makeFakeDb(result, uploadResult);
  mocks.createServerClient.mockReturnValue(db.client);
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.verifyAdminSession.mockResolvedValue(true);
  useDb();
});

describe("getPageBySlug / getAllPages", () => {
  test("mengembalikan null untuk slug yang tidak ada", async () => {
    useDb({ data: null, error: null });
    expect(await getPageBySlug("invalid-slug")).toBeNull();
  });

  test("hanya meminta halaman terbit dengan slug yang diminta", async () => {
    await getPageBySlug("beranda");
    const eqs = db.calls.filter(([m]) => m === "eq").map(([, a]) => a);
    expect(eqs).toContainEqual(["slug", "beranda"]);
    expect(eqs).toContainEqual(["is_published", true]);
  });

  test("mengembalikan null, bukan melempar, saat klien database gagal dibuat", async () => {
    mocks.createServerClient.mockImplementation(() => {
      throw new Error("Missing Supabase server env vars");
    });
    await expect(getPageBySlug("beranda")).resolves.toBeNull();
  });

  test("getAllPages mengembalikan [] saat query error dan tidak menyaring is_published", async () => {
    useDb({ data: null, error: { message: "boom" } });
    expect(await getAllPages()).toEqual([]);
    expect(db.calls.some(([m, a]) => m === "eq" && a[0] === "is_published")).toBe(false);
  });
});

describe("updatePageAction", () => {
  test("menolak tanpa sesi admin dan tidak menyentuh database", async () => {
    mocks.verifyAdminSession.mockResolvedValue(false);
    const res = await updatePageAction("beranda", { title: "Beranda" });
    expect(res).toEqual({ data: null, error: "Unauthorized" });
    expect(mocks.createServerClient).not.toHaveBeenCalled();
  });

  test("memperbarui baris sesuai slug, mengisi updated_at, dan me-revalidate beranda", async () => {
    const row = { id: "u1", slug: "beranda", title: "Baru" };
    useDb({ data: row, error: null });
    const res = await updatePageAction("beranda", {
      title: "Baru",
      metadata: { hero_name: "Nama Baru" },
    });
    expect(res).toEqual({ data: row, error: null });
    const update = db.calls.find(([m]) => m === "update");
    expect(update?.[1][0]).toMatchObject({
      title: "Baru",
      metadata: { hero_name: "Nama Baru" },
      updated_at: expect.any(String),
    });
    expect(db.calls).toContainEqual(["eq", ["slug", "beranda"]]);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
  });

  test("menolak judul kosong tanpa menulis ke database", async () => {
    const res = await updatePageAction("beranda", { title: "" });
    expect(res.data).toBeNull();
    expect(res.error).toBeTruthy();
    expect(mocks.createServerClient).not.toHaveBeenCalled();
  });
});

describe("uploadAsset", () => {
  test("menolak tanpa sesi admin dan tidak mengunggah", async () => {
    mocks.verifyAdminSession.mockResolvedValue(false);
    const res = await upload(new File([PDF], "cv.pdf", { type: "application/pdf" }));
    expect(res).toEqual({ url: "", error: "Unauthorized" });
    expect(db.uploads).toHaveLength(0);
  });

  test("menolak MIME executable untuk CV", async () => {
    const res = await upload(new File([EXE], "cv.pdf", { type: "application/x-msdownload" }));
    expect(res.url).toBe("");
    expect(res.error).toMatch(/PDF/i);
    expect(db.uploads).toHaveLength(0);
  });

  test("menolak executable yang menyamar sebagai .pdf berMIME pdf", async () => {
    const res = await upload(new File([EXE], "cv.pdf", { type: "application/pdf" }));
    expect(res.url).toBe("");
    expect(res.error).toBeTruthy();
    expect(db.uploads).toHaveLength(0);
  });

  test("menolak file lebih dari 5MB", async () => {
    const big = new Uint8Array(5 * MB + 1);
    big.set(PDF);
    const res = await upload(new File([big], "cv.pdf", { type: "application/pdf" }));
    expect(res.error).toMatch(/5MB/);
    expect(db.uploads).toHaveLength(0);
  });

  test("menolak kind yang tidak dikenal", async () => {
    const res = await upload(new File([PDF], "cv.pdf", { type: "application/pdf" }), "script");
    expect(res.error).toBeTruthy();
    expect(db.uploads).toHaveLength(0);
  });

  test("mengembalikan error, bukan url, saat storage gagal", async () => {
    useDb(undefined, { data: null, error: { message: "bucket not found" } });
    const res = await upload(new File([PDF], "cv.pdf", { type: "application/pdf" }));
    expect(res).toEqual({ url: "", error: "bucket not found" });
  });

  test("CV disimpan di path tetap dengan upsert dan URL anti-cache", async () => {
    const res = await upload(new File([PDF], "CV Saya final.pdf", { type: "application/pdf" }));
    expect(res.error).toBeUndefined();
    expect(db.uploads).toEqual([
      {
        bucket: "portfolio-assets",
        path: "cv/cv.pdf",
        opts: expect.objectContaining({ upsert: true, contentType: "application/pdf" }),
      },
    ]);
    expect(res.url).toMatch(
      /^https:\/\/x\.supabase\.co\/storage\/v1\/object\/public\/portfolio-assets\/cv\/cv\.pdf\?v=\d+$/
    );
  });

  test("foto profil WebP disimpan di profile/photo.webp", async () => {
    const res = await upload(new File([WEBP], "me.webp", { type: "image/webp" }), "photo");
    expect(res.error).toBeUndefined();
    expect(db.uploads[0]).toMatchObject({ path: "profile/photo.webp" });
  });

  test("foto profil menolak PDF", async () => {
    const res = await upload(new File([PDF], "me.pdf", { type: "application/pdf" }), "photo");
    expect(res.error).toMatch(/JPG|PNG|WebP/i);
    expect(db.uploads).toHaveLength(0);
  });

  test("foto profil PNG diterima", async () => {
    const res = await upload(new File([PNG], "me.png", { type: "image/png" }), "photo");
    expect(res.error).toBeUndefined();
    expect(db.uploads[0]).toMatchObject({ path: "profile/photo.png" });
  });
});
