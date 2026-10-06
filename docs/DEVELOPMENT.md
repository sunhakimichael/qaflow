# Panduan Pengembangan QAflow

Dokumen ini menjawab empat kebutuhan umum saat melanjutkan pengembangan QAflow: menambah fitur, deployment gratis, ringkasan implementasi, dan menjalankan project secara lokal.

## 1. Cara menambahkan fitur baru

### Alur yang disarankan

1. Buat branch baru dari `main`.

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/nama-fitur
   ```

2. Tentukan apakah fitur tersebut hanya UI/demo atau membutuhkan backend nyata. Saat ini halaman QAflow menggunakan typed mock data dari `client/src/data/mockQaData.ts`, sehingga perubahan UI biasanya tidak membutuhkan database.

3. Tambahkan atau ubah data demo di `client/src/data/mockQaData.ts` jika fitur perlu contoh data baru.

4. Reuse komponen yang sudah ada di `client/src/components/qaflow/AppShell.tsx`:
   - `AppShell` untuk sidebar, topbar, breadcrumb, dan page heading.
   - `StatusChip` untuk status PASS, FAILED, REVIEW, RUNNING, OPEN, FLAKY, dan APPROVED.
   - `SectionHeading` untuk judul panel yang konsisten.

5. Tambahkan halaman/modul di `client/src/pages/QaPages.tsx` atau pecah menjadi file page baru jika ukurannya mulai besar.

6. Tambahkan route di `client/src/App.tsx` dan entry route yang sama di `client/public/manus-routes.json`.

   **Teks UI wajib dua bahasa (id/en).** Jangan menulis teks langsung di JSX. Tambahkan key ke file pesan di
   `client/src/i18n/messages/` (`shell.ts`, `pages.ts`, `labs.ts`, atau namespace baru lewat `defineMessages`),
   lalu pakai `const { t } = useT(namaMessages)` dan `t("key", { var })`. Typecheck gagal bila versi `id`
   kehilangan key yang ada di `en`. Untuk mock data yang berisi teks antarmuka, pakai tipe `Localized`
   (`{ id, en }`) dan tampilkan dengan `l(value)`. Bahasa default `id`; pilihan pengguna disimpan di
   `localStorage` (`qaflow.lang`) dan bisa diganti lewat tombol ID/EN di topbar.

7. Untuk interaksi ringan, gunakan state lokal dan `toast` dari `sonner`. Untuk fitur server, tambahkan prosedur tRPC/API dan schema database secara terpisah; jangan memasukkan secret atau kredensial ke client.

8. Jalankan validasi sebelum commit:

   ```bash
   pnpm check
   pnpm test
   pnpm build
   ```

9. Periksa desktop dan mobile. Pastikan status tidak hanya dibedakan melalui warna, tombol memiliki label, dan drawer/dialog dapat ditutup dengan jelas.

10. Commit dan push branch, lalu buat pull request ke `main`.

### Contoh fitur baru: menambahkan halaman Schedules

- Tambahkan `{ href: "/schedules", label: "Schedules", icon: CalendarClock }` ke navigasi di `AppShell.tsx`.
- Buat `SchedulesContent` dengan data demo typed.
- Tambahkan `<Route path="/schedules">...</Route>` di `App.tsx`.
- Tambahkan `{ "path": "/schedules", "title": "Schedules" }` ke `manus-routes.json`.
- Tambahkan status schedule seperti `active`, `paused`, dan `failed` ke `StatusChip` bila diperlukan.
- Jalankan check, test, build, lalu commit.

### Jika fitur membutuhkan backend nyata

Fitur seperti login, persistence, Jira/ClickUp, LLM, worker Playwright, artefak, dan RBAC tidak cukup diimplementasikan di client. Gunakan pola berikut:

1. Schema data di `drizzle/schema.ts`.
2. Migration dengan `pnpm db:push` atau migration terkontrol.
3. Query/repository di `server/db.ts`.
4. Procedure di `server/routers.ts` atau handler Express yang sesuai.
5. Hook client memakai tRPC/TanStack Query.
6. Validasi input dengan Zod dan otorisasi deny-by-default.
7. Secret hanya server-side; jangan gunakan `VITE_` untuk secret.

## 2. Deployment gratis ke Vercel atau Netlify

### Batasan deployment saat ini

Project memakai React/Vite di frontend dan Express/tRPC sebagai starter backend. Konfigurasi deployment gratis di bawah ini men-deploy **frontend QAflow sebagai static SPA**, sehingga dashboard mock-data dapat diakses publik.

`pnpm build` memang juga membuat `dist/index.js`, tetapi Vercel/Netlify static hosting hanya menyajikan `dist/public`. Endpoint Express seperti `/api/health`, database, tRPC, worker, dan integrasi eksternal belum otomatis berjalan sebagai backend di deployment static.

Untuk production penuh, backend perlu dipisahkan ke server yang menjalankan Node, atau diubah menjadi Vercel Functions/Netlify Functions.

### Opsi A — Vercel melalui GitHub

1. Buka [Vercel](https://vercel.com/) dan pilih **Add New → Project**.
2. Import repository `sunhakimichael/qaflow` dari GitHub.
3. Gunakan pengaturan berikut jika Vercel tidak mendeteksinya otomatis:
   - Framework preset: `Vite`
   - Build command: `pnpm build`
   - Output directory: `dist/public`
   - Install command: `pnpm install --frozen-lockfile`
4. Tambahkan Node.js version `22` bila tersedia di project settings.
5. Klik **Deploy**.
6. Setiap push ke `main` akan membuat deployment baru; pull request dapat menghasilkan Preview deployment.

File `vercel.json` di root sudah berisi SPA rewrite agar route `/requirements`, `/test-cases`, dan route lain tidak menjadi 404 saat halaman di-refresh.

Alternatif CLI:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm dlx vercel
```

Referensi resmi: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

### Opsi B — Netlify melalui GitHub

1. Buka [Netlify](https://app.netlify.com/) dan pilih **Add new site → Import an existing project**.
2. Pilih GitHub lalu repository `sunhakimichael/qaflow`.
3. Gunakan pengaturan berikut:
   - Build command: `pnpm build`
   - Publish directory: `dist/public`
   - Node version: `22`
4. Klik **Deploy site**.
5. Setiap push ke `main` akan memicu build baru.

File `netlify.toml` sudah mendeklarasikan build dan SPA redirect. Alternatif CLI:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dlx netlify-cli init
pnpm build
pnpm dlx netlify-cli deploy --prod --dir=dist/public
```

Referensi resmi: [Vite on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/).

### Environment variables

Versi demo tidak membutuhkan environment variable untuk ditampilkan. Jika nanti menambahkan backend atau layanan eksternal:

- Jangan commit `.env`.
- Tambahkan nama variable non-rahasia ke `.env.example`.
- Set variable di dashboard Vercel/Netlify.
- Variable yang diawali `VITE_` akan masuk ke browser; jangan taruh database URL, token Jira, API key privat, atau master key di sana.

## 3. Ringkasan fitur yang sudah diimplementasikan

### App shell dan navigasi

- Sidebar QA Commerce dengan section Workspace dan Quality.
- Project switcher, environment context `staging`, user context Aisha Rahman / QA Lead.
- Breadcrumb, search shortcut, notification indicator, dan responsive mobile drawer.
- Brand mark QAflow dan signature signal-lime visual language.

### Overview

- Metric cards: pass rate, requirement coverage, open bugs, dan flaky tests.
- Trend chart pass rate dan execution duration.
- Requirement coverage breakdown.
- Recent test runs.
- Needs attention queue untuk AI draft review, failure cluster, dan coverage gap.

### Requirements dan Test Cases

- Search dan filter tabs.
- Requirement ID stabil seperti `REQ-042` dan test case ID seperti `TC-0045`.
- Priority, category, source PRD, coverage, automation, type, suite, dan linked requirement.
- Upload PRD dialog untuk Markdown/PDF/DOCX.
- Test case authoring dengan status draft/review/approved dan AI reasoning.

### Test Runs dan traceability

- Daftar run dengan environment, trigger, status, pass/fail count, durasi, dan waktu.
- Run smoke suite dialog.
- Detail drawer dengan alur `Requirement → Test Case → Fingerprint → Bug`.
- Rerun failed dan create bug affordances.

### API Lab dan DB Lab

- API Lab menyediakan request builder manual dengan method GET/POST/PATCH/DELETE, URL, environment, authorization, headers, body JSON, saved requests, variables, assertions status/latency/JSON path, response viewer, dan history affordance.
- DB Lab menyediakan SQL editor, pilihan PostgreSQL/MySQL/MongoDB, saved queries, schema browser, assertions row/column, result table, query validation, dan guardrail read-only.
- Production environment ditandai protected; UI menjelaskan bahwa write query dan destructive statement harus diblokir.
- Saat ini kedua lab adalah **UI product slice**: response API dan result DB memakai mock state. Executor backend nyata perlu ditambahkan melalui server-side proxy/worker dengan allowlist host, secret management, timeout, row limit, parameter binding, audit log, dan redaction.

### Reports, Bug Inbox, Environments, Integrations

- Aggregate quality trend dan export affordance.
- Bug fingerprint deduplication, severity, status, occurrences, dan tracker reference.
- Environment cards untuk dev/staging/production.
- Production protection indicator.
- Jira, ClickUp, dan notification integration cards.

### Engineering baseline

- TypeScript diagnostics.
- Responsive CSS dan reduced-motion support.
- Focus-visible states dan text labels untuk status.
- Route manifest `client/public/manus-routes.json`, termasuk `/api-lab` dan `/db-lab`.
- Existing server starter Express/tRPC/Drizzle tetap tersedia untuk pengembangan backend berikutnya.

## 4. Menjalankan QAflow secara lokal

### Prasyarat

- Node.js 22 atau lebih baru.
- pnpm 10 atau lebih baru.
- Git.

### Clone repository

```bash
git clone https://github.com/sunhakimichael/qaflow.git
cd qaflow
```

### Install dependency

```bash
corepack enable
pnpm install
```

### Jalankan development server

```bash
pnpm dev
```

Buka `http://localhost:3000`.

Development server menjalankan Express dan Vite melalui `server/_core/index.ts`. Port dapat diubah:

```bash
PORT=3001 pnpm dev
```

### Validasi project

```bash
pnpm check
pnpm test
pnpm build
```

### Jalankan hasil production build secara lokal

```bash
pnpm build
pnpm start
```

Buka `http://localhost:3000`.

### Menjalankan static-only mode

Untuk meniru deployment Vercel/Netlify:

```bash
pnpm dev:static
```

Untuk menghasilkan folder static:

```bash
pnpm build:static
```

Hasil static tersedia di `dist/public`.

### Database starter

Fitur demo tidak membutuhkan database. Jika mulai mengaktifkan fitur server yang memakai Drizzle:

```bash
pnpm db:migrate
# atau, untuk membuat dan menerapkan perubahan schema saat development:
pnpm db:push
```

Pastikan environment database sudah disiapkan dan jangan commit credential.

## Catatan keamanan

Jangan memasukkan secret ke mock data, client bundle, README, issue, atau commit. PRD dan input pengguna harus diperlakukan sebagai data. Jika fitur LLM/worker ditambahkan, pertahankan review manusia, validasi schema, allowlist host, masking artefak, RBAC, dan secret management server-side.
