import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  UserCircle,
  CreditCard,
  Users,
  LogOut,
  ChevronDown,
  Zap,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { mockUser, mockPlan } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: Inbox },
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/billing", label: "Billing", icon: CreditCard },
];

const TEAM_NAV = { to: "/team", label: "Team", icon: Users };

export function AppLayout({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const showTeam =
    mockUser.plan === "TEAM_STARTER" ||
    mockUser.plan === "TEAM_PRO" ||
    mockUser.plan === "ENTERPRISE";

  const navItems = showTeam ? [...NAV, TEAM_NAV] : NAV;
  const usagePct = Math.round((mockPlan.used / mockPlan.limit) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Floating navbar */}
      <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-card px-4 py-2.5 shadow-[var(--shadow-pill)] sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background">
              <Zap className="h-4 w-4 fill-current" />
            </span>
            <span className="text-base font-medium tracking-tight">AutoApply</span>
          </Link>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-foreground/15 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="hidden items-center gap-2 rounded-full px-2 py-1 hover:bg-secondary md:inline-flex">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-foreground text-background text-xs">
                  {initials(mockUser.fullName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{mockUser.fullName}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="text-sm font-medium">{mockUser.fullName}</div>
                <div className="text-xs text-muted-foreground">{mockUser.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                {/* API: POST /api/v1/auth/logout */}
                <Link to="/login" className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-28 rounded-[40px] bg-card p-4 shadow-[var(--shadow-pill)]">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = path.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-3xl border border-foreground/10 p-4">
              <div className="eyebrow text-[10px]">{mockPlan.name} plan</div>
              <div className="mt-2 text-xs text-muted-foreground">
                {mockPlan.used} of {mockPlan.limit} applications
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full bg-signal"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <Link
                to="/billing"
                className="mt-3 inline-block text-xs font-medium underline underline-offset-4"
              >
                Manage plan
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-background/95 p-6 md:hidden">
            <div className="flex items-center justify-between">
              <span className="font-medium">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-foreground/15 px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-full bg-secondary px-4 py-3 text-sm"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <main className="min-w-0 flex-1 pb-24 md:pb-12">{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-foreground/10 bg-card/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const active = path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px]",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
