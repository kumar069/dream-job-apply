import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { mockApplications, type ApplicationStatus } from "@/lib/mock-data";
import { Inbox, Search, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/applications/")({
  head: () => ({ meta: [{ title: "Applications — AutoApply" }] }),
  component: ApplicationsPage,
});

const TABS: (ApplicationStatus | "ALL")[] = [
  "ALL",
  "DRAFT",
  "SENDING",
  "SENT",
  "FAILED",
  "DISCARDED",
];

function ApplicationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // API: GET /api/v1/applications?status=&company=&page=&limit=
  const filtered = useMemo(() => {
    return mockApplications.filter((a) => {
      const tabOk = tab === "ALL" || a.status === tab;
      const searchOk =
        !search || a.companyName.toLowerCase().includes(search.toLowerCase());
      return tabOk && searchOk;
    });
  }, [tab, search]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Pipeline</div>
            <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
              Applications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every job we've drafted, sent, or skipped.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="rounded-[32px] bg-card p-4 shadow-[var(--shadow-pill)]">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setPage(1);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  tab === t
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search company…"
                className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {total === 0 ? (
          <EmptyState
            icon={<Inbox className="h-7 w-7" />}
            title="No applications yet"
            description="Forward a job post to the LinkedIn bot to get started — drafts will land here automatically."
          />
        ) : (
          <div className="overflow-hidden rounded-[32px] bg-card shadow-[var(--shadow-pill)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="hidden px-6 py-4 font-medium md:table-cell">HR email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell">Created</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-foreground/5 last:border-0 hover:bg-secondary/40"
                  >
                    <td className="px-6 py-4 font-medium">{a.companyName}</td>
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
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/applications/$id"
                        params={{ id: a.id }}
                        className="inline-flex items-center gap-1 rounded-full border border-foreground/15 px-3 py-1 text-xs font-medium hover:bg-secondary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-foreground/10 px-6 py-3 text-xs text-muted-foreground">
              <span>
                {total} result{total === 1 ? "" : "s"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="grid h-7 w-7 place-items-center rounded-full border border-foreground/15 disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span>
                  Page {page} / {pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="grid h-7 w-7 place-items-center rounded-full border border-foreground/15 disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
