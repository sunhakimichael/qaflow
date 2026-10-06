import type { Localized } from "@/i18n";

export type Status =
  | "passed"
  | "failed"
  | "review"
  | "running"
  | "open"
  | "flaky"
  | "approved"
  | "covered"
  | "partial"
  | "uncovered"
  | "in-progress"
  | "resolved";

/** Aggregate totals; tables below show a sample of these records. */
export const totals = {
  requirements: 224,
  uncoveredRequirements: 41,
  testCases: 312,
  testCasesInReview: 8,
  runs: 128,
};

export const metrics = [
  {
    label: { id: "Pass rate", en: "Pass rate" },
    value: "94.8%",
    delta: "+3.2%",
    tone: "lime",
    detail: { id: "vs 7 hari lalu", en: "vs 7 days ago" },
  },
  {
    label: { id: "Coverage requirement", en: "Requirement coverage" },
    value: "82%",
    delta: "+6.0%",
    tone: "blue",
    detail: { id: "184 dari 224 requirement", en: "184 of 224 requirements" },
  },
  {
    label: { id: "Bug terbuka", en: "Open bugs" },
    value: "7",
    delta: "−2",
    tone: "coral",
    detail: { id: "3 prioritas tinggi", en: "3 high priority" },
  },
  {
    label: { id: "Test flaky", en: "Flaky tests" },
    value: "3",
    delta: "−1",
    tone: "amber",
    detail: { id: "di bawah target 3%", en: "below the 3% target" },
  },
];

export const trend = [
  { day: "Sep 23", pass: 88, duration: 64 },
  { day: "Sep 24", pass: 90, duration: 58 },
  { day: "Sep 25", pass: 89, duration: 62 },
  { day: "Sep 26", pass: 92, duration: 55 },
  { day: "Sep 27", pass: 91, duration: 52 },
  { day: "Sep 28", pass: 94, duration: 48 },
  { day: "Sep 29", pass: 93, duration: 50 },
  { day: "Sep 30", pass: 95, duration: 46 },
  { day: "Oct 01", pass: 94, duration: 45 },
  { day: "Oct 02", pass: 96, duration: 43 },
  { day: "Oct 03", pass: 95, duration: 47 },
  { day: "Oct 04", pass: 97, duration: 41 },
  { day: "Oct 05", pass: 95, duration: 44 },
  { day: "Oct 06", pass: 94, duration: 42 },
];

export const coverage = [
  {
    label: { id: "Dengan test disetujui", en: "With approved test" },
    value: 64,
    count: { id: "143 req", en: "143 req" },
    tone: "lime",
  },
  {
    label: { id: "Terotomasi", en: "Automated" },
    value: 51,
    count: { id: "114 req", en: "114 req" },
    tone: "blue",
  },
  {
    label: { id: "Perlu review", en: "Needs review" },
    value: 18,
    count: { id: "40 req", en: "40 req" },
    tone: "amber",
  },
  {
    label: { id: "Tanpa coverage", en: "No coverage" },
    value: 18,
    count: { id: "41 req", en: "41 req" },
    tone: "coral",
  },
];

export type TraceNode = { title: Localized; detail: Localized };

export type Run = {
  id: string;
  title: string;
  status: Status;
  env: string;
  pass: string;
  duration: string;
  trigger: Localized;
  time: Localized;
  trace?: TraceNode[];
};

export const runs: Run[] = [
  {
    id: "RUN-128",
    title: "Smoke suite",
    status: "passed" as Status,
    env: "staging",
    pass: "42/42",
    duration: "08m 42s",
    trigger: { id: "CI / main", en: "CI / main" },
    time: { id: "12 menit lalu", en: "12 min ago" },
  },
  {
    id: "RUN-127",
    title: "Checkout regression",
    status: "failed" as Status,
    env: "staging",
    pass: "31/36",
    duration: "14m 18s",
    trigger: { id: "Aisha Rahman", en: "Aisha Rahman" },
    time: { id: "1 jam lalu", en: "1 hour ago" },
    trace: [
      {
        title: {
          id: "REQ-043 · Payment validation",
          en: "REQ-043 · Payment validation",
        },
        detail: {
          id: "3 test case tertaut · 2 disetujui",
          en: "3 linked test cases · 2 approved",
        },
      },
      {
        title: {
          id: "TC-0046 · Tolak kartu kadaluarsa",
          en: "TC-0046 · Tolak kartu kadaluarsa",
        },
        detail: {
          id: "API assertion gagal pada retry #2",
          en: "API assertion failed on retry #2",
        },
      },
      {
        title: { id: "Fingerprint 7f2a9c", en: "Fingerprint 7f2a9c" },
        detail: {
          id: "5 kemunculan di 2 run · kemungkinan duplikat",
          en: "5 occurrences across 2 runs · likely duplicate",
        },
      },
      {
        title: { id: "BUG-219 · Jira PAY-882", en: "BUG-219 · Jira PAY-882" },
        detail: {
          id: "Terbuka · Severity tinggi · terakhir terlihat 12 menit lalu",
          en: "Open · High severity · last seen 12 min ago",
        },
      },
    ],
  },
  {
    id: "RUN-126",
    title: "API contract suite",
    status: "passed" as Status,
    env: "dev",
    pass: "28/28",
    duration: "03m 08s",
    trigger: { id: "Terjadwal", en: "Schedule" },
    time: { id: "3 jam lalu", en: "3 hours ago" },
  },
  {
    id: "RUN-125",
    title: "Payments nightly",
    status: "flaky" as Status,
    env: "staging",
    pass: "67/70",
    duration: "22m 51s",
    trigger: { id: "CI / release", en: "CI / release" },
    time: { id: "Kemarin", en: "Yesterday" },
  },
  {
    id: "RUN-124",
    title: "Catalog permissions",
    status: "passed" as Status,
    env: "staging",
    pass: "18/18",
    duration: "05m 32s",
    trigger: { id: "Dimas Putra", en: "Dimas Putra" },
    time: { id: "Kemarin", en: "Yesterday" },
  },
];

export const requirements = [
  {
    id: "REQ-042",
    title: "Customer dapat menyimpan alamat pengiriman",
    category: "Checkout",
    priority: "High",
    coverage: "covered" as Status,
    tests: 8,
    source: "PRD v12 · §4.2",
    changed: false,
  },
  {
    id: "REQ-043",
    title: "Sistem menolak pembayaran dengan kartu kadaluarsa",
    category: "Payments",
    priority: "High",
    coverage: "partial" as Status,
    tests: 3,
    source: "PRD v12 · §4.3",
    changed: true,
  },
  {
    id: "REQ-044",
    title: "Admin dapat mengatur role anggota tim",
    category: "Admin",
    priority: "Medium",
    coverage: "covered" as Status,
    tests: 6,
    source: "PRD v12 · §5.1",
    changed: false,
  },
  {
    id: "REQ-045",
    title: "Order confirmation dikirim melalui email",
    category: "Orders",
    priority: "Medium",
    coverage: "uncovered" as Status,
    tests: 0,
    source: "PRD v12 · §5.4",
    changed: true,
  },
  {
    id: "REQ-046",
    title: "Pencarian produk mendukung typo tolerance",
    category: "Catalog",
    priority: "Low",
    coverage: "covered" as Status,
    tests: 4,
    source: "PRD v11 · §3.7",
    changed: false,
  },
  {
    id: "REQ-047",
    title: "Guest checkout tidak memerlukan akun",
    category: "Checkout",
    priority: "High",
    coverage: "covered" as Status,
    tests: 7,
    source: "PRD v11 · §4.1",
    changed: false,
  },
];

export const testCases = [
  {
    id: "TC-0045",
    title: "Simpan alamat baru dari checkout",
    type: "UI",
    status: "approved" as Status,
    automation: true,
    requirement: "REQ-042",
    suite: "Checkout",
    steps: 7,
    updated: { id: "2 jam lalu", en: "2 hours ago" },
    reason: { id: "Happy path + boundary", en: "Happy path + boundary" },
  },
  {
    id: "TC-0046",
    title: "Tolak kartu kadaluarsa",
    type: "API",
    status: "review" as Status,
    automation: true,
    requirement: "REQ-043",
    suite: "Payments",
    steps: 5,
    updated: { id: "4 jam lalu", en: "4 hours ago" },
    reason: {
      id: "Negative path + penanganan error",
      en: "Negative path + error handling",
    },
  },
  {
    id: "TC-0047",
    title: "Admin mengubah role menjadi viewer",
    type: "UI",
    status: "approved" as Status,
    automation: true,
    requirement: "REQ-044",
    suite: "Permissions",
    steps: 9,
    updated: { id: "Kemarin", en: "Yesterday" },
    reason: {
      id: "Transisi role + permission",
      en: "Role transition + permissions",
    },
  },
  {
    id: "TC-0048",
    title: "Email order confirmation terkirim",
    type: "API",
    status: "review" as Status,
    automation: true,
    requirement: "REQ-045",
    suite: "Orders",
    steps: 4,
    updated: { id: "Kemarin", en: "Yesterday" },
    reason: { id: "Integrasi + event async", en: "Integration + async event" },
  },
  {
    id: "TC-0049",
    title: "Validasi search dengan input kosong",
    type: "Manual",
    status: "review" as Status,
    automation: false,
    requirement: "REQ-046",
    suite: "Catalog",
    steps: 3,
    updated: { id: "2 hari lalu", en: "2 days ago" },
    reason: { id: "Validasi input", en: "Input validation" },
  },
];

export const attention = [
  {
    eyebrow: { id: "PERLU REVIEW", en: "REVIEW NEEDED" },
    title: {
      id: "8 draft test case menunggu review",
      en: "8 draft test cases awaiting review",
    },
    detail: {
      id: "AI authoring · 12 menit lalu",
      en: "AI authoring · 12 min ago",
    },
    tone: "amber",
    action: { id: "Review draft", en: "Review drafts" },
  },
  {
    eyebrow: { id: "KLASTER KEGAGALAN", en: "FAILURE CLUSTER" },
    title: {
      id: "Payment timeout muncul 5×",
      en: "Payment timeout occurred 5×",
    },
    detail: {
      id: "Fingerprint 7f2a · RUN-127",
      en: "Fingerprint 7f2a · RUN-127",
    },
    tone: "coral",
    action: { id: "Buka klaster", en: "Open cluster" },
  },
  {
    eyebrow: { id: "CELAH COVERAGE", en: "COVERAGE GAP" },
    title: {
      id: "REQ-045 belum memiliki test",
      en: "REQ-045 has no test yet",
    },
    detail: { id: "PRD v12 · Orders", en: "PRD v12 · Orders" },
    tone: "blue",
    action: { id: "Buat test", en: "Create test" },
  },
];

export const bugs = [
  {
    id: "BUG-219",
    title: "Payment gateway timeout setelah retry kedua",
    severity: "High",
    status: "open" as Status,
    fingerprint: "7f2a9c",
    occurrences: 5,
    lastSeen: { id: "12 menit lalu", en: "12 min ago" },
    tracker: "Jira · PAY-882",
  },
  {
    id: "BUG-218",
    title: "Alamat tersimpan tanpa province pada guest checkout",
    severity: "Medium",
    status: "in-progress" as Status,
    fingerprint: "3a91de",
    occurrences: 2,
    lastSeen: { id: "3 jam lalu", en: "3 hours ago" },
    tracker: "Jira · CHK-441",
  },
  {
    id: "BUG-214",
    title: "Role viewer dapat melihat audit settings",
    severity: "High",
    status: "open" as Status,
    fingerprint: "ac09b1",
    occurrences: 3,
    lastSeen: { id: "Kemarin", en: "Yesterday" },
    tracker: null,
  },
  {
    id: "BUG-213",
    title: "Voucher ganda terpakai pada checkout paralel",
    severity: "High",
    status: "open" as Status,
    fingerprint: "5be210",
    occurrences: 2,
    lastSeen: { id: "Kemarin", en: "Yesterday" },
    tracker: "Jira · CHK-437",
  },
  {
    id: "BUG-211",
    title: "Filter kategori tidak tersimpan setelah refresh",
    severity: "Low",
    status: "open" as Status,
    fingerprint: "e41c07",
    occurrences: 1,
    lastSeen: { id: "2 hari lalu", en: "2 days ago" },
    tracker: "Jira · CAT-210",
  },
  {
    id: "BUG-209",
    title: "Email konfirmasi terkirim dua kali",
    severity: "Medium",
    status: "in-progress" as Status,
    fingerprint: "9d33fa",
    occurrences: 4,
    lastSeen: { id: "2 hari lalu", en: "2 days ago" },
    tracker: "Jira · ORD-118",
  },
  {
    id: "BUG-207",
    title: "Halaman role tidak memuat pada akun baru",
    severity: "Medium",
    status: "open" as Status,
    fingerprint: "71aa5c",
    occurrences: 1,
    lastSeen: { id: "3 hari lalu", en: "3 days ago" },
    tracker: null,
  },
  {
    id: "BUG-203",
    title: "Ongkir tidak dihitung ulang setelah ganti alamat",
    severity: "High",
    status: "resolved" as Status,
    fingerprint: "c0d4e8",
    occurrences: 6,
    lastSeen: { id: "5 hari lalu", en: "5 days ago" },
    tracker: "Jira · CHK-402",
  },
  {
    id: "BUG-198",
    title: "Typo tolerance gagal untuk kata dengan angka",
    severity: "Low",
    status: "resolved" as Status,
    fingerprint: "2f6b91",
    occurrences: 2,
    lastSeen: { id: "1 minggu lalu", en: "1 week ago" },
    tracker: "Jira · CAT-201",
  },
];

export const environments = [
  {
    name: "staging",
    url: "https://staging.shopco.id",
    status: { id: "Terhubung", en: "Connected" },
    last: { id: "2 menit lalu", en: "2 min ago" },
    production: false,
    hosts: 4,
  },
  {
    name: "dev",
    url: "https://dev.shopco.id",
    status: { id: "Terhubung", en: "Connected" },
    last: { id: "18 menit lalu", en: "18 min ago" },
    production: false,
    hosts: 2,
  },
  {
    name: "production",
    url: "https://shopco.id",
    status: { id: "Terlindungi", en: "Protected" },
    last: { id: "Tidak pernah dijalankan", en: "Never run" },
    production: true,
    hosts: 1,
  },
];
