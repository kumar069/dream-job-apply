import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { StatusBadge } from "@/components/status-badge";
import { mockStats, mockApplications, mockUser } from "@/lib/mock-data";
import { ArrowUpRight, FileEdit, Send, CalendarDays, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AutoApply" }] }),
  component: Dashboard,
});

const STAT_ICONS = [FileEdit, Send, CalendarDays, TrendingUp];

function Dashboard() {
  // API: GET /api/v1/applications/stats
  const stats = [
    { label: "Drafts ready", value: mockStats.draftsReady },
    { label: "Sent today", value: mockStats.sentToday },
    { label: "Sent this week", value: mockStats.sentThisWeek },
    { label: "Total sent", value: mockStats.totalSent },
  ];

  // API: GET /api/v1/applications?limit=5
  const recent = mockApplications.slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
            Welcome back, {mockUser.fullName.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening across your job pipeline today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div
                key={s.label}
                className="rounded-[32px] bg-card p-6 shadow-[var(--shadow-pill)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="mt-4 text-4xl font-medium tracking-tight">{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* How it works (only if onboarding incomplete) */}
        {!mockUser.onboardingComplete && (
          <div className="rounded-[40px] bg-foreground p-8 text-background">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
              <Sparkles className="h-3.5 w-3.5" /> How it works
            </div>
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              {[
                "Forward a job post to the LinkedIn bot.",
                "AI extracts job details and writes the email.",
                "Reply YES to send — or edit in dashboard.",
              ].map((step, i) => (
                <div key={i}>
                  <div className="text-3xl font-medium">0{i + 1}</div>
                  <div className="mt-2 text-sm opacity-80">{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent applications */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">Activity</div>
              <h2 className="mt-2 text-2xl font-medium tracking-tight">Recent applications</h2>
            </div>
            <Link
              to="/applications"
              className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-[32px] bg-card shadow-[var(--shadow-pill)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="hidden px-6 py-4 font-medium md:table-cell">HR email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-secondary/40"
                  >
                    <td className="px-6 py-4 font-medium">
                      <Link to="/applications/$id" params={{ id: a.id }}>
                        {a.companyName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{a.jobTitle}</td>
                    <td className="hidden px-6 py-4 text-muted-foreground md:table-cell">
                      {a.hrEmail}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
