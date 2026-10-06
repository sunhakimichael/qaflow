export type Status = "passed" | "failed" | "review" | "running" | "open" | "flaky" | "approved";

export const metrics = [
  { label: "Pass rate", value: "94.8%", delta: "+3.2%", tone: "lime", detail: "vs 7 hari lalu" },
  { label: "Requirement coverage", value: "82%", delta: "+6.0%", tone: "blue", detail: "184 dari 224 requirement" },
  { label: "Open bugs", value: "7", delta: "−2", tone: "coral", detail: "3 high priority" },
  { label: "Flaky tests", value: "3", delta: "−1", tone: "amber", detail: "di bawah target 3%" },
];

export const trend = [
  { day: "Sep 23", pass: 88, duration: 64 }, { day: "Sep 24", pass: 90, duration: 58 },
  { day: "Sep 25", pass: 89, duration: 62 }, { day: "Sep 26", pass: 92, duration: 55 },
  { day: "Sep 27", pass: 91, duration: 52 }, { day: "Sep 28", pass: 94, duration: 48 },
  { day: "Sep 29", pass: 93, duration: 50 }, { day: "Sep 30", pass: 95, duration: 46 },
  { day: "Oct 01", pass: 94, duration: 45 }, { day: "Oct 02", pass: 96, duration: 43 },
  { day: "Oct 03", pass: 95, duration: 47 }, { day: "Oct 04", pass: 97, duration: 41 },
  { day: "Oct 05", pass: 95, duration: 44 }, { day: "Oct 06", pass: 94, duration: 42 },
];

export const coverage = [
  { label: "With approved test", value: 64, count: "143 req", tone: "lime" },
  { label: "Automated", value: 51, count: "114 req", tone: "blue" },
  { label: "Needs review", value: 18, count: "40 req", tone: "amber" },
  { label: "No coverage", value: 18, count: "41 req", tone: "coral" },
];

export const runs = [
  { id: "RUN-128", title: "Smoke suite", status: "passed" as Status, env: "staging", pass: "42/42", duration: "08m 42s", trigger: "CI / main", time: "12 min lalu" },
  { id: "RUN-127", title: "Checkout regression", status: "failed" as Status, env: "staging", pass: "31/36", duration: "14m 18s", trigger: "Aisha Rahman", time: "1 jam lalu" },
  { id: "RUN-126", title: "API contract suite", status: "passed" as Status, env: "dev", pass: "28/28", duration: "03m 08s", trigger: "Schedule", time: "3 jam lalu" },
  { id: "RUN-125", title: "Payments nightly", status: "flaky" as Status, env: "staging", pass: "67/70", duration: "22m 51s", trigger: "CI / release", time: "Kemarin" },
  { id: "RUN-124", title: "Catalog permissions", status: "passed" as Status, env: "staging", pass: "18/18", duration: "05m 32s", trigger: "Dimas Putra", time: "Kemarin" },
];

export const requirements = [
  { id: "REQ-042", title: "Customer dapat menyimpan alamat pengiriman", category: "Checkout", priority: "High", coverage: "covered", tests: 8, source: "PRD v12 · §4.2", changed: false },
  { id: "REQ-043", title: "Sistem menolak pembayaran dengan kartu kadaluarsa", category: "Payments", priority: "High", coverage: "review", tests: 3, source: "PRD v12 · §4.3", changed: true },
  { id: "REQ-044", title: "Admin dapat mengatur role anggota tim", category: "Admin", priority: "Medium", coverage: "covered", tests: 6, source: "PRD v12 · §5.1", changed: false },
  { id: "REQ-045", title: "Order confirmation dikirim melalui email", category: "Orders", priority: "Medium", coverage: "none", tests: 0, source: "PRD v12 · §5.4", changed: true },
  { id: "REQ-046", title: "Pencarian produk mendukung typo tolerance", category: "Catalog", priority: "Low", coverage: "covered", tests: 4, source: "PRD v11 · §3.7", changed: false },
  { id: "REQ-047", title: "Guest checkout tidak memerlukan akun", category: "Checkout", priority: "High", coverage: "covered", tests: 7, source: "PRD v11 · §4.1", changed: false },
];

export const testCases = [
  { id: "TC-0045", title: "Simpan alamat baru dari checkout", type: "UI", status: "approved" as Status, automation: true, requirement: "REQ-042", suite: "Checkout", steps: 7, updated: "2 jam lalu", reason: "Happy path + boundary" },
  { id: "TC-0046", title: "Tolak kartu kadaluarsa", type: "API", status: "review" as Status, automation: true, requirement: "REQ-043", suite: "Payments", steps: 5, updated: "4 jam lalu", reason: "Negative path + error handling" },
  { id: "TC-0047", title: "Admin mengubah role menjadi viewer", type: "UI", status: "approved" as Status, automation: true, requirement: "REQ-044", suite: "Permissions", steps: 9, updated: "Kemarin", reason: "Role transition + permissions" },
  { id: "TC-0048", title: "Email order confirmation terkirim", type: "API", status: "review" as Status, automation: true, requirement: "REQ-045", suite: "Orders", steps: 4, updated: "Kemarin", reason: "Integration + async event" },
  { id: "TC-0049", title: "Validasi search dengan input kosong", type: "Manual", status: "review" as Status, automation: false, requirement: "REQ-046", suite: "Catalog", steps: 3, updated: "2 hari lalu", reason: "Input validation" },
];

export const attention = [
  { eyebrow: "REVIEW NEEDED", title: "8 draft test case menunggu review", detail: "AI authoring · 12 menit lalu", tone: "amber", action: "Review drafts" },
  { eyebrow: "FAILURE CLUSTER", title: "Payment timeout muncul 5×", detail: "Fingerprint 7f2a · RUN-127", tone: "coral", action: "Open cluster" },
  { eyebrow: "COVERAGE GAP", title: "REQ-045 belum memiliki test", detail: "PRD v12 · Orders", tone: "blue", action: "Create test" },
];

export const bugs = [
  { id: "BUG-219", title: "Payment gateway timeout setelah retry kedua", severity: "High", status: "Open", fingerprint: "7f2a9c", occurrences: 5, lastSeen: "12 menit lalu", tracker: "Jira · PAY-882" },
  { id: "BUG-218", title: "Alamat tersimpan tanpa province pada guest checkout", severity: "Medium", status: "In progress", fingerprint: "3a91de", occurrences: 2, lastSeen: "3 jam lalu", tracker: "Jira · CHK-441" },
  { id: "BUG-214", title: "Role viewer dapat melihat audit settings", severity: "High", status: "Open", fingerprint: "ac09b1", occurrences: 3, lastSeen: "Kemarin", tracker: "Belum ditautkan" },
];

export const environments = [
  { name: "staging", url: "https://staging.shopco.id", status: "Connected", last: "2 menit lalu", production: false, hosts: 4 },
  { name: "dev", url: "https://dev.shopco.id", status: "Connected", last: "18 menit lalu", production: false, hosts: 2 },
  { name: "production", url: "https://shopco.id", status: "Protected", last: "Tidak pernah dijalankan", production: true, hosts: 1 },
];
