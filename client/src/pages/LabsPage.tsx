import { useState } from "react";
import {
  AppShell,
  SectionHeading,
  StatusChip,
} from "@/components/qaflow/AppShell";
import {
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Copy,
  Database,
  FileJson,
  History,
  Play,
  Plus,
  RefreshCcw,
  Save,
  Send,
  ShieldCheck,
  Table2,
  Trash2,
  Workflow,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/i18n";
import { labsMessages } from "@/i18n/messages/labs";

type LabKind = "api" | "db";
type ApiTab = "request" | "assertions" | "variables";
type DbTab = "query" | "assertions" | "schema";
type LabTab = ApiTab | DbTab;
type LabsKey = keyof (typeof labsMessages)["en"];

const apiExamples = [
  {
    method: "GET",
    path: "/api/v1/orders?status=paid",
    nameKey: "reqListPaidOrders" as LabsKey,
    status: "200 OK",
    time: "184 ms",
  },
  {
    method: "POST",
    path: "/api/v1/orders",
    nameKey: "reqCreateOrder" as LabsKey,
    status: "201 Created",
    time: "312 ms",
  },
  {
    method: "PATCH",
    path: "/api/v1/orders/:id",
    nameKey: "reqUpdateOrderStatus" as LabsKey,
    status: "200 OK",
    time: "228 ms",
  },
];

const dbRows = [
  {
    id: "ord_1042",
    email: "alya@shopco.id",
    status: "paid",
    total: "Rp 428.000",
    created: "2026-10-06 14:22",
  },
  {
    id: "ord_1041",
    email: "raka@shopco.id",
    status: "paid",
    total: "Rp 182.000",
    created: "2026-10-06 14:11",
  },
  {
    id: "ord_1039",
    email: "nina@shopco.id",
    status: "pending",
    total: "Rp 96.500",
    created: "2026-10-06 13:54",
  },
  {
    id: "ord_1038",
    email: "bima@shopco.id",
    status: "cancelled",
    total: "Rp 1.240.000",
    created: "2026-10-06 13:38",
  },
];

export function LabsPage({ kind }: { kind: LabKind }) {
  const { t } = useT(labsMessages);
  const [activeTab, setActiveTab] = useState<LabTab>(
    kind === "api" ? "request" : "query"
  );
  const [apiStatus, setApiStatus] = useState<"idle" | "running" | "done">(
    "idle"
  );
  const [apiResponse, setApiResponse] = useState("{");
  const [sql, setSql] = useState(
    "SELECT\n  id, email, status, total, created_at\nFROM orders\nWHERE status = 'paid'\nORDER BY created_at DESC\nLIMIT 50;"
  );
  const [dbRan, setDbRan] = useState(false);
  const isApi = kind === "api";
  const title = isApi ? t("titleApi") : t("titleDb");
  const eyebrow = isApi ? t("eyebrowApi") : t("eyebrowDb");
  return (
    <AppShell
      title={title}
      eyebrow={eyebrow}
      action={
        <>
          <button
            className="secondary-button"
            onClick={() =>
              toast(t("savedScenariosToast"), {
                description: isApi
                  ? t("savedScenariosApiDesc")
                  : t("savedScenariosDbDesc"),
              })
            }
          >
            <History size={14} /> {t("history")}
          </button>
          <button
            className="primary-button"
            onClick={() =>
              toast(isApi ? t("requestSavedToast") : t("querySavedToast"), {
                description: t("scenarioSavedDesc"),
              })
            }
          >
            <Save size={14} /> {t("saveScenario")}
          </button>
        </>
      }
    >
      <div className="lab-toolbar">
        <div className="lab-intro">
          <div className={`lab-icon ${isApi ? "api" : "db"}`}>
            {isApi ? <Workflow size={19} /> : <Database size={19} />}
          </div>
          <div>
            <h2>{isApi ? t("introApiTitle") : t("introDbTitle")}</h2>
            <p>{isApi ? t("introApiDesc") : t("introDbDesc")}</p>
          </div>
        </div>
        <label className="lab-select-label">
          {t("environment")}
          <select className="filter-select">
            <option>staging · shopco</option>
            <option>dev · shopco</option>
            <option>production · {t("envProtected")}</option>
          </select>
        </label>
      </div>
      {isApi ? (
        <ApiWorkspace
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          status={apiStatus}
          setStatus={setApiStatus}
          response={apiResponse}
          setResponse={setApiResponse}
        />
      ) : (
        <DbWorkspace
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sql={sql}
          setSql={setSql}
          ran={dbRan}
          setRan={setDbRan}
        />
      )}
    </AppShell>
  );
}

function LabTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="lab-tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={active === tab.key ? "active" : ""}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ApiWorkspace({
  activeTab,
  setActiveTab,
  status,
  setStatus,
  response,
  setResponse,
}: {
  activeTab: LabTab;
  setActiveTab: (value: LabTab) => void;
  status: "idle" | "running" | "done";
  setStatus: (value: "idle" | "running" | "done") => void;
  response: string;
  setResponse: (value: string) => void;
}) {
  const { t } = useT(labsMessages);
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([
    { key: "Accept", value: "application/json", on: true },
    { key: "X-QA-Run", value: "manual", on: true },
  ]);
  const hasBody = method === "POST" || method === "PATCH";
  const updateHeader = (
    index: number,
    patch: Partial<(typeof headers)[number]>
  ) =>
    setHeaders(rows =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  const run = () => {
    setStatus("running");
    setTimeout(() => {
      setStatus("done");
      setResponse(
        JSON.stringify(
          {
            data: [{ id: "ord_1042", status: "paid", total: 428000 }],
            meta: { page: 1, total: 142 },
            requestId: "req_01HXY",
          },
          null,
          2
        )
      );
      toast(t("requestPassedToast"), {
        description: t("requestPassedDesc"),
      });
    }, 480);
  };
  return (
    <div className="lab-layout">
      <div className="lab-main panel">
        <div className="lab-panel-header">
          <div>
            <span className="eyebrow">{t("requestBuilder")}</span>
            <h2>{t("reqListPaidOrders")}</h2>
          </div>
          <div className="lab-header-actions">
            <span className="tag">{t("savedInCheckout")}</span>
            <button
              className="icon-button"
              aria-label={t("moreRequestActions")}
            >
              <Code2 size={16} />
            </button>
          </div>
        </div>
        <LabTabs
          tabs={[
            { key: "request", label: t("tabRequest") },
            { key: "assertions", label: t("tabAssertions") },
            { key: "variables", label: t("tabVariables") },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === "request" ? (
          <>
            <div className="request-line">
              <select
                className="method-select"
                value={method}
                onChange={e => setMethod(e.target.value)}
                aria-label={t("httpMethod")}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
              <input
                className="url-input"
                defaultValue="https://staging.shopco.id/api/v1/orders?status=paid"
                aria-label={t("requestUrl")}
              />
              <button
                className="primary-button send-button"
                onClick={run}
                disabled={status === "running"}
              >
                {status === "running" ? (
                  <RefreshCcw size={14} className="spin" />
                ) : (
                  <Send size={14} />
                )}{" "}
                {status === "running" ? t("sending") : t("send")}
              </button>
            </div>
            <div className="request-grid">
              <div>
                <label className="field-label">
                  {t("authorization")}
                  <select className="filter-select">
                    <option>{t("authBearer")}</option>
                    <option>{t("authApiKey")}</option>
                    <option>{t("authNone")}</option>
                  </select>
                </label>
                <div className="field-label">
                  {t("headers")}
                  <div className="kv-table">
                    {headers.map((row, i) => (
                      <div className="kv-row" key={i}>
                        <input
                          type="checkbox"
                          checked={row.on}
                          onChange={e =>
                            updateHeader(i, { on: e.target.checked })
                          }
                          aria-label={t("enableHeader", {
                            name: row.key || i + 1,
                          })}
                        />
                        <input
                          className="filter-input"
                          value={row.key}
                          placeholder={t("headerPlaceholder")}
                          onChange={e =>
                            updateHeader(i, { key: e.target.value })
                          }
                          aria-label={t("headerName")}
                        />
                        <input
                          className="filter-input"
                          value={row.value}
                          placeholder={t("valuePlaceholder")}
                          onChange={e =>
                            updateHeader(i, { value: e.target.value })
                          }
                          aria-label={t("headerValue")}
                        />
                        <button
                          className="icon-button"
                          aria-label={t("removeHeader")}
                          onClick={() =>
                            setHeaders(rows => rows.filter((_, j) => j !== i))
                          }
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="text-link"
                      onClick={() =>
                        setHeaders(rows => [
                          ...rows,
                          { key: "", value: "", on: true },
                        ])
                      }
                    >
                      {t("addHeader")}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="field-label">
                  {t("body")} <span className="field-muted">JSON</span>
                  {hasBody ? (
                    <textarea
                      className="code-field"
                      defaultValue={'{\n  "status": "paid"\n}'}
                    />
                  ) : (
                    <span className="code-field body-disabled">
                      {t("noBody", { method })}
                    </span>
                  )}
                </label>
              </div>
            </div>
          </>
        ) : activeTab === "assertions" ? (
          <AssertionsPanel />
        ) : (
          <VariablesPanel />
        )}
        <ResponsePanel status={status} response={response} />
      </div>
      <aside className="lab-side">
        <SectionHeading
          title={t("savedRequests")}
          detail={t("savedRequestsDetail")}
          action={
            <button className="icon-button" aria-label={t("addRequest")}>
              <Plus size={15} />
            </button>
          }
        />
        {apiExamples.map((example, index) => (
          <button
            className={`saved-item ${index === 0 ? "selected" : ""}`}
            key={example.path}
          >
            <span className={`method-pill ${example.method.toLowerCase()}`}>
              {example.method}
            </span>
            <span>
              <strong>{t(example.nameKey)}</strong>
              <small>{example.path}</small>
            </span>
            <StatusChip status="passed" />
          </button>
        ))}
        <div className="safe-note">
          <ShieldCheck size={16} />
          <div>
            <strong>{t("safeByDefault")}</strong>
            <p>{t("safeByDefaultDesc")}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function AssertionsPanel() {
  const { t } = useT(labsMessages);
  return (
    <div className="assertions-panel">
      <div className="assertion-row">
        <Check size={15} />
        <span>{t("statusCodeEquals")}</span>
        <select className="filter-select">
          <option>200</option>
          <option>201</option>
          <option>204</option>
        </select>
        <button className="icon-button" aria-label={t("removeAssertion")}>
          <Trash2 size={14} />
        </button>
      </div>
      <div className="assertion-row">
        <Check size={15} />
        <span>{t("responseTimeLessThan")}</span>
        <input className="small-input" defaultValue="500" />
        <span>ms</span>
        <button className="icon-button" aria-label={t("removeAssertion")}>
          <Trash2 size={14} />
        </button>
      </div>
      <div className="assertion-row">
        <Check size={15} />
        <span>{t("jsonPathExists")}</span>
        <input className="assertion-input" defaultValue="$.data[*].id" />
        <button className="icon-button" aria-label={t("removeAssertion")}>
          <Trash2 size={14} />
        </button>
      </div>
      <button className="secondary-button" style={{ marginTop: 14 }}>
        <Plus size={14} /> {t("addAssertion")}
      </button>
    </div>
  );
}
function VariablesPanel() {
  const { t } = useT(labsMessages);
  return (
    <div className="variables-panel">
      <p className="subtext">
        {t("variablesHintBefore")} <code>{"{{env.baseUrl}}"}</code>{" "}
        {t("variablesHintOr")} <code>{"{{vars.orderId}}"}</code>
        {t("variablesHintAfter")}
      </p>
      <div className="variable-row">
        <span className="id-code">baseUrl</span>
        <input
          className="assertion-input"
          defaultValue="https://staging.shopco.id"
        />
      </div>
      <div className="variable-row">
        <span className="id-code">orderId</span>
        <input className="assertion-input" defaultValue="ord_1042" />
      </div>
      <button className="secondary-button" style={{ marginTop: 14 }}>
        <Plus size={14} /> {t("addVariable")}
      </button>
    </div>
  );
}
function ResponsePanel({
  status,
  response,
}: {
  status: "idle" | "running" | "done";
  response: string;
}) {
  const { t } = useT(labsMessages);
  return (
    <div className="response-panel">
      <div className="response-head">
        <div>
          <span className="eyebrow">{t("response")}</span>
          <h3>
            {status === "idle"
              ? t("responseIdle")
              : status === "running"
                ? t("responseWaiting")
                : "200 OK"}
          </h3>
        </div>
        <div className="response-meta">
          {status === "done" && (
            <>
              <span className="status-chip status-lime">{t("pass")}</span>
              <span>
                <Clock3 size={12} />
                184 ms
              </span>
              <span>1.2 KB</span>
            </>
          )}
          {status === "done" && (
            <button
              className="icon-button"
              aria-label={t("copyResponse")}
              onClick={() => {
                void navigator.clipboard?.writeText(response);
                toast(t("responseCopied"));
              }}
            >
              <Copy size={14} />
            </button>
          )}
        </div>
      </div>
      {status === "idle" ? (
        <div className="response-empty">
          <FileJson size={24} />
          <p>{t("responseEmpty")}</p>
        </div>
      ) : (
        <pre className="response-code">
          {status === "running" ? t("sendingRequest") : response}
        </pre>
      )}
    </div>
  );
}

function DbWorkspace({
  activeTab,
  setActiveTab,
  sql,
  setSql,
  ran,
  setRan,
}: {
  activeTab: LabTab;
  setActiveTab: (value: LabTab) => void;
  sql: string;
  setSql: (value: string) => void;
  ran: boolean;
  setRan: (value: boolean) => void;
}) {
  const { t } = useT(labsMessages);
  return (
    <div className="lab-layout">
      <div className="lab-main panel">
        <div className="lab-panel-header">
          <div>
            <span className="eyebrow">{t("queryConsole")}</span>
            <h2>{t("ordersValidation")}</h2>
          </div>
          <div className="lab-header-actions">
            <span className="status-chip status-lime">
              <i />
              {t("readOnly")}
            </span>
            <button className="icon-button" aria-label={t("moreQueryActions")}>
              <Code2 size={16} />
            </button>
          </div>
        </div>
        <LabTabs
          tabs={[
            { key: "query", label: t("tabQuery") },
            { key: "assertions", label: t("tabAssertions") },
            { key: "schema", label: t("tabSchema") },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === "query" ? (
          <>
            <div className="sql-toolbar">
              <select
                className="method-select"
                aria-label={t("databaseEngine")}
              >
                <option>PostgreSQL</option>
                <option>MySQL</option>
                <option>MongoDB</option>
              </select>
              <span className="tag">qa_readonly@staging</span>
              <span className="toolbar-spacer" />
              <button
                className="secondary-button"
                onClick={() =>
                  toast(t("queryValidToast"), {
                    description: t("queryValidDesc"),
                  })
                }
              >
                <ShieldCheck size={14} /> {t("validate")}
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  setRan(true);
                  toast(t("queryExecutedToast"), {
                    description: t("queryExecutedDesc"),
                  });
                }}
              >
                <Play size={14} /> {t("runQuery")}
              </button>
            </div>
            <textarea
              className="sql-editor"
              value={sql}
              onChange={e => setSql(e.target.value)}
              spellCheck={false}
              aria-label={t("sqlEditor")}
            />
            {ran ? (
              <DbResult />
            ) : (
              <div className="query-hint">
                <ShieldCheck size={15} />
                <span>{t("sqlGuard")}</span>
              </div>
            )}
          </>
        ) : activeTab === "assertions" ? (
          <DbAssertions />
        ) : (
          <SchemaPanel />
        )}
      </div>
      <aside className="lab-side">
        <SectionHeading
          title={t("savedQueries")}
          detail={t("savedQueriesDetail")}
          action={
            <button className="icon-button" aria-label={t("addQuery")}>
              <Plus size={15} />
            </button>
          }
        />
        {(
          [
            "qPaidOrdersEmail",
            "qNoOrphanItems",
            "qUniquePaymentRef",
            "qTotalsMatchItems",
          ] as const
        ).map((name, index) => (
          <button
            className={`saved-item ${index === 0 ? "selected" : ""}`}
            key={name}
          >
            <span className="method-pill sql">
              <Database size={13} />
            </span>
            <span>
              <strong>{t(name)}</strong>
              <small>
                {index === 0 ? t("queryFirstSub") : t("querySavedSub")}
              </small>
            </span>
            <span className="tag">SQL</span>
          </button>
        ))}
        <div className="safe-note">
          <ShieldCheck size={16} />
          <div>
            <strong>{t("productionProtected")}</strong>
            <p>{t("productionProtectedDesc")}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
function DbResult() {
  const { t } = useT(labsMessages);
  return (
    <div className="db-result">
      <div className="result-toolbar">
        <span>
          <strong>{t("rowsCount", { count: dbRows.length })}</strong> · 42 ms
        </span>
        <span className="status-chip status-lime">{t("queryPassed")}</span>
        <button className="icon-button" aria-label={t("copyResult")}>
          <Copy size={14} />
        </button>
      </div>
      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>id</th>
              <th>email</th>
              <th>status</th>
              <th>total</th>
              <th>created_at</th>
            </tr>
          </thead>
          <tbody>
            {dbRows.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.email}</td>
                <td>
                  <span
                    className={`tag ${row.status === "paid" ? "" : "medium"}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td>{row.total}</td>
                <td>{row.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function DbAssertions() {
  const { t } = useT(labsMessages);
  return (
    <div className="assertions-panel">
      <div className="assertion-row">
        <Check size={15} />
        <span>{t("rowCountEquals")}</span>
        <input className="small-input" defaultValue="4" />
        <button className="icon-button" aria-label={t("removeAssertion")}>
          <Trash2 size={14} />
        </button>
      </div>
      <div className="assertion-row">
        <Check size={15} />
        <span>{t("column")}</span>
        <select className="filter-select">
          <option>status</option>
          <option>total</option>
          <option>email</option>
        </select>
        <span>{t("contains")}</span>
        <input className="assertion-input" defaultValue="paid" />
        <button className="icon-button" aria-label={t("removeAssertion")}>
          <Trash2 size={14} />
        </button>
      </div>
      <button className="secondary-button" style={{ marginTop: 14 }}>
        <Plus size={14} /> {t("addAssertion")}
      </button>
    </div>
  );
}
function SchemaPanel() {
  return (
    <div className="schema-panel">
      <div className="schema-table">
        <div className="schema-title">
          <Table2 size={15} /> public.orders
        </div>
        {[
          "id uuid PRIMARY KEY",
          "email varchar(255)",
          "status order_status",
          "total integer",
          "created_at timestamptz",
        ].map(field => (
          <div className="schema-field" key={field}>
            <Code2 size={12} />
            <span>{field}</span>
          </div>
        ))}
      </div>
      <div className="schema-table">
        <div className="schema-title">
          <Table2 size={15} /> public.order_items
        </div>
        {[
          "id uuid PRIMARY KEY",
          "order_id uuid FK",
          "sku varchar(64)",
          "quantity integer",
          "unit_price integer",
        ].map(field => (
          <div className="schema-field" key={field}>
            <Code2 size={12} />
            <span>{field}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
