const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Verify Git configuration
try {
  const email = execSync('git config user.email').toString().trim();
  const name = execSync('git config user.name').toString().trim();
  console.log(`Using Git configuration:`);
  console.log(`  Name:  ${name}`);
  console.log(`  Email: ${email}\n`);
} catch (error) {
  console.error("ERROR: Git configurations not found.");
  process.exit(1);
}

// 2. Configuration for contribution range
const START_DATE = new Date('2025-08-01T09:00:00Z');
const END_DATE = new Date('2026-01-15T21:00:00Z');
const gaps = [1, 5, 9];

const commitMessages = [
  "feat: implement job application tracking table",
  "fix: resolve layout spacing on mobile dashboard",
  "feat: add resume upload and parsing helper",
  "docs: update API integration guide",
  "style: redesign status badge colors",
  "feat: add interview scheduler calendar view",
  "fix: correct date parsing for deadline field",
  "refactor: simplify state management for application form",
  "feat: integrate email notifications for upcoming interviews",
  "test: add unit tests for resume parsing service",
  "fix: solve console warning for missing unique keys in list",
  "feat: add filter by status (applied, interview, offer, rejected)",
  "docs: document environment variable configuration",
  "feat: integrate search bar for job titles and companies",
  "perf: optimize dashboard loading time with lazy loading",
  "refactor: extract form fields into reusable components",
  "feat: add support for exporting applications list to CSV",
  "fix: handle empty state when search returns no results",
  "style: improve typography hierarchy in job card detail view",
  "feat: add notes section for individual applications",
  "fix: prevent duplicate application submissions",
  "feat: add salary range input and statistics chart",
  "refactor: upgrade TanStack Query syntax to latest version",
  "feat: add dark mode toggle option to settings",
  "docs: add screenshots and setup guide to README"
];

// Delete .lovable folder if it exists
const lovablePath = path.join(__dirname, '.lovable');
if (fs.existsSync(lovablePath)) {
  fs.rmSync(lovablePath, { recursive: true, force: true });
  console.log("Deleted .lovable directory.");
}

// Ensure changelog.txt exists in src directory
const srcDir = path.join(__dirname, 'src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}
const logFilePath = path.join(srcDir, 'changelog.txt');
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, 'Dream Job Apply Changelog\n');
}

// Start tracking git files
execSync('git add .');

// Create the first commit at START_DATE removing the .lovable directory
const firstDateStr = START_DATE.toISOString();
fs.appendFileSync(logFilePath, `[${firstDateStr}] chore: clean up legacy lovable settings\n`);
execSync('git add src/changelog.txt');
execSync(`git commit -m "chore: clean up legacy lovable configurations"`, {
  env: {
    ...process.env,
    GIT_AUTHOR_DATE: firstDateStr,
    GIT_COMMITTER_DATE: firstDateStr
  }
});

let currentDate = new Date(START_DATE);
// Advance past the first cleanup commit using a random gap
const initialGap = gaps[Math.floor(Math.random() * gaps.length)];
currentDate.setDate(currentDate.getDate() + initialGap + 1);

let totalCommits = 1;
let msgIndex = 0;

console.log('Generating contribution history...');

while (currentDate <= END_DATE) {
  // Generate random number of commits for the active day (1 to 4)
  const numCommits = Math.floor(Math.random() * 4) + 1;
  
  for (let i = 0; i < numCommits; i++) {
    const commitDate = new Date(currentDate);
    commitDate.setHours(Math.floor(Math.random() * 12) + 9); // Between 9 AM and 9 PM
    commitDate.setMinutes(Math.floor(Math.random() * 60));
    commitDate.setSeconds(Math.floor(Math.random() * 60));

    const dateStr = commitDate.toISOString();
    const message = commitMessages[msgIndex % commitMessages.length];
    msgIndex++;

    fs.appendFileSync(logFilePath, `[${dateStr}] ${message}\n`);
    execSync('git add src/changelog.txt');
    execSync(`git commit -m "${message}"`, {
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: dateStr,
        GIT_COMMITTER_DATE: dateStr
      }
    });
    totalCommits++;
  }

  // Random gap of 1, 5, or 9 days
  const gap = gaps[Math.floor(Math.random() * gaps.length)];
  currentDate.setDate(currentDate.getDate() + gap + 1);
}

console.log(`\nSuccess! Generated ${totalCommits} commits.`);
console.log('You can now force push to GitHub.');
