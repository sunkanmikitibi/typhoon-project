'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  Shield,
  Database,
  Cpu,
  Globe,
  ArrowDownUp,
  FileText,
  Monitor,
  Zap,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type StepStatus = 'idle' | 'running' | 'success' | 'error';
type RailType = 'SWIFT' | 'SEPA' | 'POS' | 'CARD' | 'CRYPTO';
type ScenarioType = 'success' | 'validation_fail' | 'processor_fail';

interface Step {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  layer: 'ui' | 'middleware' | 'ebanq' | 'processor' | 'rail';
  duration: number; // ms
  mockLog: (ctx: SimContext) => string;
}

interface SimContext {
  txId: string;
  amount: string;
  currency: string;
  rail: RailType;
  scenario: ScenarioType;
  sender: string;
  receiver: string;
}

// ─── Mock data helpers ────────────────────────────────────────────────────────

function genTxId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'TXN-';
  for (let i = 0; i < 12; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

const RAIL_COLORS: Record<RailType, string> = {
  SWIFT: 'text-blue-400',
  SEPA: 'text-violet-400',
  POS: 'text-amber-400',
  CARD: 'text-emerald-400',
  CRYPTO: 'text-orange-400',
};

const RAIL_BG: Record<RailType, string> = {
  SWIFT: 'bg-blue-400/10 border-blue-400/25',
  SEPA: 'bg-violet-400/10 border-violet-400/25',
  POS: 'bg-amber-400/10 border-amber-400/25',
  CARD: 'bg-emerald-400/10 border-emerald-400/25',
  CRYPTO: 'bg-orange-400/10 border-orange-400/25',
};

const LAYER_COLORS: Record<Step['layer'], string> = {
  ui: 'border-primary/40 bg-primary/5',
  middleware: 'border-violet-500/40 bg-violet-500/5',
  ebanq: 'border-cyan-500/40 bg-cyan-500/5',
  processor: 'border-amber-500/40 bg-amber-500/5',
  rail: 'border-emerald-500/40 bg-emerald-500/5',
};

const LAYER_LABEL_COLORS: Record<Step['layer'], string> = {
  ui: 'text-primary',
  middleware: 'text-violet-400',
  ebanq: 'text-cyan-400',
  processor: 'text-amber-400',
  rail: 'text-emerald-400',
};

const LAYER_NAMES: Record<Step['layer'], string> = {
  ui: 'Typhoon UI',
  middleware: 'Middleware',
  ebanq: 'Ebanq Core',
  processor: 'Processor Bridge',
  rail: 'Payment Rail',
};

// ─── Steps definition ─────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    id: 1,
    label: 'User Initiates Transaction',
    sublabel: 'Typhoon UI → Middleware',
    icon: Monitor,
    layer: 'ui',
    duration: 900,
    mockLog: (ctx) =>
      `[UI] POST /api/v1/transactions — txId=${ctx.txId} amount=${ctx.amount} ${ctx.currency} rail=${ctx.rail} sender=${ctx.sender} receiver=${ctx.receiver}`,
  },
  {
    id: 2,
    label: 'Middleware Validates Request',
    sublabel: 'Schema · Auth · Rate-limit',
    icon: Shield,
    layer: 'middleware',
    duration: 700,
    mockLog: (ctx) =>
      ctx.scenario === 'validation_fail'
        ? `[MIDDLEWARE] VALIDATION FAILED — txId=${ctx.txId} reason="Amount exceeds daily limit ($50,000)" code=ERR_LIMIT_EXCEEDED`
        : `[MIDDLEWARE] Validation OK — txId=${ctx.txId} schema=valid auth=JWT_OK rate_limit=OK AML_score=0.12`,
  },
  {
    id: 3,
    label: 'Middleware Checks Ebanq',
    sublabel: 'User · Account · Ledger',
    icon: Database,
    layer: 'ebanq',
    duration: 800,
    mockLog: (ctx) =>
      `[EBANQ] Account lookup OK — userId=USR-${ctx.sender.replace(/\s/g, '')} balance=${ctx.currency} ${(parseFloat(ctx.amount.replace(/,/g, '')) * 2.4).toFixed(2)} ledger=ACTIVE kyc=VERIFIED`,
  },
  {
    id: 4,
    label: 'Payment Instruction Sent',
    sublabel: 'Middleware → Processor Bridge',
    icon: Cpu,
    layer: 'processor',
    duration: 600,
    mockLog: (ctx) =>
      `[PROCESSOR_BRIDGE] Instruction dispatched — txId=${ctx.txId} rail=${ctx.rail} priority=NORMAL routing_code=${ctx.rail === 'SWIFT' ? 'BIC:TYPHGB2L' : ctx.rail === 'SEPA' ? 'IBAN:DE89370400440532013000' : 'TERM:POS-4421'}`,
  },
  {
    id: 5,
    label: `Sent to ${'{rail}'} Rail`,
    sublabel: 'Processor → External Network',
    icon: Globe,
    layer: 'rail',
    duration: 1200,
    mockLog: (ctx) =>
      ctx.scenario === 'processor_fail'
        ? `[${ctx.rail}_RAIL] NETWORK ERROR — txId=${ctx.txId} code=ERR_TIMEOUT msg="Downstream network unreachable after 3 retries"`
        : `[${ctx.rail}_RAIL] Submitted — txId=${ctx.txId} network_ref=NET-${ctx.txId.slice(-6)} status=PENDING_CONFIRM`,
  },
  {
    id: 6,
    label: 'Processor Returns Status',
    sublabel: 'Rail ACK → Processor Bridge',
    icon: ArrowDownUp,
    layer: 'processor',
    duration: 700,
    mockLog: (ctx) =>
      ctx.scenario === 'processor_fail'
        ? `[PROCESSOR_BRIDGE] Status=FAILED — txId=${ctx.txId} retries=3 escalated=true`
        : `[PROCESSOR_BRIDGE] Status=SETTLED — txId=${ctx.txId} settlement_ref=STL-${ctx.txId.slice(-8)} cleared_at=${new Date().toISOString()}`,
  },
  {
    id: 7,
    label: 'Middleware Updates Ebanq',
    sublabel: 'Ledger · Audit Log',
    icon: FileText,
    layer: 'ebanq',
    duration: 600,
    mockLog: (ctx) =>
      ctx.scenario === 'processor_fail'
        ? `[EBANQ] Ledger REVERSED — txId=${ctx.txId} reason=PROCESSOR_FAIL audit_entry=AUD-${ctx.txId.slice(-6)} status=ROLLED_BACK`
        : `[EBANQ] Ledger DEBITED — txId=${ctx.txId} debit=${ctx.amount} ${ctx.currency} audit_entry=AUD-${ctx.txId.slice(-6)} status=POSTED`,
  },
  {
    id: 8,
    label: 'Typhoon UI Shows Result',
    sublabel: 'Final status rendered',
    icon: Zap,
    layer: 'ui',
    duration: 500,
    mockLog: (ctx) => {
      const failed = ctx.scenario !== 'success';
      return `[UI] Transaction ${failed ? 'FAILED' : 'COMPLETE'} — txId=${ctx.txId} status=${failed ? 'FAILED' : 'SETTLED'} displayed_to=${ctx.sender}`;
    },
  },
];

// ─── Scenario configs ─────────────────────────────────────────────────────────

const SCENARIOS: { value: ScenarioType; label: string; desc: string; color: string }[] = [
  {
    value: 'success',
    label: 'Happy Path',
    desc: 'All steps succeed, transaction settles',
    color: 'text-emerald-400',
  },
  {
    value: 'validation_fail',
    label: 'Validation Fail',
    desc: 'Middleware rejects at step 2',
    color: 'text-danger',
  },
  {
    value: 'processor_fail',
    label: 'Processor Fail',
    desc: 'Rail timeout at step 5, rollback',
    color: 'text-warning',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransactionFlowSimulator() {
  const [statuses, setStatuses] = useState<StepStatus[]>(Array(8).fill('idle'));
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [scenario, setScenario] = useState<ScenarioType>('success');
  const [rail, setRail] = useState<RailType>('SWIFT');
  const [amount, setAmount] = useState('12,500.00');
  const [currency, setCurrency] = useState('USD');
  const logsEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setStatuses(Array(8).fill('idle'));
    setLogs([]);
    setRunning(false);
    setDone(false);
    setActiveStep(-1);
  }, []);

  const run = useCallback(async () => {
    abortRef.current = false;
    reset();
    // tiny delay so reset flushes
    await new Promise((r) => setTimeout(r, 50));
    if (abortRef.current) return;

    const ctx: SimContext = {
      txId: genTxId(),
      amount,
      currency,
      rail,
      scenario,
      sender: 'Marcus Reid',
      receiver: 'Apex Capital GmbH',
    };

    setRunning(true);
    setDone(false);

    // Determine which step fails (0-indexed)
    const failAt = scenario === 'validation_fail' ? 1 : scenario === 'processor_fail' ? 4 : -1;

    for (let i = 0; i < STEPS.length; i++) {
      if (abortRef.current) return;

      const step = STEPS[i];
      setActiveStep(i);
      setStatuses((prev) => {
        const next = [...prev];
        next[i] = 'running';
        return next;
      });

      await new Promise((r) => setTimeout(r, step.duration));
      if (abortRef.current) return;

      const isError = i === failAt;
      setStatuses((prev) => {
        const next = [...prev];
        next[i] = isError ? 'error' : 'success';
        return next;
      });

      const logLine = step.mockLog(ctx);
      setLogs((prev) => [...prev, logLine]);

      if (isError) {
        // Mark remaining as idle (already are), stop
        break;
      }

      await new Promise((r) => setTimeout(r, 120));
    }

    setRunning(false);
    setDone(true);
    setActiveStep(-1);
  }, [reset, amount, currency, rail, scenario]);

  const finalStatus = done ? (statuses.some((s) => s === 'error') ? 'error' : 'success') : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* ── Left: Config panel ── */}
      <div className="xl:col-span-2 space-y-4">
        {/* Transaction config */}
        <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-600 text-white">Transaction Config</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-500 text-muted-foreground uppercase tracking-wider">
                Amount
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={running}
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-muted-foreground focus:outline-none focus:border-primary/60 disabled:opacity-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-500 text-muted-foreground uppercase tracking-wider">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={running}
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/60 disabled:opacity-50"
              >
                {['USD', 'EUR', 'GBP', 'CHF', 'BTC', 'ETH'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rail selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-500 text-muted-foreground uppercase tracking-wider">
              Payment Rail
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['SWIFT', 'SEPA', 'POS', 'CARD', 'CRYPTO'] as RailType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRail(r)}
                  disabled={running}
                  className={`py-1.5 rounded-lg border text-[11px] font-600 transition-all duration-150 disabled:opacity-50 ${
                    rail === r
                      ? `${RAIL_BG[r]} ${RAIL_COLORS[r]}`
                      : 'border-border bg-surface-elevated text-muted-foreground hover:text-white hover:border-border/80'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-500 text-muted-foreground uppercase tracking-wider">
              Scenario
            </label>
            <div className="space-y-1.5">
              {SCENARIOS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setScenario(s.value)}
                  disabled={running}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-150 disabled:opacity-50 ${
                    scenario === s.value
                      ? 'border-primary/40 bg-primary/8'
                      : 'border-border bg-surface-elevated hover:border-border/80'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                      s.value === 'success'
                        ? 'bg-emerald-400'
                        : s.value === 'validation_fail'
                          ? 'bg-danger'
                          : 'bg-warning'
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs font-600 ${scenario === s.value ? s.color : 'text-white'}`}
                    >
                      {s.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={run}
              disabled={running}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {running ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play size={15} />
                  Run Simulation
                </>
              )}
            </button>
            <button
              onClick={reset}
              disabled={running}
              className="px-3 py-2.5 rounded-lg border border-border bg-surface-elevated text-muted-foreground hover:text-white hover:border-border/80 disabled:opacity-50 transition-all duration-150"
              title="Reset"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Layer legend */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
          <h2 className="text-[11px] font-600 text-muted-foreground uppercase tracking-wider">
            Layer Legend
          </h2>
          <div className="space-y-1.5">
            {(Object.keys(LAYER_NAMES) as Step['layer'][]).map((l) => (
              <div
                key={l}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border ${LAYER_COLORS[l]}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${LAYER_LABEL_COLORS[l].replace('text-', 'bg-')}`}
                />
                <span className={`text-xs font-500 ${LAYER_LABEL_COLORS[l]}`}>
                  {LAYER_NAMES[l]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Flow + Logs ── */}
      <div className="xl:col-span-3 space-y-4">
        {/* Flow steps */}
        <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-600 text-white">Transaction Pipeline</h2>
            {done && finalStatus && (
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-600 border ${
                  finalStatus === 'success'
                    ? 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400'
                    : 'bg-danger/10 border-danger/25 text-danger'
                }`}
              >
                {finalStatus === 'success' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {finalStatus === 'success' ? 'Settled' : 'Failed'}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {STEPS.map((step, idx) => {
              const status = statuses[idx];
              const isActive = activeStep === idx;
              const StepIcon = step.icon;
              const layerColor = LAYER_LABEL_COLORS[step.layer];
              const stepLabel = step.label.replace('{rail}', rail);

              return (
                <div
                  key={step.id}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? `${LAYER_COLORS[step.layer]} border-opacity-80 shadow-sm`
                      : status === 'success'
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : status === 'error'
                          ? 'border-danger/25 bg-danger/5'
                          : 'border-border bg-surface-elevated/40'
                  }`}
                >
                  {/* Step number */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-700 shrink-0 transition-all duration-300 ${
                      status === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : status === 'error'
                          ? 'bg-danger/20 text-danger'
                          : isActive
                            ? `bg-primary/20 text-primary`
                            : 'bg-surface text-muted-foreground'
                    }`}
                  >
                    {status === 'success' ? (
                      <CheckCircle2 size={13} />
                    ) : status === 'error' ? (
                      <XCircle size={13} />
                    ) : isActive ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive ? LAYER_COLORS[step.layer] : 'bg-surface border border-border'
                    }`}
                  >
                    <StepIcon
                      size={14}
                      className={
                        isActive
                          ? layerColor
                          : status === 'idle'
                            ? 'text-muted-foreground'
                            : layerColor
                      }
                    />
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-600 transition-colors duration-300 ${
                        status === 'success'
                          ? 'text-emerald-400'
                          : status === 'error'
                            ? 'text-danger'
                            : isActive
                              ? 'text-white'
                              : 'text-muted-foreground'
                      }`}
                    >
                      {stepLabel}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 truncate">{step.sublabel}</p>
                  </div>

                  {/* Layer tag */}
                  <span className={`text-[10px] font-500 shrink-0 ${layerColor} opacity-70`}>
                    {LAYER_NAMES[step.layer]}
                  </span>

                  {/* Connector arrow */}
                  {idx < STEPS.length - 1 && (
                    <div className="absolute -bottom-1.5 left-[22px] z-10">
                      <ChevronRight
                        size={10}
                        className={`rotate-90 transition-colors duration-300 ${
                          status === 'success' ? 'text-emerald-500/50' : 'text-border'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit log */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-600 text-white flex items-center gap-2">
              <FileText size={14} className="text-muted-foreground" />
              Audit Log
            </h2>
            {logs.length > 0 && (
              <span className="text-[10px] font-500 text-muted-foreground font-mono">
                {logs.length} entries
              </span>
            )}
          </div>

          <div className="bg-background rounded-lg border border-border p-3 h-52 overflow-y-auto scrollbar-thin font-mono text-[11px] space-y-1.5">
            {logs.length === 0 ? (
              <p className="text-muted-foreground/50 text-center mt-16">
                Run a simulation to see logs…
              </p>
            ) : (
              logs.map((log, i) => {
                const isError =
                  log.includes('FAILED') || log.includes('ERROR') || log.includes('REVERSED');
                const isWarn = log.includes('ROLLED_BACK') || log.includes('escalated');
                return (
                  <div
                    key={i}
                    className={`flex gap-2 leading-relaxed ${
                      isError ? 'text-danger' : isWarn ? 'text-warning' : 'text-emerald-400/80'
                    }`}
                  >
                    <span className="text-muted-foreground/40 shrink-0 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="break-all">{log}</span>
                  </div>
                );
              })
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Result banner */}
        {done && finalStatus && (
          <div
            className={`rounded-xl border p-4 flex items-start gap-3 transition-all duration-500 ${
              finalStatus === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/8'
                : 'border-danger/30 bg-danger/8'
            }`}
          >
            {finalStatus === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="text-danger shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`text-sm font-600 ${finalStatus === 'success' ? 'text-emerald-400' : 'text-danger'}`}
              >
                {finalStatus === 'success'
                  ? 'Transaction Settled Successfully'
                  : scenario === 'validation_fail'
                    ? 'Transaction Rejected — Validation Failed'
                    : 'Transaction Failed — Processor Error, Ledger Rolled Back'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {finalStatus === 'success'
                  ? `${currency} ${amount} sent via ${rail} rail. Ebanq ledger debited and audit log updated.`
                  : scenario === 'validation_fail'
                    ? 'Request blocked at Middleware. No funds moved. Ebanq ledger unchanged.'
                    : 'Processor returned timeout after 3 retries. Ebanq ledger reversed. Audit entry created.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
