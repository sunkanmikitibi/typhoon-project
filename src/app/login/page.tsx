'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  Mail,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

type AuthStep = {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'success' | 'error';
};

const MOCK_USERS = [
  {
    email: 'marcus@typhoon.io',
    password: 'Typhoon@2024',
    name: 'Marcus Reid',
    role: 'Ops Analyst',
  },
  { email: 'admin@typhoon.io', password: 'Admin@2024', name: 'Admin User', role: 'Administrator' },
];

const INITIAL_STEPS: AuthStep[] = [
  { id: 'validate', label: 'Validating credentials format', status: 'pending' },
  { id: 'middleware', label: 'Typhoon Middleware handshake', status: 'pending' },
  { id: 'identity', label: 'Identity verification', status: 'pending' },
  { id: 'session', label: 'Establishing secure session', status: 'pending' },
  { id: 'permissions', label: 'Loading role & permissions', status: 'pending' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [phase, setPhase] = useState<'form' | 'simulating' | 'success' | 'failed'>('form');
  const [steps, setSteps] = useState<AuthStep[]>(INITIAL_STEPS);
  const [failMessage, setFailMessage] = useState('');

  function validate() {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  }

  function updateStep(id: string, status: AuthStep['status']) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  async function runSimulation(success: boolean) {
    const stepIds = INITIAL_STEPS.map((s) => s.id);
    const failAt = success ? -1 : 2; // fail at identity step if invalid creds

    for (let i = 0; i < stepIds.length; i++) {
      updateStep(stepIds[i], 'running');
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

      if (!success && i === failAt) {
        updateStep(stepIds[i], 'error');
        setFailMessage('Invalid credentials. Access denied by identity provider.');
        setPhase('failed');
        return;
      }
      updateStep(stepIds[i], 'success');
    }

    setPhase('success');
    await new Promise((r) => setTimeout(r, 1200));
    router.push('/dashboard');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const matched = MOCK_USERS.find((u) => u.email === email && u.password === password);
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'pending' })));
    setPhase('simulating');
    await runSimulation(!!matched);
  }

  function handleRetry() {
    setPhase('form');
    setSteps(INITIAL_STEPS);
    setFailMessage('');
    setPassword('');
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center gap-3">
            <AppLogo size={36} />
            <span className="text-2xl font-700 tracking-tight text-white">Typhoon</span>
          </div>
          <p className="text-sm text-muted-foreground">Payment Operations & Risk Intelligence</p>
        </div>

        <div className="bg-surface border border-border rounded-xl shadow-modal overflow-hidden">
          {/* Card header */}
          <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={16} className="text-primary" />
              <h1 className="text-lg font-600 text-white">Sign in to your account</h1>
            </div>
            <p className="text-sm text-muted-foreground">Secure access to Typhoon ops platform</p>
          </div>

          <div className="p-6">
            {/* FORM PHASE */}
            {phase === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                {/* Demo hint */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/8 border border-primary/20">
                  <Zap size={13} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-primary/80 font-mono leading-relaxed">
                    Demo: <span className="text-primary font-600">marcus@typhoon.io</span> /{' '}
                    <span className="text-primary font-600">Typhoon@2024</span>
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-500 text-muted-foreground uppercase tracking-wider">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="you@typhoon.io"
                      className={`w-full pl-9 pr-4 py-2.5 bg-surface-elevated border rounded-lg text-sm text-white placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/60 ${errors.email ? 'border-danger/60' : 'border-border'}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-danger flex items-center gap-1">
                      <XCircle size={11} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-500 text-muted-foreground uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((p) => ({ ...p, password: undefined }));
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 bg-surface-elevated border rounded-lg text-sm text-white placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/60 ${errors.password ? 'border-danger/60' : 'border-border'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-danger flex items-center gap-1">
                      <XCircle size={11} />
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary text-white text-sm font-600 rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 mt-2"
                >
                  <Shield size={15} />
                  Sign In Securely
                </button>

                <p className="text-center text-xs text-muted-foreground pt-1">
                  No account?{' '}
                  <Link
                    href="/register"
                    className="text-primary hover:text-primary/80 font-500 transition-colors"
                  >
                    Create one
                  </Link>
                </p>
              </form>
            )}

            {/* SIMULATING PHASE */}
            {(phase === 'simulating' || phase === 'failed') && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
                  <p className="text-sm font-500 text-white">
                    {phase === 'failed' ? 'Authentication failed' : 'Authenticating…'}
                  </p>
                </div>

                <div className="space-y-2">
                  {steps.map((step, _idx) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                        step.status === 'running'
                          ? 'bg-primary/8 border-primary/25'
                          : step.status === 'success'
                            ? 'bg-success/5 border-success/15'
                            : step.status === 'error'
                              ? 'bg-danger/8 border-danger/25'
                              : 'bg-surface-elevated border-border-subtle'
                      }`}
                    >
                      <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                        {step.status === 'pending' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                        )}
                        {step.status === 'running' && (
                          <Loader2 size={14} className="text-primary animate-spin" />
                        )}
                        {step.status === 'success' && (
                          <CheckCircle2 size={14} className="text-success" />
                        )}
                        {step.status === 'error' && <XCircle size={14} className="text-danger" />}
                      </div>
                      <span
                        className={`text-xs font-mono ${
                          step.status === 'running'
                            ? 'text-primary'
                            : step.status === 'success'
                              ? 'text-success/80'
                              : step.status === 'error'
                                ? 'text-danger'
                                : 'text-muted-foreground/50'
                        }`}
                      >
                        {step.label}
                      </span>
                      {step.status === 'success' && (
                        <span className="ml-auto text-[10px] font-mono text-success/50">OK</span>
                      )}
                    </div>
                  ))}
                </div>

                {phase === 'failed' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-danger/8 border border-danger/25">
                      <AlertTriangle size={14} className="text-danger mt-0.5 shrink-0" />
                      <p className="text-xs text-danger/90">{failMessage}</p>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="w-full py-2.5 bg-surface-elevated border border-border text-sm font-500 text-white rounded-lg hover:bg-border/50 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUCCESS PHASE */}
            {phase === 'success' && (
              <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-success" />
                </div>
                <div className="text-center">
                  <p className="text-base font-600 text-white">Authentication successful</p>
                  <p className="text-xs text-muted-foreground mt-1">Redirecting to dashboard…</p>
                </div>
                <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full animate-[grow_1.2s_ease-out_forwards]"
                    style={{ width: '100%', animation: 'none', transition: 'width 1.2s ease-out' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground/50 mt-6 font-mono">
          Typhoon v2.4.1 · TLS 1.3 · SOC 2 Type II
        </p>
      </div>
    </div>
  );
}
