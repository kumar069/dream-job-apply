import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Linkedin } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AutoApply" },
      {
        name: "description",
        content: "Sign in to AutoApply with LinkedIn and let AI handle your job applications.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ghost watermark */}
      <h2
        aria-hidden
        className="ghost-watermark pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[18vw] sm:text-[14vw]"
      >
        AutoApply
      </h2>

      <div className="relative grid min-h-screen place-items-center px-4 py-12">
        <div className="w-full max-w-md rounded-[40px] bg-card p-10 shadow-[var(--shadow-halo)]">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background">
              <Zap className="h-5 w-5 fill-current" />
            </span>
            <div>
              <div className="text-base font-medium tracking-tight">AutoApply</div>
              <div className="text-xs text-muted-foreground">by you, for you</div>
            </div>
          </div>

          <h1 className="mt-10 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Apply smarter.
            <br />
            Let AI handle your inbox.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Forward a LinkedIn job post, and we'll draft the cold email — sent from your own
            Gmail, signed off as you. Reply YES to dispatch.
          </p>

          <a
            // API: GET /api/v1/auth/linkedin
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // API: GET /api/v1/auth/linkedin → redirect
              window.location.href = "/onboarding";
            }}
            className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            <Linkedin className="h-4 w-4" />
            Continue with LinkedIn
          </a>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <Link to="/login" className="underline underline-offset-4">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/login" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          <span className="eyebrow text-[10px]">No password</span>
          <span className="ml-3">LinkedIn OAuth only</span>
        </p>
      </div>
    </div>
  );
}
