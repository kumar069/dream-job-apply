import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { EmptyState } from "@/components/empty-state";
import { mockTeam, mockUser, type TeamMember } from "@/lib/mock-data";
import { toast } from "sonner";
import { Lock, UserPlus, Trash2, Linkedin } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team — AutoApply" }] }),
  component: TeamPage,
});

function TeamPage() {
  const isTeamPlan =
    mockUser.plan === "TEAM_STARTER" ||
    mockUser.plan === "TEAM_PRO" ||
    mockUser.plan === "ENTERPRISE";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="eyebrow">Organization</div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">Team</h1>
        </div>

        {!isTeamPlan ? (
          <EmptyState
            icon={<Lock className="h-7 w-7" />}
            title="Team plan required"
            description="Invite teammates, share resumes, and dispatch from multiple Gmail accounts on a Team plan."
            action={
              <Link
                to="/billing"
                className="inline-flex rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background"
              >
                See Team plans
              </Link>
            }
          />
        ) : (
          <TeamTable />
        )}
      </div>
    </AppLayout>
  );
}

function TeamTable() {
  // API: GET /api/v1/tenant/members
  const [members, setMembers] = useState<TeamMember[]>(mockTeam);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  const invite = () => {
    // API: POST /api/v1/tenant/members/invite
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail("");
    setInviteOpen(false);
  };

  const changeRole = (id: string, role: TeamMember["role"]) => {
    // API: PATCH /api/v1/tenant/members/:id/role
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, role } : x)));
    toast.success("Role updated");
  };

  const remove = (id: string) => {
    // API: DELETE /api/v1/tenant/members/:id
    setMembers((m) => m.filter((x) => x.id !== id));
    toast.success("Member removed");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {members.length} member{members.length === 1 ? "" : "s"}
        </p>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
              <UserPlus className="h-4 w-4" /> Invite member
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a teammate</DialogTitle>
              <DialogDescription>They'll get an email to join your workspace.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                type="email"
                placeholder="teammate@company.com"
                className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "MEMBER")}
                className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <DialogFooter>
              <button
                onClick={invite}
                disabled={!inviteEmail}
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background disabled:opacity-40"
              >
                Send invite
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-[32px] bg-card shadow-[var(--shadow-pill)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="hidden px-6 py-4 font-medium sm:table-cell">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="hidden px-6 py-4 font-medium md:table-cell">LinkedIn</th>
              <th className="hidden px-6 py-4 font-medium md:table-cell">Joined</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-foreground/5 last:border-0">
                <td className="px-6 py-4 font-medium">{m.name}</td>
                <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">
                  {m.email}
                </td>
                <td className="px-6 py-4">
                  {m.role === "OWNER" ? (
                    <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                      Owner
                    </span>
                  ) : (
                    <select
                      value={m.role}
                      onChange={(e) =>
                        changeRole(m.id, e.target.value as TeamMember["role"])
                      }
                      className="rounded-full border border-foreground/15 bg-card px-3 py-1 text-xs"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                    </select>
                  )}
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  {m.linkedinConnected ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[oklch(0.4_0.13_150)]">
                      <Linkedin className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not connected</span>
                  )}
                </td>
                <td className="hidden px-6 py-4 text-muted-foreground md:table-cell">
                  {m.joinedAt}
                </td>
                <td className="px-6 py-4 text-right">
                  {m.role !== "OWNER" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="inline-flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1 text-xs text-destructive hover:bg-destructive/5">
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {m.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            They'll lose access to this workspace immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(m.id)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
