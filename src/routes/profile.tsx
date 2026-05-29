import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { TagInput } from "@/components/tag-input";
import { mockUser, mockResume } from "@/lib/mock-data";
import { toast } from "sonner";
import { Linkedin, Mail, Check, Download, Upload, Trash2, FileText } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — AutoApply" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  // API: GET /api/v1/auth/me
  const [form, setForm] = useState({
    currentRole: mockUser.currentRole,
    yearsExperience: mockUser.yearsExperience,
    location: mockUser.location,
    emailTone: mockUser.emailTone,
    emailSignature: mockUser.emailSignature,
  });
  const [skills, setSkills] = useState(mockUser.skills);
  const [targetRoles, setTargetRoles] = useState(mockUser.targetRoles);
  const [gmailConnected, setGmailConnected] = useState(mockUser.gmailConnected);

  const save = () => {
    // API: PUT /api/v1/users/me/profile
    toast.success("Profile saved");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="eyebrow">Account</div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">Profile</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT identity */}
          <aside className="rounded-[32px] bg-card p-6 shadow-[var(--shadow-pill)]">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-foreground text-background text-xl">
                  {mockUser.fullName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="mt-3 text-lg font-medium">{mockUser.fullName}</div>
              <div className="text-sm text-muted-foreground">{mockUser.email}</div>
            </div>

            <div className="mt-6 space-y-3">
              <Connection
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
                connected={mockUser.linkedinConnected}
              />
              <Connection
                icon={<Mail className="h-4 w-4" />}
                label="Gmail"
                connected={gmailConnected}
                address={mockUser.gmailAddress}
                onDisconnect={() => {
                  // API: DELETE /api/v1/auth/google
                  setGmailConnected(false);
                  toast.error("Gmail disconnected");
                }}
              />
            </div>
          </aside>

          {/* RIGHT form */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[32px] bg-card p-6 shadow-[var(--shadow-pill)]">
              <h2 className="text-lg font-medium">Personal details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Current role">
                  <input
                    value={form.currentRole}
                    onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
                    className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
                  />
                </Field>
                <Field label="Years of experience">
                  <input
                    type="number"
                    value={form.yearsExperience}
                    onChange={(e) =>
                      setForm({ ...form, yearsExperience: Number(e.target.value) })
                    }
                    className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
                  />
                </Field>
                <Field label="Email tone">
                  <select
                    value={form.emailTone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        emailTone: e.target.value as typeof form.emailTone,
                      })
                    }
                    className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
                  >
                    <option value="FORMAL">Formal</option>
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="CONVERSATIONAL">Conversational</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email signature">
                    <textarea
                      value={form.emailSignature}
                      onChange={(e) =>
                        setForm({ ...form, emailSignature: e.target.value })
                      }
                      rows={4}
                      className="w-full resize-y rounded-2xl border border-foreground/15 bg-card p-3 font-mono text-sm outline-none focus:border-foreground/40"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-medium text-muted-foreground">Skills</div>
                <div className="mt-2">
                  <TagInput value={skills} onChange={setSkills} placeholder="Add a skill…" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-medium text-muted-foreground">Target roles</div>
                <div className="mt-2">
                  <TagInput
                    value={targetRoles}
                    onChange={setTargetRoles}
                    placeholder="Add a target role…"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={save}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background"
                >
                  Save profile
                </button>
              </div>
            </div>

            {/* Resume */}
            <div className="rounded-[32px] bg-card p-6 shadow-[var(--shadow-pill)]">
              <h2 className="text-lg font-medium">Resume</h2>
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-foreground/10 bg-lifted p-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-foreground text-background">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{mockResume.fileName}</div>
                  <div className="text-xs text-muted-foreground">
                    Uploaded {mockResume.uploadedAt} · {mockResume.sizeKb} KB
                  </div>
                </div>
                <button
                  // API: GET /api/v1/users/me/resume/download
                  onClick={() => toast.info("Downloading resume…")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium hover:bg-secondary"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>

              <label
                htmlFor="resume-replace"
                className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-foreground/15 bg-lifted px-6 py-8 text-center text-sm hover:border-foreground/30"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span>Drop a new PDF to replace</span>
                {/* API: POST /api/v1/users/me/resume */}
                <input id="resume-replace" type="file" accept="application/pdf" className="hidden" />
              </label>

              <div className="mt-4 flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="inline-flex items-center gap-2 rounded-full border border-destructive/30 px-5 py-2 text-sm font-medium text-destructive hover:bg-destructive/5">
                      <Trash2 className="h-4 w-4" /> Remove resume
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove your resume?</AlertDialogTitle>
                      <AlertDialogDescription>
                        AutoApply won't attach a resume to outgoing emails until you upload a
                        new one.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          // API: DELETE /api/v1/users/me/resume
                          toast.success("Resume removed");
                        }}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Connection({
  icon,
  label,
  connected,
  address,
  onDisconnect,
}: {
  icon: React.ReactNode;
  label: string;
  connected: boolean;
  address?: string;
  onDisconnect?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-lifted px-4 py-3">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="truncate text-xs text-muted-foreground">
          {connected ? address || "Connected" : "Not connected"}
        </div>
      </div>
      {connected ? (
        <>
          <Check className="h-4 w-4 text-[oklch(0.5_0.15_150)]" />
          {onDisconnect && (
            <button
              onClick={onDisconnect}
              className="ml-1 rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
            >
              Disconnect
            </button>
          )}
        </>
      ) : (
        <button className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
          Connect
        </button>
      )}
    </div>
  );
}
