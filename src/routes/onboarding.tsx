import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Check, FileText, ChevronRight, SkipForward, Mail } from "lucide-react";
import { toast } from "sonner";
import { TagInput } from "@/components/tag-input";
import { mockUser } from "@/lib/mock-data";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Get started — AutoApply" }],
  }),
  component: OnboardingPage,
});

const STEPS = ["Profile", "Skills", "Resume", "Gmail"];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [profile, setProfile] = useState({
    currentRole: "",
    yearsExperience: 0,
    location: "",
    emailTone: "PROFESSIONAL" as "FORMAL" | "PROFESSIONAL" | "CONVERSATIONAL",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [gmailConnected, setGmailConnected] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  const finish = () => {
    // API: PUT /api/v1/users/me/onboarding-complete
    toast.success("Welcome to AutoApply");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="eyebrow">Onboarding</div>
        <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
          Let's set up your AutoApply.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Takes about 90 seconds. You can edit anything later.
        </p>

        {/* Progress */}
        <div className="mt-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  i <= step ? "bg-foreground" : "bg-foreground/10"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {STEPS.map((label, i) => (
            <span key={label} className={i === step ? "text-foreground font-medium" : ""}>
              {label}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-[40px] bg-card p-8 shadow-[var(--shadow-pill)]">
          {step === 0 && (
            <Step
              title="Profile basics"
              subtitle="Pulled from LinkedIn, editable any time."
            >
              <Field label="Full name (from LinkedIn)">
                <input
                  readOnly
                  value={mockUser.fullName}
                  className="w-full rounded-full border border-foreground/15 bg-secondary px-4 py-2.5 text-sm text-muted-foreground"
                />
              </Field>
              <Field label="Current role">
                <input
                  value={profile.currentRole}
                  onChange={(e) =>
                    setProfile({ ...profile, currentRole: e.target.value })
                  }
                  placeholder="e.g. Full Stack Developer"
                  className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Years of experience">
                  <input
                    type="number"
                    min={0}
                    value={profile.yearsExperience}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        yearsExperience: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Bengaluru, India"
                    className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
                  />
                </Field>
              </div>
              <Field label="Email tone">
                <select
                  value={profile.emailTone}
                  onChange={(e) =>
                    setProfile({ ...profile, emailTone: e.target.value as typeof profile.emailTone })
                  }
                  className="w-full rounded-full border border-foreground/15 bg-card px-4 py-2.5 text-sm outline-none focus:border-foreground/40"
                >
                  <option value="FORMAL">Formal</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="CONVERSATIONAL">Conversational</option>
                </select>
              </Field>
            </Step>
          )}

          {step === 1 && (
            <Step
              title="Skills & target roles"
              subtitle="We use these to score matching jobs."
            >
              <Field label="Skills">
                <TagInput value={skills} onChange={setSkills} placeholder="Type and press Enter" />
              </Field>
              <Field label="Target roles">
                <TagInput
                  value={targetRoles}
                  onChange={setTargetRoles}
                  placeholder="e.g. Full Stack Engineer"
                />
              </Field>
            </Step>
          )}

          {step === 2 && (
            <Step
              title="Upload your resume"
              subtitle="AI will extract your skills from this resume."
            >
              <label
                htmlFor="resume"
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-foreground/20 bg-lifted px-6 py-12 text-center transition-colors hover:border-foreground/40"
              >
                <Upload className="h-7 w-7 text-muted-foreground" />
                <div className="text-sm font-medium">
                  Drop your PDF here, or click to browse
                </div>
                <div className="text-xs text-muted-foreground">PDF, up to 5 MB</div>
                <input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                />
              </label>
              {resume && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3 text-sm">
                  <FileText className="h-4 w-4" />
                  <span className="flex-1 truncate">{resume.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(resume.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              )}
            </Step>
          )}

          {step === 3 && (
            <Step
              title="Connect Gmail"
              subtitle="We send emails FROM your Gmail — HRs see your real address, not a bot."
            >
              {gmailConnected ? (
                <div className="flex items-center gap-3 rounded-2xl border border-foreground/15 bg-lifted px-5 py-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-medium">Connected</div>
                    <div className="text-xs text-muted-foreground">{mockUser.email}</div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    // API: GET /api/v1/auth/google → redirect
                    setGmailConnected(true);
                    toast.success("Gmail connected");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card px-6 py-3 text-sm font-medium hover:bg-secondary"
                >
                  <Mail className="h-4 w-4" />
                  Connect Gmail
                </button>
              )}
              <div className="rounded-2xl border border-foreground/10 bg-lifted p-4 text-xs leading-relaxed text-muted-foreground">
                We only request <em>send</em> permissions. We do not read your inbox.
              </div>
            </Step>
          )}

          {/* Footer actions */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-sm text-muted-foreground disabled:opacity-30"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              {(step === 2 || step === 3) && (
                <button
                  type="button"
                  onClick={() => {
                    toast.warning("Skipped — you can finish this later in Profile");
                    if (step === STEPS.length - 1) finish();
                    else next();
                  }}
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                >
                  <SkipForward className="h-3.5 w-3.5" /> Skip
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && resume) {
                    // API: POST /api/v1/users/me/resume
                    toast.success("Resume uploaded");
                  }
                  if (step === STEPS.length - 1) finish();
                  else next();
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background"
              >
                {step === STEPS.length - 1 ? "Go to dashboard" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-medium tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
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
