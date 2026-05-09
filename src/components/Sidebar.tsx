'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Activity,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  Zap,
  FlaskConical,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { UserButton, useUser, useAuth } from '@clerk/nextjs';

const NAV_ITEMS = [
  {
    key: 'nav-dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    key: 'nav-accounts',
    label: 'Accounts',
    href: '/accounts',
    icon: Landmark,
    badge: null,
  },
  {
    key: 'nav-transfers',
    label: 'Transfers',
    href: '/transfers',
    icon: ArrowLeftRight,
    badge: 4,
  },
  {
    key: 'nav-monitoring',
    label: 'Monitoring',
    href: '/monitoring',
    icon: Activity,
    badge: 7,
  },
  {
    key: 'nav-simulator',
    label: 'Tx Simulator',
    href: '/simulator',
    icon: FlaskConical,
    badge: null,
  },
];

const BOTTOM_ITEMS = [
  { key: 'nav-alerts', label: 'Alerts', href: '/alerts', icon: Bell, badge: 3 },
  { key: 'nav-settings', label: 'Settings', href: '/settings', icon: Settings, badge: null },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { has, isLoaded, signOut } = useAuth();

  const isAdmin = has?.({ role: 'admin' });

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
    }
    window.location.href = '/login';
  };

  const filteredBottomItems = BOTTOM_ITEMS.filter((item) => item.key !== 'nav-settings' || isAdmin);

  return (
    <aside
      className={`
        relative flex flex-col h-screen border-r border-border
        bg-surface transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 px-4 border-b border-border gap-3 shrink-0 overflow-hidden`}
      >
        <div className="shrink-0">
          <AppLogo size={32} />
        </div>
        {!collapsed && (
          <span className="font-sans font-700 text-lg tracking-tight text-white whitespace-nowrap">
            Typhoon
          </span>
        )}
      </div>
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] z-10 w-6 h-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
      {/* Environment badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 px-2 py-1 rounded bg-primary/10 border border-primary/20 flex items-center gap-1.5">
          <Zap size={10} className="text-primary" />
          <span className="text-[10px] font-mono font-500 text-primary tracking-widest uppercase">
            Production
          </span>
        </div>
      )}
      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <p className="px-2 pt-2 pb-1 text-[10px] font-500 uppercase tracking-widest text-muted-foreground">
            Operations
          </p>
        )}
        {NAV_ITEMS?.map((item) => {
          const isActive = pathname === item?.href || pathname?.startsWith(item?.href + '/');
          const Icon = item?.icon;
          return (
            <Link
              key={item?.key}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className={`
                group relative flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-500
                transition-all duration-150
                ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-white'
                }
              `}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 whitespace-nowrap">{item?.label}</span>
                  {item?.badge !== null && (
                    <span
                      className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full tabular-nums ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-surface-elevated text-muted-foreground'
                      }`}
                    >
                      {item?.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item?.badge !== null && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
              )}
            </Link>
          );
        })}

        {!collapsed && (
          <p className="px-2 pt-4 pb-1 text-[10px] font-500 uppercase tracking-widest text-muted-foreground">
            System
          </p>
        )}
        {filteredBottomItems?.map((item) => {
          const Icon = item?.icon;
          return (
            <Link
              key={item?.key}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className="group relative flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-500 text-muted-foreground hover:bg-surface-elevated hover:text-white transition-all duration-150"
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 whitespace-nowrap">{item?.label}</span>
                  {item?.badge !== null && (
                    <span className="text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-warning/15 text-warning">
                      {item?.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
      {/* User profile */}
      <div
        className={`border-t border-border p-3 shrink-0 ${collapsed ? 'flex justify-center' : ''}`}
      >
        {collapsed ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        ) : (
          <div className="flex items-center gap-2.5">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-500 text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {String(user?.publicMetadata?.role || 'User')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-500 text-muted-foreground hover:bg-surface-elevated hover:text-white transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
