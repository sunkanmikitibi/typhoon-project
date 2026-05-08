'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  Mail,
  User,
  Building2,
  Zap,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

type AuthStep = {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'success' | 'error';
};

const REGISTER_STEPS: AuthStep[] = [
  { id: 'validate', label: 'Validating registration data', status: 'pending' },
  { id: 'duplicate', label: 'Checking for duplicate accounts', status: 'pending' },
  { id: 'provision', label: 'Provisioning user account', status: 'pending' },
  { id: 'roles', label: 'Assigning default role & permissions', status: 'pending' },
  { id: 'session', label: 'Creating secure session token', status: 'pending' },
  { id: 'notify', label: 'Sending welcome notification', status: 'pending' },
];

const EXISTING_EMAILS = ['admin@typhoon.io'];

interface FormData {
  fullName: string;
  email: string;
  organization: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  organization?: string;
  password?: string;
  confirmPassword?: string;
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: '', color: '' },
    { label: 'Weak', color: 'bg-danger' },
    { label: 'Fair', color: 'bg-warning' },
    { label: 'Good', color: 'bg-primary' },
    { label: 'Strong', color: 'bg-success' },
  ];
  return { score, ...map[score] };
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [phase, setPhase] = useState<'form' | 'simulating' | 'success' | 'failed'>('form');
  const [steps, setSteps] = useState<AuthStep[]>(REGISTER_STEPS);
  const [failMessage, setFailMessage] = useState('');

  const pwStrength = getPasswordStrength(form.password);

  function setField(field: keyof FormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address';
    if (!form.organization.trim()) errs.organization = 'Organization is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters required';
    else if (pwStrength.score < 2) errs.password = 'Password is too weak';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  function updateStep(id: string, status: AuthStep['status']) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  async function runSimulation(isDuplicate: boolean) {
    const stepIds = REGISTER_STEPS.map((s) => s.id);
    const failAt = isDuplicate ? 1 : -1;

    for (let i = 0; i < stepIds.length; i++) {
      updateStep(stepIds[i], 'running');
      await new Promise((r) => setTimeout(r, 550 + Math.random() * 450));

      if (isDuplicate && i === failAt) {
        updateStep(stepIds[i], 'error');
        setFailMessage('An account with this email already exists. Try signing in instead.');
        setPhase('failed');
        return;
      }
      updateStep(stepIds[i], 'success');
    }

    setPhase('success');
    await new Promise((r) => setTimeout(r, 1400));
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

    const isDuplicate = EXISTING_EMAILS.includes(form.email.toLowerCase());
    setSteps(REGISTER_STEPS.map((s) => ({ ...s, status: 'pending' })));
    setPhase('simulating');
    await runSimulation(isDuplicate);
  }

  function handleRetry() {
    setPhase('form');
    setSteps(REGISTER_STEPS);
    setFailMessage('');
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
              <ShieldCheck size={16} className="text-primary" />
              <h1 className="text-lg font-600 text-white">Create your account</h1>
            </div>
            <p className="text-sm text-muted-foreground">Join the Typhoon ops platform</p>
          </div>

          <div className="p-6">
            {/* FORM PHASE */}
            {phase === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                {/* Duplicate test hint */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/8 border border-primary/20">
                  <Zap size={13} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-primary/80 font-mono leading-relaxed">
                    Test duplicate: use{' '}
                    <span className="text-primary font-600">admin@typhoon.io</span> to trigger
                    conflict error
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-500 text-muted-foreground uppercase tracking-wider">
                    Full name
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setField('fullName', e.target.value)}
                      placeholder="Marcus Reid"
                      className={`w-full pl-9 pr-4 py-2.5 bg-surface-elevated border rounded-lg text-sm text-white placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/60 ${errors.fullName ? 'border-danger/60' : 'border-border'}`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-danger flex items-center gap-1">
                      <XCircle size={11} />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-500 text-muted-foreground uppercase tracking-wider">
                    Work email
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      placeholder="you@company.io"
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

                {/* Organization */}
                <div className="space-y-1.5">
                  <label className="text-xs font-500 text-muted-foreground uppercase tracking-wider">
                    Organization
                  </label>
                  <div className="relative">
                    <Building2
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) => setField('organization', e.target.value)}
                      placeholder="Acme Fintech Ltd."
                      className={`w-full pl-9 pr-4 py-2.5 bg-surface-elevated border rounded-lg text-sm text-white placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/60 ${errors.organization ? 'border-danger/60' : 'border-border'}`}
                    />
                  </div>
                  {errors.organization && (
                    <p className="text-[11px] text-danger flex items-center gap-1">
                      <XCircle size={11} />
                      {errors.organization}
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
                      value={form.password}
                      onChange={(e) => setField('password', e.target.value)}
                      placeholder="Min. 8 characters"
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
                  {/* Strength bar */}
                  {form.password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength.score ? pwStrength.color : 'bg-surface-elevated'}`}
                          />
                        ))}
                      </div>
                      {pwStrength.label && (
                        <p
                          className={`text-[10px] font-mono ${pwStrength.score <= 1 ? 'text-danger' : pwStrength.score === 2 ? 'text-warning' : pwStrength.score === 3 ? 'text-primary' : 'text-success'}`}
                        >
                          {pwStrength.label}
                        </p>
                      )}
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-[11px] text-danger flex items-center gap-1">
                      <XCircle size={11} />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-500 text-muted-foreground uppercase tracking-wider">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => setField('confirmPassword', e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full pl-9 pr-10 py-2.5 bg-surface-elevated border rounded-lg text-sm text-white placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/60 ${errors.confirmPassword ? 'border-danger/60' : 'border-border'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-danger flex items-center gap-1">
                      <XCircle size={11} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary text-white text-sm font-600 rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck size={15} />
                  Create Account
                </button>

                <p className="text-center text-xs text-muted-foreground pt-1">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 font-500 transition-colors"
                  >
                    Sign in
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
                    {phase === 'failed' ? 'Registration failed' : 'Creating your account…'}
                  </p>
                </div>

                <div className="space-y-2">
                  {steps.map((step) => (
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
                    <div className="flex gap-2">
                      <button
                        onClick={handleRetry}
                        className="flex-1 py-2.5 bg-surface-elevated border border-border text-sm font-500 text-white rounded-lg hover:bg-border/50 transition-colors"
                      >
                        Try Again
                      </button>
                      <Link
                        href="/login"
                        className="flex-1 py-2.5 bg-primary/15 border border-primary/30 text-sm font-500 text-primary rounded-lg hover:bg-primary/20 transition-colors text-center flex items-center justify-center"
                      >
                        Sign In
                      </Link>
                    </div>
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
                  <p className="text-base font-600 text-white">Account created successfully</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Welcome to Typhoon, {form.fullName.split(' ')[0]}! Redirecting…
                  </p>
                </div>
                <div className="w-full p-3 rounded-lg bg-surface-elevated border border-border-subtle space-y-1">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    Session token issued
                  </p>
                  <p className="text-[11px] font-mono text-primary/70 truncate">
                    TYP-{Math.random().toString(36).substring(2, 10).toUpperCase()}-
                    {Date.now().toString(36).toUpperCase()}
                  </p>
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
