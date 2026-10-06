import { useEffect, useState, type ReactNode } from "react";
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
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { bugs, requirements, runs, testCases, totals } from "@/data/mockQaData";
import { LANGS, useLang, useT } from "@/i18n";
import { shellMessages } from "@/i18n/messages/shell";

type ShellKey = keyof typeof shellMessages.en;

type NavItem = {
  href: string;
  label: ShellKey;
  icon: typeof LayoutDashboard;
  badge?: number;
  badgeTitle?: ShellKey;
  tone?: string;
};
const primary: NavItem[] = [
  { href: "/", label: "navOverview", icon: LayoutDashboard },
  {
    href: "/requirements",
    label: "navRequirements",
    icon: FileText,
    badge: totals.uncoveredRequirements,
    badgeTitle: "badgeUncovered",
  },
  {
    href: "/test-cases",
    label: "navTestCases",
    icon: Boxes,
    badge: totals.testCasesInReview,
    badgeTitle: "badgeInReview",
  },
  { href: "/runs", label: "navRuns", icon: PlayCircle },
];
const quality: NavItem[] = [
  { href: "/reports", label: "navReports", icon: BarChart3 },
  {
    href: "/bugs",
    label: "navBugs",
    icon: Bug,
    badge: bugs.filter(b => b.status !== "resolved").length,
    badgeTitle: "badgeOpenBugs",
    tone: "coral",
  },
  { href: "/environments", label: "navEnvironments", icon: Server },
  { href: "/integrations", label: "navIntegrations", icon: Plug },
];
const labs: NavItem[] = [
  { href: "/api-lab", label: "navApiLab", icon: Workflow },
  { href: "/db-lab", label: "navDbLab", icon: Database },
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
  const { t } = useT(shellMessages);
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location, navigate] = useLocation();
  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(open => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const go = (href: string) => {
    setSearchOpen(false);
    navigate(href);
  };
  const nav = (items: NavItem[]) =>
    items.map(({ href, label, icon: Icon, badge, badgeTitle, tone }) => (
      <Link
        href={href}
        key={href}
        onClick={() => setMobileOpen(false)}
        className={`nav-item ${isActive(href) ? "active" : ""}`}
      >
        <Icon size={17} strokeWidth={1.8} />
        <span>{t(label)}</span>
        {badge !== undefined && (
          <em
            className={tone === "coral" ? "badge-coral" : ""}
            title={badgeTitle && t(badgeTitle, { count: badge })}
            aria-label={badgeTitle && t(badgeTitle, { count: badge })}
          >
            {badge}
          </em>
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
            aria-label={t("closeMenu")}
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <button
          className="project-switcher"
          onClick={() =>
            toast("Project switcher", {
              description: t("projectSwitcherDesc"),
            })
          }
        >
          <span className="project-avatar">QC</span>
          <span className="project-meta">
            <small>{t("project")}</small>
            <strong>QA Commerce</strong>
          </span>
          <ChevronDown size={15} />
        </button>
        <div className="nav-section">
          <span className="nav-label">{t("sectionWorkspace")}</span>
          {nav(primary)}
        </div>
        <div className="nav-section">
          <span className="nav-label">{t("sectionQuality")}</span>
          {nav(quality)}
        </div>
        <div className="nav-section">
          <span className="nav-label">{t("sectionLabs")}</span>
          {nav(labs)}
        </div>
        <div className="sidebar-bottom">
          <div className="health-card">
            <span className="pulse-dot" />
            <div>
              <strong>{t("healthy")}</strong>
              <small>{t("lastCheck")}</small>
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
          aria-label={t("closeMenu")}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label={t("openMenu")}
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
              onClick={() => setSearchOpen(true)}
            >
              <Command size={13} />
              <span>{t("search")}</span>
              <kbd>⌘ K</kbd>
            </button>
            <div
              className="lang-toggle"
              role="group"
              aria-label={t("language")}
            >
              {LANGS.map(code => (
                <button
                  key={code}
                  className={lang === code ? "active" : ""}
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="icon-button notification"
              aria-label={t("notifications")}
              onClick={() => toast(t("notificationsToast"))}
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
              <span className="eyebrow">{eyebrow ?? t("defaultEyebrow")}</span>
              <h1>{title}</h1>
            </div>
            <div className="heading-action">{action}</div>
          </div>
          {children}
        </div>
      </main>
      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title={t("searchTitle")}
        description={t("searchDesc")}
      >
        <CommandInput placeholder={t("searchPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("searchEmpty")}</CommandEmpty>
          <CommandGroup heading={t("groupPages")}>
            {[...primary, ...quality, ...labs].map(item => (
              <CommandItem
                key={item.href}
                value={t(item.label)}
                onSelect={() => go(item.href)}
              >
                <item.icon /> {t(item.label)}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={t("groupRequirements")}>
            {requirements.map(r => (
              <CommandItem
                key={r.id}
                value={`${r.id} ${r.title}`}
                onSelect={() => go(`/requirements/${r.id}`)}
              >
                <FileText /> {r.id} · {r.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={t("groupTestCases")}>
            {testCases.map(t => (
              <CommandItem
                key={t.id}
                value={`${t.id} ${t.title}`}
                onSelect={() => go(`/test-cases/${t.id}`)}
              >
                <Boxes /> {t.id} · {t.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={t("groupRuns")}>
            {runs.map(r => (
              <CommandItem
                key={r.id}
                value={`${r.id} ${r.title}`}
                onSelect={() => go(`/runs/${r.id}`)}
              >
                <PlayCircle /> {r.id} · {r.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={t("groupBugs")}>
            {bugs.map(b => (
              <CommandItem
                key={b.id}
                value={`${b.id} ${b.title}`}
                onSelect={() => go(`/bugs/${b.id}`)}
              >
                <Bug /> {b.id} · {b.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

const STATUS_STYLE: Record<string, { label: ShellKey; cls: string }> = {
  passed: { label: "statusPassed", cls: "status-lime" },
  failed: { label: "statusFailed", cls: "status-coral" },
  review: { label: "statusReview", cls: "status-amber" },
  running: { label: "statusRunning", cls: "status-blue" },
  open: { label: "statusOpen", cls: "status-coral" },
  flaky: { label: "statusFlaky", cls: "status-amber" },
  approved: { label: "statusApproved", cls: "status-lime" },
  covered: { label: "statusCovered", cls: "status-lime" },
  partial: { label: "statusPartial", cls: "status-amber" },
  uncovered: { label: "statusUncovered", cls: "status-coral" },
  "in-progress": { label: "statusInProgress", cls: "status-blue" },
  resolved: { label: "statusResolved", cls: "status-muted" },
};

export function StatusChip({ status }: { status: string }) {
  const { t } = useT(shellMessages);
  const item = STATUS_STYLE[status];
  return (
    <span className={`status-chip ${item?.cls ?? "status-muted"}`}>
      <i />
      {item ? t(item.label) : status.toUpperCase()}
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
