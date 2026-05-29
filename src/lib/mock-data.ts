// Centralized mock data for AutoApply frontend.
// All values are placeholder — wire to REST backend at /api/v1/...

export type ApplicationStatus =
  | "EXTRACTING"
  | "DRAFT"
  | "CONFIRMED"
  | "SENDING"
  | "SENT"
  | "FAILED"
  | "DISCARDED";

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  hrEmail: string;
  jobLocation: string;
  employmentType: string;
  status: ApplicationStatus;
  createdAt: string;
  sentAt?: string;
  skillsRequired: string[];
  skillsMatched: string[];
  source: string;
  emailSubject: string;
  emailBody: string;
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  currentRole: string;
  yearsExperience: number;
  location: string;
  emailTone: "FORMAL" | "PROFESSIONAL" | "CONVERSATIONAL";
  emailSignature: string;
  skills: string[];
  targetRoles: string[];
  linkedinConnected: boolean;
  gmailConnected: boolean;
  gmailAddress?: string;
  onboardingComplete: boolean;
  plan: PlanId;
  tenantRole: "OWNER" | "ADMIN" | "MEMBER";
}

export type PlanId = "FREE" | "PRO" | "TEAM_STARTER" | "TEAM_PRO" | "ENTERPRISE";

export const mockUser: CurrentUser = {
  id: "u_1",
  fullName: "Arbaj Alam",
  email: "arbaj@gmail.com",
  currentRole: "Full Stack Developer",
  yearsExperience: 3,
  location: "Bengaluru, India",
  emailTone: "PROFESSIONAL",
  emailSignature: "Best,\nArbaj Alam\n+91 98xxx xxxxx",
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
  targetRoles: ["Full Stack Engineer", "Backend Engineer", "Senior Software Engineer"],
  linkedinConnected: true,
  gmailConnected: true,
  gmailAddress: "arbaj@gmail.com",
  onboardingComplete: true,
  plan: "PRO",
  tenantRole: "OWNER",
};

export const mockApplications: Application[] = [
  {
    id: "app_001",
    companyName: "redSling",
    jobTitle: "Full Stack Engineer",
    hrEmail: "hr@redsling.com",
    jobLocation: "Remote · India",
    employmentType: "Full-time",
    status: "DRAFT",
    createdAt: "2026-05-22T09:14:00Z",
    skillsRequired: ["React", "Node.js", "PostgreSQL", "GraphQL"],
    skillsMatched: ["React", "Node.js", "PostgreSQL"],
    source: "Extracted from LinkedIn post",
    emailSubject: "Full Stack Engineer Application — Arbaj Alam (3 yrs, React + Node)",
    emailBody:
      "Hi redSling team,\n\nI came across your Full Stack Engineer opening and wanted to put my hat in the ring. I've spent the last 3 years building production React + Node.js applications backed by PostgreSQL — most recently shipping a multi-tenant analytics product used by 12k+ monthly users.\n\nA few things from your JD that lined up well:\n  • React on the front, Node services on the back\n  • PostgreSQL as primary store\n  • Strong ownership mindset on small teams\n\nI'd love to walk you through a couple of relevant projects. My resume is attached, and I'm available for a call any time this week.\n\nThanks for considering,\nArbaj Alam\n+91 98xxx xxxxx",
  },
  {
    id: "app_002",
    companyName: "Stripe",
    jobTitle: "Backend Engineer, Payments",
    hrEmail: "talent@stripe.com",
    jobLocation: "Bengaluru, India",
    employmentType: "Full-time",
    status: "SENT",
    createdAt: "2026-05-21T14:02:00Z",
    sentAt: "2026-05-21T14:05:00Z",
    skillsRequired: ["Go", "Distributed Systems", "PostgreSQL"],
    skillsMatched: ["PostgreSQL"],
    source: "Extracted from LinkedIn post",
    emailSubject: "Backend Engineer, Payments — Arbaj Alam",
    emailBody: "Hi Stripe team,\n\nApplying for the Backend Engineer, Payments role...\n\nBest,\nArbaj",
  },
  {
    id: "app_003",
    companyName: "Linear",
    jobTitle: "Senior Software Engineer",
    hrEmail: "jobs@linear.app",
    jobLocation: "Remote",
    employmentType: "Full-time",
    status: "SENT",
    createdAt: "2026-05-20T08:30:00Z",
    sentAt: "2026-05-20T08:31:00Z",
    skillsRequired: ["TypeScript", "React", "GraphQL"],
    skillsMatched: ["TypeScript", "React"],
    source: "Extracted from LinkedIn post",
    emailSubject: "Senior SWE — Arbaj Alam",
    emailBody: "Hi Linear,\n\n...\n\nBest,\nArbaj",
  },
  {
    id: "app_004",
    companyName: "Acme Robotics",
    jobTitle: "Platform Engineer",
    hrEmail: "careers@acme-robotics.io",
    jobLocation: "Hyderabad",
    employmentType: "Contract",
    status: "FAILED",
    createdAt: "2026-05-19T16:45:00Z",
    skillsRequired: ["Kubernetes", "Go", "AWS"],
    skillsMatched: ["AWS"],
    source: "Extracted from LinkedIn post",
    emailSubject: "Platform Engineer — Arbaj Alam",
    emailBody: "Hi Acme,\n\n...\n\nBest,\nArbaj",
  },
  {
    id: "app_005",
    companyName: "Notion",
    jobTitle: "Full Stack Engineer",
    hrEmail: "people@notion.so",
    jobLocation: "Remote",
    employmentType: "Full-time",
    status: "DRAFT",
    createdAt: "2026-05-22T11:00:00Z",
    skillsRequired: ["React", "TypeScript", "Node.js"],
    skillsMatched: ["React", "TypeScript", "Node.js"],
    source: "Extracted from LinkedIn post",
    emailSubject: "Full Stack Engineer — Arbaj Alam",
    emailBody:
      "Hi Notion team,\n\nI'd love to be considered for the Full Stack Engineer role. I've shipped React + TypeScript + Node.js for the last 3 years and Notion has been my daily driver for nearly as long.\n\nResume attached.\n\nBest,\nArbaj Alam",
  },
];

export const mockStats = {
  draftsReady: 2,
  sentToday: 1,
  sentThisWeek: 7,
  totalSent: 47,
};

export const mockPlan = {
  id: "PRO" as PlanId,
  name: "Pro",
  price: "₹299/mo",
  used: 47,
  limit: 500,
  resetDate: "2026-06-01",
};

export const plans = [
  { id: "FREE", name: "Free", price: "₹0", apps: 50, users: 1 },
  { id: "PRO", name: "Pro", price: "₹299/mo", apps: 500, users: 1 },
  { id: "TEAM_STARTER", name: "Team Starter", price: "₹999/mo", apps: 1000, users: 5 },
  { id: "TEAM_PRO", name: "Team Pro", price: "₹2,999/mo", apps: 5000, users: 20 },
  { id: "ENTERPRISE", name: "Enterprise", price: "Custom", apps: -1, users: -1 },
] as const;

export const mockUsage = {
  appsPerDay: [
    { date: "May 15", apps: 4 },
    { date: "May 16", apps: 6 },
    { date: "May 17", apps: 2 },
    { date: "May 18", apps: 9 },
    { date: "May 19", apps: 11 },
    { date: "May 20", apps: 8 },
    { date: "May 21", apps: 5 },
    { date: "May 22", apps: 2 },
  ],
  topCompanies: ["Stripe", "Linear", "Notion", "redSling"],
  topRoles: ["Full Stack Engineer", "Backend Engineer"],
  avgDraftTimeMs: 4200,
};

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  linkedinConnected: boolean;
  joinedAt: string;
}

export const mockTeam: TeamMember[] = [
  {
    id: "m_1",
    name: "Arbaj Alam",
    email: "arbaj@gmail.com",
    role: "OWNER",
    linkedinConnected: true,
    joinedAt: "2026-02-10",
  },
  {
    id: "m_2",
    name: "Priya Sharma",
    email: "priya@acme.co",
    role: "ADMIN",
    linkedinConnected: true,
    joinedAt: "2026-03-04",
  },
  {
    id: "m_3",
    name: "Ravi Iyer",
    email: "ravi@acme.co",
    role: "MEMBER",
    linkedinConnected: false,
    joinedAt: "2026-04-12",
  },
];

export const mockResume = {
  fileName: "Arbaj_Alam_Resume_2026.pdf",
  uploadedAt: "2026-05-10",
  sizeKb: 218,
};
