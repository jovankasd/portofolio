// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { PageRow, SiteSettingsRow } from "@/server/db/types";

const mocks = vi.hoisted(() => ({
  updatePageAction: vi.fn(),
  uploadAsset: vi.fn(),
  updateSiteSettings: vi.fn(),
}));

vi.mock("@/server/actions/pages.actions", () => ({ updatePageAction: mocks.updatePageAction }));
vi.mock("@/server/actions/storage.actions", () => ({
  uploadAsset: mocks.uploadAsset,
  uploadImageFile: vi.fn(),
}));
vi.mock("@/server/actions/site_settings.actions", () => ({
  updateSiteSettings: mocks.updateSiteSettings,
}));
vi.mock("@/server/actions/project.actions", () => ({
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));
vi.mock("@/server/actions/credential.actions", () => ({
  createCredential: vi.fn(),
  updateCredential: vi.fn(),
  deleteCredential: vi.fn(),
}));

import DashboardClient from "@/components/admin/DashboardClient";

const page = (over: Partial<PageRow>): PageRow => ({
  id: "id",
  slug: "beranda",
  title: "Beranda",
  content: null,
  metadata: {},
  is_published: true,
  created_at: "",
  updated_at: "",
  ...over,
});

const beranda = page({
  metadata: {
    hero_name: "Jovanka Surya Dilla",
    hero_description: "Deskripsi lama",
    profile_photo_url: "/images/lama.png",
    catatan_lain: "dipertahankan",
  },
});
const tentang = page({
  id: "id2",
  slug: "tentang",
  title: "Judul Tentang",
  content: "Isi tentang lama",
});

const settings: SiteSettingsRow = {
  id: 1,
  hero_tagline: null,
  cv_url: "/cv-lama.pdf",
  footer_text: "© 2026 Lama",
  social_links: [],
  skills: [],
  tools: [],
  principles: [],
  updated_at: "",
};

function renderDashboard(pages: PageRow[] = [beranda, tentang]) {
  return render(
    <DashboardClient
      initialProjects={[]}
      initialCredentials={[]}
      initialSettings={settings}
      initialPages={pages}
    />
  );
}

const pdfFile = (size = 100, name = "cv-baru.pdf") =>
  new File([new Uint8Array(size)], name, { type: "application/pdf" });

beforeEach(() => {
  vi.clearAllMocks();
  mocks.updatePageAction.mockResolvedValue({ data: beranda, error: null });
  mocks.updateSiteSettings.mockResolvedValue({ data: settings });
});
afterEach(cleanup);

describe("DashboardClient — tab Halaman Situs", () => {
  test("terdapat tab Halaman Situs", () => {
    renderDashboard([]);
    expect(screen.getByText(/Halaman Situs/i)).toBeDefined();
  });

  test("menampilkan petunjuk migrasi saat tabel pages kosong", () => {
    renderDashboard([]);
    fireEvent.click(screen.getByText(/Halaman Situs/i));
    expect(screen.getByText(/schema\.sql/)).toBeDefined();
  });

  test("mengedit Beranda: field terisi dari metadata dan tersimpan tanpa menghapus metadata lain", async () => {
    renderDashboard();
    fireEvent.click(screen.getByText(/Halaman Situs/i));
    fireEvent.click(screen.getByRole("button", { name: /Beranda/ }));

    const name = screen.getByLabelText("Nama lengkap") as HTMLInputElement;
    expect(name.value).toBe("Jovanka Surya Dilla");
    fireEvent.change(name, { target: { value: "Nama Baru" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan Halaman" }));

    await waitFor(() => expect(mocks.updatePageAction).toHaveBeenCalledTimes(1));
    expect(mocks.updatePageAction).toHaveBeenCalledWith(
      "beranda",
      expect.objectContaining({
        title: "Beranda",
        is_published: true,
        metadata: expect.objectContaining({
          hero_name: "Nama Baru",
          hero_description: "Deskripsi lama",
          profile_photo_url: "/images/lama.png",
          catatan_lain: "dipertahankan",
        }),
      })
    );
  });

  test("mengedit Tentang: judul dan konten dikirim sebagai title/content", async () => {
    mocks.updatePageAction.mockResolvedValue({ data: tentang, error: null });
    renderDashboard();
    fireEvent.click(screen.getByText(/Halaman Situs/i));
    fireEvent.click(screen.getByRole("button", { name: /Tentang/ }));

    expect((screen.getByLabelText("Judul halaman") as HTMLInputElement).value).toBe("Judul Tentang");
    fireEvent.change(screen.getByLabelText("Isi halaman"), { target: { value: "Isi baru" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan Halaman" }));

    await waitFor(() =>
      expect(mocks.updatePageAction).toHaveBeenCalledWith(
        "tentang",
        expect.objectContaining({ title: "Judul Tentang", content: "Isi baru" })
      )
    );
  });

  test("menampilkan pesan error dari server saat simpan halaman gagal", async () => {
    mocks.updatePageAction.mockResolvedValue({ data: null, error: "Unauthorized" });
    renderDashboard();
    fireEvent.click(screen.getByText(/Halaman Situs/i));
    fireEvent.click(screen.getByRole("button", { name: /Beranda/ }));
    fireEvent.click(screen.getByRole("button", { name: "Simpan Halaman" }));
    expect(await screen.findByText("Unauthorized")).toBeDefined();
  });
});

describe("DashboardClient — Pengaturan Situs", () => {
  function openSettings() {
    renderDashboard();
    fireEvent.click(screen.getByText("Pengaturan Situs"));
  }

  test("footer terisi dari pengaturan dan ikut tersimpan", async () => {
    openSettings();
    const footer = screen.getByLabelText("Teks footer") as HTMLInputElement;
    expect(footer.value).toBe("© 2026 Lama");
    fireEvent.change(footer, { target: { value: "© 2026 Baru" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan Pengaturan" }));
    await waitFor(() =>
      expect(mocks.updateSiteSettings).toHaveBeenCalledWith(
        expect.objectContaining({ footer_text: "© 2026 Baru", cv_url: "/cv-lama.pdf" })
      )
    );
  });

  test("mengunggah PDF CV mengisi URL CV dengan hasil unggahan", async () => {
    mocks.uploadAsset.mockResolvedValue({ url: "https://x.supabase.co/cv/cv.pdf?v=1" });
    openSettings();
    fireEvent.change(screen.getByLabelText("File CV (PDF)"), { target: { files: [pdfFile()] } });

    await waitFor(() =>
      expect((screen.getByLabelText("CV URL") as HTMLInputElement).value).toBe(
        "https://x.supabase.co/cv/cv.pdf?v=1"
      )
    );
    const fd = mocks.uploadAsset.mock.calls[0][0] as FormData;
    expect(fd.get("kind")).toBe("cv");
    expect((fd.get("file") as File).name).toBe("cv-baru.pdf");
  });

  test("file CV lebih dari 5MB ditolak di UI sebelum dikirim ke server", async () => {
    openSettings();
    fireEvent.change(screen.getByLabelText("File CV (PDF)"), {
      target: { files: [pdfFile(5 * 1024 * 1024 + 1)] },
    });
    expect(await screen.findByText(/terlalu besar/)).toBeDefined();
    expect(mocks.uploadAsset).not.toHaveBeenCalled();
  });

  test("file bukan PDF ditolak di UI untuk CV", async () => {
    openSettings();
    const exe = new File([new Uint8Array(10)], "setup.exe", { type: "application/x-msdownload" });
    fireEvent.change(screen.getByLabelText("File CV (PDF)"), { target: { files: [exe] } });
    expect(await screen.findByText(/PDF/, { selector: "p[role='alert']" })).toBeDefined();
    expect(mocks.uploadAsset).not.toHaveBeenCalled();
  });

  test("error dari server saat unggah CV ditampilkan dan URL lama tidak berubah", async () => {
    mocks.uploadAsset.mockResolvedValue({ url: "", error: "bucket not found" });
    openSettings();
    fireEvent.change(screen.getByLabelText("File CV (PDF)"), { target: { files: [pdfFile()] } });
    expect(await screen.findByText("bucket not found")).toBeDefined();
    expect((screen.getByLabelText("CV URL") as HTMLInputElement).value).toBe("/cv-lama.pdf");
  });
});
