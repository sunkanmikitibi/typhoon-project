import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
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
        <SignIn
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: 'hsl(var(--primary))',
              colorBackground: 'hsl(var(--surface))',
              colorInputBackground: 'hsl(var(--surface-elevated))',
              colorInputText: 'hsl(var(--foreground))',
              colorText: 'hsl(var(--foreground))',
              colorTextSecondary: 'hsl(var(--muted-foreground))',
              borderRadius: '0.5rem',
            },
            elements: {
              card: 'bg-surface border border-border shadow-modal',
              headerTitle: 'text-white',
              headerSubtitle: 'text-muted-foreground',
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              formFieldInput: 'bg-surface-elevated border-border text-white',
              formFieldLabel: 'text-muted-foreground',
              footerActionText: 'text-muted-foreground',
              footerActionLink: 'text-primary hover:text-primary/80',
              dividerLine: 'bg-border',
              dividerText: 'text-muted-foreground',
              socialButtonsBlockButton: 'bg-surface-elevated border-border hover:bg-border/50',
              socialButtonsBlockButtonText: 'text-white',
            },
          }}
        />
      </div>
    </div>
  );
}
