import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  FileUp,
  Filter,
  GitBranch,
  Layers3,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  AppShell,
  SectionHeading,
  StatusChip,
} from "@/components/qaflow/AppShell";
import {
  attention,
  bugs,
  coverage,
  environments,
  metrics,
  requirements,
  runs,
  testCases,
  totals,
  trend,
  type Run,
} from "@/data/mockQaData";
import { useT } from "@/i18n";
import { pagesMessages } from "@/i18n/messages/pages";

type PagesKey = keyof (typeof pagesMessages)["en"];

/** Priority / severity values are data keys; only their display is translated. */
const LEVEL_KEYS: Record<string, PagesKey> = {
  High: "levelHigh",
  Medium: "levelMedium",
  Low: "levelLow",
};

/** Accessible modal shell: Escape, focus trap, and click-outside all close it. */
function Modal({
  onClose,
  title,
  className,
  overlayClassName,
  children,
}: {
  onClose: () => void;
  title: string;
  className: string;
  overlayClassName: string;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Root open onOpenChange={open => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayClassName} />
        <DialogPrimitive.Content
          className={className}
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">
            {title}
          </DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Makes a table row clickable with mouse and keyboard (Enter / Space). */
function rowProps(onOpen: () => void) {
  return {
    onClick: onOpen,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen();
      }
    },
    tabIndex: 0,
    role: "link",
    style: { cursor: "pointer" },
  } as const;
}

function Button({
  children,
  primary = false,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      className={primary ? "primary-button" : "secondary-button"}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}

export function Overview() {
  const [, navigate] = useLocation();
  const [dialog, setDialog] = useState<"prd" | "run" | null>(null);
  const { t, l } = useT(pagesMessages);
  return (
    <AppShell
      title={t("titleOverview")}
      eyebrow={t("eyebrowOverview")}
      action={
        <>
          <Button icon={<FileUp size={15} />} onClick={() => setDialog("prd")}>
            {t("uploadPrd")}
          </Button>
          <Button
            primary
            icon={<Play size={15} />}
            onClick={() => setDialog("run")}
          >
            {t("runSmokeSuite")}
          </Button>
        </>
      }
    >
      <div className="metric-grid">
        {metrics.map(metric => (
          <div className="metric-card" key={metric.label.en}>
            <div className="metric-label">{l(metric.label)}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-foot">
              <em className={metric.tone}>{metric.delta}</em>
              <span className="metric-detail">{l(metric.detail)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="panel">
          <SectionHeading
            title={t("passDurationTitle")}
            detail={t("last14Days")}
            action={
              <button
                className="text-link"
                onClick={() =>
                  toast(t("reportDetailToast"), {
                    description: t("reportDetailDesc"),
                  })
                }
              >
                {t("viewReport")} <ArrowUpRight size={12} />
              </button>
            }
          />
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trend}
                margin={{ top: 4, right: -14, left: -14, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="passFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B7F36B" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#B7F36B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#E8ECE8"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: "#84918B" }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  yAxisId="pass"
                  domain={[80, 100]}
                  ticks={[80, 85, 90, 95, 100]}
                  unit="%"
                  tick={{ fontSize: 9, fill: "#6D9C25" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="duration"
                  orientation="right"
                  domain={[0, 80]}
                  ticks={[0, 20, 40, 60, 80]}
                  unit="m"
                  tick={{ fontSize: 9, fill: "#5B8DEF" }}
                  tickLine={false}
                  axisLine={false}
                />
                <ReferenceLine
                  yAxisId="pass"
                  y={95}
                  stroke="#6D9C25"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E4E8E3",
                    fontSize: 11,
                  }}
                />
                <Area
                  yAxisId="pass"
                  type="monotone"
                  dataKey="pass"
                  stroke="#6D9C25"
                  fill="url(#passFill)"
                  strokeWidth={2.5}
                  name={t("chartPassRate")}
                />
                <Area
                  yAxisId="duration"
                  type="monotone"
                  dataKey="duration"
                  stroke="#5B8DEF"
                  fill="none"
                  strokeWidth={2}
                  name={t("chartDuration")}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            <span>
              <i style={{ background: "#6D9C25" }} /> {t("legendPassRate")}
            </span>
            <span>
              <i style={{ background: "#5B8DEF" }} /> {t("legendDuration")}
            </span>
            <span style={{ marginLeft: "auto" }}>
              {t("legendTarget")} <b>≥ 95%</b>
            </span>
          </div>
        </div>
        <div className="panel">
          <SectionHeading
            title={t("requirementCoverage")}
            detail={t("totalRequirements", { count: totals.requirements })}
            action={
              <Link href="/requirements" className="text-link">
                {t("viewAll")} <ArrowUpRight size={12} />
              </Link>
            }
          />
          {coverage.map(item => (
            <div className="coverage-row" key={item.label.en}>
              <div className="coverage-top">
                <span>{l(item.label)}</span>
                <span>
                  {item.value}% · {l(item.count)}
                </span>
              </div>
              <div className="bar">
                <i className={item.tone} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
          <div
            style={{
              borderTop: "1px solid #EEF0ED",
              paddingTop: 14,
              marginTop: 22,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="subtext">{t("coverageUp")}</span>
            <span className="status-chip status-lime">+6.0%</span>
          </div>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="panel table-panel">
          <SectionHeading
            title={t("recentRuns")}
            detail={t("recentRunsDetail")}
            action={
              <Link href="/runs" className="text-link">
                {t("allRuns")} <ArrowUpRight size={12} />
              </Link>
            }
          />
          <RunTable compact onRow={run => navigate(`/runs/${run.id}`)} />
        </div>
        <div className="panel">
          <SectionHeading
            title={t("needsAttention")}
            detail={t("needsAttentionDetail")}
          />
          {attention.map(item => (
            <div
              className={`attention-item tone-${item.tone}`}
              key={item.eyebrow.en}
              onClick={() =>
                toast(l(item.action), { description: l(item.title) })
              }
            >
              <span className="eyebrow">{l(item.eyebrow)}</span>
              <h3>{l(item.title)}</h3>
              <p>{l(item.detail)}</p>
              <div className="attention-action">
                {l(item.action)} <ChevronRight size={11} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {dialog === "prd" && <UploadDialog onClose={() => setDialog(null)} />}
      {dialog === "run" && <RunDialog onClose={() => setDialog(null)} />}
    </AppShell>
  );
}

function RunTable({
  compact = false,
  onRow,
  rows = runs,
}: {
  compact?: boolean;
  onRow: (run: Run) => void;
  rows?: Run[];
}) {
  const { t, l } = useT(pagesMessages);
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t("colRun")}</th>
          <th>{t("colStatus")}</th>
          <th>{t("colEnvironment")}</th>
          <th>{t("colResult")}</th>
          <th>{t("colDuration")}</th>
          <th>{t("colTriggeredBy")}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.slice(0, compact ? 5 : rows.length).map(run => (
          <tr key={run.id} {...rowProps(() => onRow(run))}>
            <td>
              <span className="id-code">{run.id}</span>
              <span className="subtext">{run.title}</span>
            </td>
            <td>
              <StatusChip status={run.status} />
            </td>
            <td>
              <span className="tag">{run.env}</span>
            </td>
            <td>
              <strong>{run.pass}</strong>
            </td>
            <td>{run.duration}</td>
            <td>
              <span className="subtext">{l(run.trigger)}</span>
              <span className="subtext">{l(run.time)}</span>
            </td>
            <td>
              <MoreHorizontal size={15} color="#A7B1AC" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DetailDrawer({
  onClose,
  eyebrow,
  title,
  meta,
  children,
}: {
  onClose: () => void;
  eyebrow: string;
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  const { t } = useT(pagesMessages);
  return (
    <Modal
      onClose={onClose}
      title={title}
      className="trace-drawer"
      overlayClassName="drawer-scrim"
    >
      <DialogPrimitive.Close
        className="icon-button drawer-close"
        aria-label={t("closeDetail")}
      >
        <X size={17} />
      </DialogPrimitive.Close>
      <span className="eyebrow">{eyebrow}</span>
      <h2 style={{ fontSize: 22, margin: "9px 0 6px" }}>{title}</h2>
      {meta && (
        <p style={{ color: "#6B7A8D", fontSize: 11, margin: 0 }}>{meta}</p>
      )}
      {children}
    </Modal>
  );
}

function TraceLine({ nodes }: { nodes: { title: string; detail: string }[] }) {
  return (
    <div className="trace-line">
      {nodes.map(node => (
        <div className="trace-node" key={node.title}>
          <h4>{node.title}</h4>
          <p>{node.detail}</p>
        </div>
      ))}
    </div>
  );
}

function RunDetail({ run, onClose }: { run: Run; onClose: () => void }) {
  const failed = run.status !== "passed";
  const { t, l } = useT(pagesMessages);
  return (
    <DetailDrawer
      onClose={onClose}
      eyebrow={t("runDetailEyebrow", { id: run.id })}
      title={run.title}
      meta={t("runMeta", {
        env: run.env,
        trigger: l(run.trigger),
        time: l(run.time),
      })}
    >
      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <StatusChip status={run.status} />
        <span className="tag">{t("passedCount", { pass: run.pass })}</span>
        <span className="tag">{run.duration}</span>
      </div>
      {run.trace ? (
        <TraceLine
          nodes={run.trace.map(node => ({
            title: l(node.title),
            detail: l(node.detail),
          }))}
        />
      ) : (
        <p className="subtext" style={{ margin: "24px 0" }}>
          {failed ? t("traceUnavailable") : t("allPassed")}
        </p>
      )}
      {failed && (
        <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
          <Button
            onClick={() =>
              toast(t("rerunQueued"), {
                description: t("rerunQueuedDesc", { id: run.id, env: run.env }),
              })
            }
            icon={<Play size={14} />}
          >
            {t("rerunFailed")}
          </Button>
          <Button
            primary
            onClick={() =>
              toast(t("bugAlreadyLinked"), {
                description: t("bugAlreadyLinkedDesc"),
              })
            }
            icon={<BugIcon />}
          >
            {t("createBug")}
          </Button>
        </div>
      )}
    </DetailDrawer>
  );
}

function BugIcon() {
  return <span style={{ fontSize: 14 }}>!</span>;
}
function UploadDialog({ onClose }: { onClose: () => void }) {
  const { t } = useT(pagesMessages);
  return (
    <Modal
      onClose={onClose}
      title={t("uploadTitle")}
      className="dialog-card"
      overlayClassName="dialog-backdrop"
    >
      <div>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">{t("prdIngestion")}</span>
            <h2>{t("uploadTitle")}</h2>
            <p>{t("uploadDesc")}</p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={t("close")}
          >
            <X size={17} />
          </button>
        </div>
        <div className="dropzone">
          <UploadCloud size={24} />
          <strong>{t("dropPrd")}</strong>
          <p>{t("fileTypes")}</p>
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button
            primary
            onClick={() => {
              onClose();
              toast(t("prdQueued"), {
                description: t("prdQueuedDesc"),
              });
            }}
            icon={<FileUp size={14} />}
          >
            {t("startExtraction")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
function RunDialog({ onClose }: { onClose: () => void }) {
  const { t } = useT(pagesMessages);
  return (
    <Modal
      onClose={onClose}
      title={t("runSmokeSuite")}
      className="dialog-card"
      overlayClassName="dialog-backdrop"
    >
      <div>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">{t("newTestRun")}</span>
            <h2>{t("runSmokeSuite")}</h2>
            <p>{t("runDialogDesc")}</p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={t("close")}
          >
            <X size={17} />
          </button>
        </div>
        <div
          className="module-grid"
          style={{ gridTemplateColumns: "1fr 1fr", marginTop: 4 }}
        >
          <label className="field-label">
            {t("fieldEnvironment")}
            <select className="filter-select">
              <option>staging</option>
              <option>dev</option>
            </select>
          </label>
          <label className="field-label">
            {t("fieldBrowser")}
            <select className="filter-select">
              <option>Chromium</option>
              <option>Firefox</option>
            </select>
          </label>
        </div>
        <div className="run-summary">
          <span>
            <ShieldCheck size={15} /> {t("eligibleTests", { count: 42 })}
          </span>
          <span>
            <Zap size={15} /> {t("workersRetry", { workers: 4, retries: 1 })}
          </span>
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button
            primary
            onClick={() => {
              onClose();
              toast(t("runQueued"), {
                description: t("runQueuedDesc"),
              });
            }}
            icon={<Play size={14} />}
          >
            {t("queueRun")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

type ModuleKind =
  | "requirements"
  | "test-cases"
  | "runs"
  | "reports"
  | "bugs"
  | "environments"
  | "integrations";

type FilterTab =
  | "all"
  | "needsCoverage"
  | "changed"
  | "covered"
  | "inReview"
  | "approved"
  | "manual"
  | "passed"
  | "failed"
  | "flaky";

const FILTER_TABS: Partial<Record<ModuleKind, FilterTab[]>> = {
  requirements: ["all", "needsCoverage", "changed", "covered"],
  "test-cases": ["all", "inReview", "approved", "manual"],
  runs: ["all", "passed", "failed", "flaky"],
};

const FILTER_TAB_LABELS: Record<FilterTab, PagesKey> = {
  all: "tabAll",
  needsCoverage: "tabNeedsCoverage",
  changed: "tabChanged",
  covered: "tabCovered",
  inReview: "tabInReview",
  approved: "tabApproved",
  manual: "tabManual",
  passed: "tabPassed",
  failed: "tabFailed",
  flaky: "tabFlaky",
};

function matchesTab(kind: ModuleKind, tab: FilterTab, item: any): boolean {
  if (tab === "all") return true;
  if (kind === "requirements") {
    if (tab === "needsCoverage") return item.coverage !== "covered";
    if (tab === "changed") return item.changed;
    return item.coverage === "covered";
  }
  if (kind === "test-cases") {
    if (tab === "inReview") return item.status === "review";
    if (tab === "approved") return item.status === "approved";
    return !item.automation;
  }
  return item.status === tab;
}

export function ModulePage({
  kind,
  selectedId,
}: {
  selectedId?: string;
  kind: ModuleKind;
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { t } = useT(pagesMessages);
  const [, navigate] = useLocation();
  const open = (id: string) => navigate(`/${kind}/${id}`);
  const close = () => navigate(`/${kind}`);
  const [dialog, setDialog] = useState<"prd" | "run" | null>(null);
  const config = {
    requirements: {
      title: t("titleRequirements"),
      eyebrow: t("eyebrowRequirements"),
      description: t("descRequirements"),
      cta: t("uploadPrd"),
      icon: FileTextIcon,
    },
    "test-cases": {
      title: t("titleTestCases"),
      eyebrow: t("eyebrowTestCases"),
      description: t("descTestCases"),
      cta: t("ctaGenerateTests"),
      icon: Layers3,
    },
    runs: {
      title: t("titleRuns"),
      eyebrow: t("eyebrowRuns"),
      description: t("descRuns"),
      cta: t("ctaRunSuite"),
      icon: Play,
    },
    reports: {
      title: t("titleReports"),
      eyebrow: t("eyebrowReports"),
      description: t("descReports"),
      cta: t("ctaExportReport"),
      icon: Download,
    },
    bugs: {
      title: t("titleBugs"),
      eyebrow: t("eyebrowBugs"),
      description: t("descBugs"),
      cta: t("createBug"),
      icon: BugIcon,
    },
    environments: {
      title: t("titleEnvironments"),
      eyebrow: t("eyebrowEnvironments"),
      description: t("descEnvironments"),
      cta: t("ctaAddEnvironment"),
      icon: ServerIcon,
    },
    integrations: {
      title: t("titleIntegrations"),
      eyebrow: t("eyebrowIntegrations"),
      description: t("descIntegrations"),
      cta: t("ctaAddIntegration"),
      icon: PlugIcon,
    },
  }[kind];
  const q = query.toLowerCase();
  const filterRows = <T extends { id: string; title: string }>(rows: T[]) =>
    rows.filter(
      item =>
        (item.title.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)) &&
        matchesTab(kind, activeTab, item)
    );
  const filteredReq = filterRows(requirements);
  const filteredTc = filterRows(testCases);
  const filteredRuns = filterRows(runs);
  const [shown, total] =
    kind === "requirements"
      ? [filteredReq.length, totals.requirements]
      : kind === "test-cases"
        ? [filteredTc.length, totals.testCases]
        : [filteredRuns.length, totals.runs];
  return (
    <AppShell
      title={config.title}
      eyebrow={config.eyebrow}
      action={
        <Button
          primary
          onClick={() =>
            kind === "requirements"
              ? setDialog("prd")
              : kind === "runs"
                ? setDialog("run")
                : toast(config.cta, {
                    description: t("actionPendingDesc"),
                  })
          }
          icon={<Plus size={15} />}
        >
          {config.cta}
        </Button>
      }
    >
      {kind === "reports" ? (
        <ReportsContent />
      ) : kind === "bugs" ? (
        <BugsContent onOpen={open} />
      ) : kind === "environments" ? (
        <EnvironmentsContent />
      ) : kind === "integrations" ? (
        <IntegrationsContent />
      ) : (
        <div className="page-card">
          <div className="filter-row">
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 10,
                  top: 10,
                  color: "#8A9891",
                }}
              />
              <input
                className="filter-input"
                style={{ paddingLeft: 31 }}
                placeholder={t("searchPlaceholder")}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            {(FILTER_TABS[kind] ?? (["all"] as FilterTab[])).map(tab => (
              <button
                key={tab}
                className={`filter-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {t(FILTER_TAB_LABELS[tab])}
              </button>
            ))}
            <button
              className="secondary-button"
              style={{ padding: "8px 10px" }}
              onClick={() =>
                toast(t("filters"), {
                  description: t("filtersDesc"),
                })
              }
            >
              <Filter size={14} /> {t("filters")}
            </button>
            <span className="filter-count">
              {t("filterCount", { shown, total })}
            </span>
          </div>
          {kind === "requirements" ? (
            <RequirementsTable rows={filteredReq} onOpen={open} />
          ) : kind === "test-cases" ? (
            <TestCaseTable rows={filteredTc} onOpen={open} />
          ) : (
            <RunTable rows={filteredRuns} onRow={run => open(run.id)} />
          )}
        </div>
      )}
      {selectedId && (
        <SelectedDetail kind={kind} id={selectedId} onClose={close} />
      )}
      {dialog === "prd" && <UploadDialog onClose={() => setDialog(null)} />}
      {dialog === "run" && <RunDialog onClose={() => setDialog(null)} />}
    </AppShell>
  );
}
function SelectedDetail({
  kind,
  id,
  onClose,
}: {
  kind: ModuleKind;
  id: string;
  onClose: () => void;
}) {
  const { t, l } = useT(pagesMessages);
  if (kind === "runs") {
    const run = runs.find(r => r.id === id);
    return run ? (
      <RunDetail run={run} onClose={onClose} />
    ) : (
      <NotFoundDrawer id={id} onClose={onClose} />
    );
  }
  if (kind === "requirements") {
    const req = requirements.find(r => r.id === id);
    if (!req) return <NotFoundDrawer id={id} onClose={onClose} />;
    const linked = testCases.filter(t => t.requirement === req.id);
    return (
      <DetailDrawer
        onClose={onClose}
        eyebrow={t("requirementEyebrow", { id: req.id })}
        title={req.title}
        meta={`${req.category} · ${req.source}${req.changed ? ` · ${t("changedInV12Meta")}` : ""}`}
      >
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <StatusChip status={req.coverage} />
          <span className={`tag ${req.priority.toLowerCase()}`}>
            {LEVEL_KEYS[req.priority]
              ? t(LEVEL_KEYS[req.priority])
              : req.priority}
          </span>
          <span className="tag">
            {t("testCasesCount", { count: req.tests })}
          </span>
        </div>
        <TraceLine
          nodes={
            linked.length
              ? linked.map(tc => ({
                  title: `${tc.id} · ${tc.title}`,
                  detail: t("tcTraceDetail", {
                    type: tc.type,
                    status:
                      tc.status === "approved"
                        ? t("tcStatusApproved")
                        : tc.status === "review"
                          ? t("tcStatusReview")
                          : tc.status,
                    steps: tc.steps,
                  }),
                }))
              : [
                  {
                    title: t("noTestCaseYet"),
                    detail: t("noTestCaseYetDetail"),
                  },
                ]
          }
        />
      </DetailDrawer>
    );
  }
  if (kind === "test-cases") {
    const tc = testCases.find(t => t.id === id);
    if (!tc) return <NotFoundDrawer id={id} onClose={onClose} />;
    return (
      <DetailDrawer
        onClose={onClose}
        eyebrow={t("testCaseEyebrow", { id: tc.id })}
        title={tc.title}
        meta={t("tcMeta", { suite: tc.suite, updated: l(tc.updated) })}
      >
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <StatusChip status={tc.status} />
          <span className="tag">{tc.type}</span>
          <span className="tag">
            {tc.automation ? t("automated") : t("manual")}
          </span>
        </div>
        <TraceLine
          nodes={[
            {
              title: t("requirementNode", { id: tc.requirement }),
              detail: t("linkedRequirement"),
            },
            { title: t("aiReason"), detail: l(tc.reason) },
            {
              title: t("stepsCount", { count: tc.steps }),
              detail: t("stepEditorSoon"),
            },
          ]}
        />
      </DetailDrawer>
    );
  }
  if (kind === "bugs") {
    const bug = bugs.find(b => b.id === id);
    if (!bug) return <NotFoundDrawer id={id} onClose={onClose} />;
    return (
      <DetailDrawer
        onClose={onClose}
        eyebrow={t("bugEyebrow", { id: bug.id })}
        title={bug.title}
        meta={t("bugMeta", {
          tracker: bug.tracker ?? t("trackerNotLinked"),
          lastSeen: l(bug.lastSeen),
        })}
      >
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <StatusChip status={bug.status} />
          <span className={`tag ${bug.severity.toLowerCase()}`}>
            {LEVEL_KEYS[bug.severity]
              ? t(LEVEL_KEYS[bug.severity])
              : bug.severity}
          </span>
          <span className="tag">
            {t("occurrencesCount", { count: bug.occurrences })}
          </span>
        </div>
        <TraceLine
          nodes={[
            {
              title: t("fingerprintNode", { fingerprint: bug.fingerprint }),
              detail: t("fingerprintMerged"),
            },
            {
              title: bug.tracker ?? t("trackerNotLinked"),
              detail: t("trackerSynced"),
            },
          ]}
        />
      </DetailDrawer>
    );
  }
  return null;
}

function NotFoundDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useT(pagesMessages);
  return (
    <DetailDrawer onClose={onClose} eyebrow={t("notFound")} title={id}>
      <p className="subtext" style={{ marginTop: 18 }}>
        {t("notFoundDesc")}
      </p>
    </DetailDrawer>
  );
}

function RequirementsTable({
  rows,
  onOpen,
}: {
  rows: typeof requirements;
  onOpen: (id: string) => void;
}) {
  const { t } = useT(pagesMessages);
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t("colRequirement")}</th>
          <th>{t("colCategory")}</th>
          <th>{t("colPriority")}</th>
          <th>{t("colCoverage")}</th>
          <th>{t("colTestCases")}</th>
          <th>{t("colSource")}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map(item => (
          <tr key={item.id} {...rowProps(() => onOpen(item.id))}>
            <td>
              <span className="id-code">{item.id}</span>
              <span className="row-title subtext">{item.title}</span>
              {item.changed && (
                <span className="subtext" style={{ color: "#A96D05" }}>
                  {t("changedInV12")}
                </span>
              )}
            </td>
            <td>{item.category}</td>
            <td>
              <span className={`tag ${item.priority.toLowerCase()}`}>
                {LEVEL_KEYS[item.priority]
                  ? t(LEVEL_KEYS[item.priority])
                  : item.priority}
              </span>
            </td>
            <td>
              <StatusChip status={item.coverage} />
            </td>
            <td>{item.tests}</td>
            <td>
              <span className="subtext">{item.source}</span>
            </td>
            <td>
              <ChevronRight size={15} color="#A7B1AC" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function TestCaseTable({
  rows,
  onOpen,
}: {
  rows: typeof testCases;
  onOpen: (id: string) => void;
}) {
  const { t, l } = useT(pagesMessages);
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t("colTestCase")}</th>
          <th>{t("colType")}</th>
          <th>{t("colStatus")}</th>
          <th>{t("colRequirement")}</th>
          <th>{t("colAutomation")}</th>
          <th>{t("colSteps")}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map(item => (
          <tr key={item.id} {...rowProps(() => onOpen(item.id))}>
            <td>
              <span className="id-code">{item.id}</span>
              <span className="row-title subtext">{item.title}</span>
              <span className="subtext">
                {t("aiReasonInline", { reason: l(item.reason) })}
              </span>
            </td>
            <td>
              <span className="tag">{item.type}</span>
            </td>
            <td>
              <StatusChip status={item.status} />
            </td>
            <td>
              <span className="id-code">{item.requirement}</span>
            </td>
            <td>
              {item.automation ? (
                <span className="status-chip status-lime">
                  {t("automationYes")}
                </span>
              ) : (
                <span className="tag">{t("automationManual")}</span>
              )}
            </td>
            <td>{item.steps}</td>
            <td>
              <ChevronRight size={15} color="#A7B1AC" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function ReportsContent() {
  const { t, l } = useT(pagesMessages);
  return (
    <>
      <div className="metric-grid">
        {metrics.slice(0, 3).map(m => (
          <div className="metric-card" key={m.label.en}>
            <div className="metric-label">{l(m.label)}</div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-foot">
              <em className={m.tone}>{m.delta}</em>
              <span className="metric-detail">{l(m.detail)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="panel">
        <SectionHeading
          title={t("qualityTrend")}
          detail={t("qualityTrendDetail")}
          action={
            <Button
              icon={<Download size={14} />}
              onClick={() =>
                toast(t("exportQueued"), {
                  description: t("exportQueuedDesc"),
                })
              }
            >
              {t("export")}
            </Button>
          }
        />
        <div className="chart-wrap" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <CartesianGrid
                vertical={false}
                stroke="#E8ECE8"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 9, fill: "#84918B" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#84918B" }}
                tickLine={false}
                axisLine={false}
              />
              <Area
                type="monotone"
                dataKey="pass"
                stroke="#6D9C25"
                fill="#EAF7D8"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
function BugsContent({ onOpen }: { onOpen: (id: string) => void }) {
  const [tab, setTab] = useState<"all" | "open" | "resolved">("open");
  const { t, l } = useT(pagesMessages);
  const unresolved = bugs.filter(b => b.status !== "resolved");
  const resolved = bugs.filter(b => b.status === "resolved");
  const rows =
    tab === "open" ? unresolved : tab === "resolved" ? resolved : bugs;
  const tabs = [
    { key: "open", label: t("bugTabOpen", { count: unresolved.length }) },
    {
      key: "resolved",
      label: t("bugTabResolved", { count: resolved.length }),
    },
    { key: "all", label: t("bugTabAll", { count: bugs.length }) },
  ] as const;
  return (
    <div className="page-card">
      <div className="filter-row">
        {tabs.map(item => (
          <button
            key={item.key}
            className={`filter-tab ${tab === item.key ? "active" : ""}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
        <span className="filter-count">{t("dedupOn")}</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>{t("colBug")}</th>
            <th>{t("colSeverity")}</th>
            <th>{t("colStatus")}</th>
            <th>{t("colFingerprint")}</th>
            <th>{t("colOccurrences")}</th>
            <th>{t("colTracker")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map(b => (
            <tr key={b.id} {...rowProps(() => onOpen(b.id))}>
              <td>
                <span className="id-code">{b.id}</span>
                <span className="row-title subtext">{b.title}</span>
                <span className="subtext">
                  {t("lastSeen", { time: l(b.lastSeen) })}
                </span>
              </td>
              <td>
                <span className={`tag ${b.severity.toLowerCase()}`}>
                  {LEVEL_KEYS[b.severity]
                    ? t(LEVEL_KEYS[b.severity])
                    : b.severity}
                </span>
              </td>
              <td>
                <StatusChip status={b.status} />
              </td>
              <td>
                <span className="id-code">{b.fingerprint}</span>
              </td>
              <td>{b.occurrences}×</td>
              <td>{b.tracker ?? t("trackerNotLinked")}</td>
              <td>
                <ChevronRight size={15} color="#A7B1AC" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function EnvironmentsContent() {
  const { t, l } = useT(pagesMessages);
  return (
    <div className="module-grid">
      {environments.map(env => (
        <div className="info-card" key={env.name}>
          <div className="info-top">
            <div className="info-icon">
              <ServerIcon />
            </div>
            <StatusChip status={env.production ? "review" : "passed"} />
          </div>
          <h3>{env.name}</h3>
          <p
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              marginBottom: 15,
            }}
          >
            {env.url}
          </p>
          <p>
            {t("allowedHosts", { count: env.hosts })}
            <br />
            {t("lastCheck", { time: l(env.last) })}
          </p>
          <div style={{ marginTop: 18, display: "flex", gap: 7 }}>
            <Button
              onClick={() =>
                toast(t("connectionTest"), {
                  description: t("connectionHealthy", { env: env.name }),
                })
              }
            >
              {t("testConnection")}
            </Button>
            {env.production && (
              <span
                className="tag high"
                style={{ display: "flex", alignItems: "center" }}
              >
                {l(env.status)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
function IntegrationsContent() {
  const { t } = useT(pagesMessages);
  return (
    <div className="module-grid">
      <div className="info-card">
        <div className="info-top">
          <div className="info-icon">
            <GitBranch size={16} />
          </div>
          <StatusChip status="passed" />
        </div>
        <h3>Jira Software</h3>
        <p>{t("jiraDesc")}</p>
        <div style={{ marginTop: 18 }}>
          <Button
            onClick={() =>
              toast(t("jiraMapping"), {
                description: t("jiraMappingDesc"),
              })
            }
          >
            {t("configureMapping")}
          </Button>
        </div>
      </div>
      <div className="info-card">
        <div className="info-top">
          <div
            className="info-icon"
            style={{ background: "#EAF0FF", color: "#5274B8" }}
          >
            <PlugIcon />
          </div>
          <span className="tag">{t("notConnected")}</span>
        </div>
        <h3>ClickUp</h3>
        <p>{t("clickupDesc")}</p>
        <div style={{ marginTop: 18 }}>
          <Button
            primary
            onClick={() =>
              toast(t("integrationSetup"), {
                description: t("oauthSoon"),
              })
            }
          >
            {t("connectClickup")}
          </Button>
        </div>
      </div>
      <div className="info-card">
        <div className="info-top">
          <div
            className="info-icon"
            style={{ background: "#FFF5DF", color: "#A96D05" }}
          >
            <BellIcon />
          </div>
          <span className="tag">{t("optional")}</span>
        </div>
        <h3>{t("notificationsTitle")}</h3>
        <p>{t("notificationsDesc")}</p>
        <div style={{ marginTop: 18 }}>
          <Button
            onClick={() =>
              toast(t("notificationsTitle"), {
                description: t("notificationsToastDesc"),
              })
            }
          >
            {t("addChannel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
function FileTextIcon() {
  return <FileUp size={16} />;
}
function ServerIcon() {
  return <ServerIconBase />;
}
function ServerIconBase() {
  return <CircleHelp size={16} />;
}
function PlugIcon() {
  return <GitBranch size={16} />;
}
function BellIcon() {
  return <CircleHelp size={16} />;
}
