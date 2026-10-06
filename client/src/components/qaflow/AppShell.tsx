import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Bell,
  ChevronDown,
  Command,
  FlaskConical,
  LayoutDashboard,
  FileText,
  Boxes,
  PlayCircle,
  BarChart3,
  Bug,
  Server,
  Plug,
  Menu,
  X,
  ArrowUpRight,
  Database,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  tone?: string;
};
const primary: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/requirements", label: "Requirements", icon: FileText, badge: "41" },
  { href: "/test-cases", label: "Test Cases", icon: Boxes, badge: "8" },
  { href: "/runs", label: "Test Runs", icon: PlayCircle },
];
const quality: NavItem[] = [
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/bugs", label: "Bug Inbox", icon: Bug, badge: "7", tone: "coral" },
  { href: "/environments", label: "Environments", icon: Server },
  { href: "/integrations", label: "Integrations", icon: Plug },
];
const labs: NavItem[] = [
  { href: "/api-lab", label: "API Lab", icon: Workflow },
  { href: "/db-lab", label: "DB Lab", icon: Database },
];

function BrandMark() {
  return (
    <div className="brand-lockup">
      <span className="brand-mark">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="brand-name">
        <b>QA</b>flow
      </span>
    </div>
  );
}

export function AppShell({
  children,
  title,
  eyebrow,
  action,
}: {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const nav = (items: NavItem[]) =>
    items.map(({ href, label, icon: Icon, badge, tone }) => (
      <Link
        href={href}
        key={href}
        onClick={() => setMobileOpen(false)}
        className={`nav-item ${location === href ? "active" : ""}`}
      >
        <Icon size={17} strokeWidth={1.8} />
        <span>{label}</span>
        {badge && (
          <em className={tone === "coral" ? "badge-coral" : ""}>{badge}</em>
        )}
      </Link>
    ));
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <BrandMark />
          <button
            className="icon-button mobile-close"
            aria-label="Tutup menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <button
          className="project-switcher"
          onClick={() =>
            toast("Project switcher", {
              description: "QA Commerce · 12 members · 3 environments",
            })
          }
        >
          <span className="project-avatar">QC</span>
          <span className="project-meta">
            <small>PROJECT</small>
            <strong>QA Commerce</strong>
          </span>
          <ChevronDown size={15} />
        </button>
        <div className="nav-section">
          <span className="nav-label">WORKSPACE</span>
          {nav(primary)}
        </div>
        <div className="nav-section">
          <span className="nav-label">QUALITY</span>
          {nav(quality)}
        </div>
        <div className="nav-section">
          <span className="nav-label">EXECUTION LABS</span>
          {nav(labs)}
        </div>
        <div className="sidebar-bottom">
          <div className="health-card">
            <span className="pulse-dot" />
            <div>
              <strong>All systems healthy</strong>
              <small>Last check 2 min ago</small>
            </div>
            <ArrowUpRight size={14} />
          </div>
          <div className="user-card">
            <span className="avatar">AR</span>
            <div>
              <strong>Aisha Rahman</strong>
              <small>QA Lead</small>
            </div>
            <ChevronDown size={14} />
          </div>
        </div>
      </aside>
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Tutup menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Buka menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={19} />
          </button>
          <div className="breadcrumbs">
            <span>QA Commerce</span>
            <b>/</b>
            <strong>{title}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="search-button"
              onClick={() =>
                toast("Search", {
                  description:
                    "Tekan ⌘K untuk mencari requirement, test case, atau run.",
                })
              }
            >
              <Command size={13} />
              <span>Search</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="icon-button notification"
              aria-label="Notifikasi"
              onClick={() => toast("3 notifikasi baru")}
            >
              <Bell size={17} />
              <i />
            </button>
            <span className="top-avatar">AR</span>
          </div>
        </header>
        <div className="page-wrap">
          <div className="page-heading">
            <div>
              <span className="eyebrow">{eyebrow ?? "QUALITY OPERATIONS"}</span>
              <h1>{title}</h1>
            </div>
            <div className="heading-action">{action}</div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export function StatusChip({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    passed: { label: "PASS", cls: "status-lime" },
    failed: { label: "FAILED", cls: "status-coral" },
    review: { label: "REVIEW", cls: "status-amber" },
    running: { label: "RUNNING", cls: "status-blue" },
    open: { label: "OPEN", cls: "status-coral" },
    flaky: { label: "FLAKY", cls: "status-amber" },
    approved: { label: "APPROVED", cls: "status-lime" },
  };
  const item = map[status] ?? {
    label: status.toUpperCase(),
    cls: "status-muted",
  };
  return (
    <span className={`status-chip ${item.cls}`}>
      <i />
      {item.label}
    </span>
  );
}

export function SectionHeading({
  title,
  detail,
  action,
}: {
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </div>
  );
}
