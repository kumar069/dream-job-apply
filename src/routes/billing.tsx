import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { mockPlan, mockUsage, plans, mockUser } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing — AutoApply" }] }),
  component: BillingPage,
});

function BillingPage() {
  // API: GET /api/v1/billing/plan + GET /api/v1/billing/usage
  const usagePct = Math.round((mockPlan.used / mockPlan.limit) * 100);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <div className="eyebrow">Billing</div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
            Plan & usage
          </h1>
        </div>

        {/* Current plan */}
        <div className="rounded-[40px] bg-card p-8 shadow-[var(--shadow-pill)]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <span className="inline-block rounded-full bg-foreground px-3 py-1 text-xs font-medium uppercase tracking-wider text-background">
                {mockPlan.name} plan
              </span>
              <div className="mt-4 text-4xl font-medium tracking-tight">
                {mockPlan.price}
              </div>
              <div className="text-sm text-muted-foreground">
                Resets {mockPlan.resetDate}
              </div>
            </div>
            <div className="min-w-[280px] flex-1">
              <div className="flex items-center justify-between text-sm">
                <span>{mockPlan.used} applications used</span>
                <span className="text-muted-foreground">of {mockPlan.limit}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full bg-foreground"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{usagePct}% used</div>
            </div>
          </div>
        </div>

        {/* Usage chart */}
        <section>
          <div className="eyebrow">Activity</div>
          <h2 className="mt-2 text-2xl font-medium tracking-tight">
            Applications this cycle
          </h2>
          {/* API: GET /api/v1/usage/stats */}
          <div className="mt-4 rounded-[32px] bg-card p-6 shadow-[var(--shadow-pill)]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockUsage.appsPerDay}>
                  <CartesianGrid stroke="oklch(0.18 0.005 70 / 0.08)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: 12 }}
                  />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "oklch(0.18 0.005 70 / 0.05)" }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 16,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="apps" fill="var(--foreground)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid gap-4 border-t border-foreground/10 pt-6 sm:grid-cols-3">
              <Mini label="Top company" value={mockUsage.topCompanies[0]} />
              <Mini label="Top role" value={mockUsage.topRoles[0]} />
              <Mini
                label="Avg draft time"
                value={`${(mockUsage.avgDraftTimeMs / 1000).toFixed(1)}s`}
              />
            </div>
          </div>
        </section>

        {/* Plan comparison */}
        <section>
          <div className="eyebrow">Plans</div>
          <h2 className="mt-2 text-2xl font-medium tracking-tight">Compare & upgrade</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            {plans.map((p) => {
              const current = p.id === mockUser.plan;
              return (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-[32px] p-6 shadow-[var(--shadow-pill)] ${
                    current
                      ? "bg-foreground text-background"
                      : "bg-card"
                  }`}
                >
                  <div className="text-xs font-medium uppercase tracking-wider opacity-70">
                    {p.name}
                  </div>
                  <div className="mt-3 text-2xl font-medium tracking-tight">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5" />
                      {p.apps === -1 ? "Unlimited" : `${p.apps.toLocaleString()} apps/mo`}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5" />
                      {p.users === -1 ? "Custom seats" : `${p.users} user${p.users > 1 ? "s" : ""}`}
                    </li>
                  </ul>
                  <button
                    disabled={current}
                    onClick={() => {
                      // API: POST /api/v1/billing/portal
                      toast.info("Opening billing portal…");
                    }}
                    className={`mt-auto inline-flex justify-center rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                      current
                        ? "border border-background/30 text-background/80"
                        : "bg-foreground text-background hover:opacity-90"
                    }`}
                  >
                    {current ? "Current plan" : p.id === "ENTERPRISE" ? "Contact sales" : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
