# QAflow — Quality Operations Platform

QAflow adalah workspace operasional untuk tim QA yang menghubungkan alur:

> **Requirement → Test Case → Test Run → Report → Bug**

Website ini dibangun berdasarkan spesifikasi `web-qa.md` dan saat ini berfokus pada **interactive product slice** dengan mock data realistis. UI sudah siap didemokan dan dirancang agar kontrak data/API nyata dapat ditambahkan pada fase berikutnya.

## Preview

[Open QAflow Preview](https://8328-ih14thizjsvu6a7eirzxg-61eb9bcc.sg2.manus.computer/)

## Fitur yang tersedia

- Overview quality control room dengan pass rate, requirement coverage, open bugs, flaky tests, dan trend chart.
- Requirements workspace dengan pencarian, filter coverage, prioritas, sumber PRD, dan traceability drawer.
- Test Cases workspace dengan status draft/review/approved, tipe UI/API/DB/Manual, automation flag, dan AI reasoning.
- Test Runs dengan environment, hasil pass/fail, trigger source, detail run, rerun failed, serta create bug.
- Reports dengan aggregate quality trend dan export affordance.
- Bug Inbox dengan fingerprint deduplication, severity, status tracker, dan occurrence count.
- Environments dengan allowed hosts, connection status, dan protection untuk production.
- Integrations cards untuk Jira, ClickUp, dan notifikasi.
- Responsive mobile shell dengan sidebar drawer.
- Route manifest di `client/public/manus-routes.json`.

## Teknologi

- React 19 + TypeScript
- Vite
- Express + tRPC starter
- Drizzle ORM + MySQL starter migration
- Tailwind CSS v4
- Recharts
- Lucide React
- Wouter
- Vitest

## Menjalankan secara lokal

Panduan lengkap untuk menambah fitur, deployment ke Vercel/Netlify, ringkasan implementasi, dan setup lokal tersedia di [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

### Prasyarat

- Node.js 22+
- pnpm 10+

### Instalasi dan development

```bash
pnpm install
pnpm dev
```

Aplikasi berjalan di `http://localhost:3000` secara default.

### Perintah yang tersedia

```bash
pnpm check       # TypeScript typecheck
pnpm test        # Unit dan integration tests
pnpm build       # Production build
pnpm start       # Menjalankan hasil production build
pnpm db:migrate  # Menjalankan migration database
pnpm db:push     # Generate dan apply perubahan schema
```

## Struktur proyek

```text
client/
└── src/
    ├── App.tsx                       # Route map
    ├── index.css                     # Design tokens dan responsive styles
    ├── components/qaflow/
    │   └── AppShell.tsx              # Sidebar, topbar, status chips, section heading
    ├── data/
    │   └── mockQaData.ts             # Typed demo data
    └── pages/
        └── QaPages.tsx               # Overview dan modul QAflow
server/
└── _core/                            # Express/tRPC runtime dari starter
client/public/manus-routes.json       # Route manifest
app.config.ts                         # Project logo metadata
TODO.md                               # Implementation outcomes
```

## Prinsip produk

- **Human-in-the-loop:** output AI tetap berstatus draft sampai direview QA.
- **Deterministic execution:** LLM digunakan untuk authoring, bukan untuk mengeksekusi test secara bebas.
- **Traceability:** requirement, test case, run result, dan bug dapat ditelusuri sebagai satu alur.
- **Secure by default:** secret tidak ditampilkan, environment production dilindungi, dan eksekusi destruktif perlu guardrail.

## Status implementasi

Versi saat ini adalah **frontend product slice/demo**. Interaksi utama memakai mock state dan toast untuk menunjukkan perilaku produk. Integrasi produksi untuk LLM, worker Playwright, Jira/ClickUp, storage artefak, RBAC, dan persistence database belum diaktifkan sebagai koneksi nyata.

Checkpoint QAflow terakhir: `96fdb3b`.
