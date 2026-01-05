# [# 🧠 THE COUNCIL - GITHUB COPILOT PRO INSTRUCTIONS

**Project:** The Council - AI-Powered Multi-Perspective Decision Engine  
**Owner:** Solo non-technical founder seeking passive income  
**Device:** Samsung tablet (limited resources)  
**Budget:** $0 infrastructure, low-budget investment, usage-based AI only  
**Users:** 1 (personal use only)  
**Stack:** React 18 + TypeScript 5.8 + Vite 6 + Zustand + Dexie + OpenRouter

---

## 🚀 DYNAMIC SESSION START PROTOCOL (MANDATORY - 60 SECONDS)

**BEFORE writing ANY code, you MUST:**

### Step 1: Scan Current State (30s)
```bash
# What exists NOW?
find src/ -name "*.ts*" -o -name "*.tsx" | head -30
npm run typecheck 2>&1 | head -20
git log --oneline -5
grep -r "ErrorBoundary" src/ || echo "NO ERROR BOUNDARIES"
cat package.json | jq '.dependencies' 2>/dev/null || cat package.json
```

### Step 2: Announce Understanding (15s)
```
📊 STATE SCAN COMPLETE
├── Structure: [e.g., "Features-based, Index.tsx 800 lines"]
├── Issues: [e.g., "5 TypeScript errors in ai-client.ts"]
├── Safety: [e.g., "ErrorBoundary exists in App.tsx" or "NONE"]
├── Recent: [e.g., "Last commit: added Zustand stores"]
└── Ready for: [user's request + context from scan]
```

### Step 3: Adaptive Rule Selection (15s)
Based on scan results, prioritize:

| Condition Found | Immediate Action |
|-----------------|------------------|
| No ErrorBoundary | P0: Install Error Boundaries FIRST |
| TypeScript errors > 10 | P0: Batch fix before new features |
| Index.tsx > 500 lines | P1: Propose split before adding features |
| Elite pattern already exists | Use existing, don't reinvent |
| Custom code working | Document source, don't replace unnecessarily |

---

## ⚖️ THE 5 ABSOLUTE RULES (NEVER VIOLATE)

### Rule 1: COMPLETE FILES ONLY
```typescript
❌ FORBIDDEN (will cause PR rejection):
"// ... existing code ..."
"// ... rest of the file ..."
"// Add this above the return statement"

✅ REQUIRED:
- ALWAYS show COMPLETE file from line 1 to end
- Include ALL imports and exports
- If file > 400 lines, propose splitting FIRST
```

**Why:** Partial code snippets broke the app 150+ times in previous attempts with IDX/Replit.

---

### Rule 2: MIRROR BEFORE INVENT (Exploit-First Philosophy)
```typescript
// Decision tree for EVERY feature request
if (pattern_exists_in_elite_repo()) {
  return mirror_from_github_repo();
} else if (searchable_on_github()) {
  return search_and_mirror();
} else {
  return write_minimal_custom_and_document_why();
}
```

**Process:**
1. Check "Elite Repo Database" below
2. Find the pattern in that repo
3. Mirror their implementation
4. Adapt to our TypeScript/React setup
5. Document source in PR description

**Example:**
```
Task: "Add error handling"
❌ Wrong: Write custom try-catch from scratch
✅ Correct:
  1. Check database → Found: bvaughn/react-error-boundary
  2. Copy their ErrorBoundary.tsx pattern
  3. Adapt TypeScript types for our app
  4. PR title: "feat(error-handling): add error boundaries (mirrored from bvaughn)"
```

---

### Rule 3: TABLET-FIRST CONSTRAINTS
```yaml
Hardware: Samsung tablet, limited RAM, mobile CPU, battery-sensitive

CANNOT use:
  ❌ Docker containers
  ❌ Heavy build tools (webpack, parcel)
  ❌ Native dependencies (node-gyp)
  ❌ Packages > 2MB
  ❌ Heavy npm scripts

MUST use:
  ✅ Vite only (fast, lightweight)
  ✅ ESM modules
  ✅ CDN imports when possible
  ✅ Code splitting with React.lazy()
  ✅ Total bundle < 2MB
```

---

### Rule 4: PERSONAL USE ONLY (No Over-Engineering)
```yaml
This app is for ONE USER (solo founder), not a SaaS.

DO NOT implement:
  ❌ User authentication/login
  ❌ Multi-tenancy
  ❌ Usage analytics/telemetry
  ❌ A/B testing, feature flags
  ❌ Rate limiting
  ❌ GDPR compliance
  ❌ "What if we scale to 10,000 users..."
  ❌ Microservices, GraphQL, SSR

DO focus on:
  ✅ Works on Samsung tablet
  ✅ Zero infrastructure costs
  ✅ Solo-maintainable (clear, simple code)
  ✅ Solves TODAY's problem
  ✅ Works offline when possible
  ✅ Passive income potential through automation
```

---

### Rule 5: REVERSIBLE CHANGES ONLY
```yaml
Before ANY refactor:
  1. Create git branch (never work on main directly)
  2. Verify Error Boundaries are installed
  3. Make atomic commits (1 file = 1 commit)
  4. Keep old code working until new code proven
  5. Document rollback strategy in PR

NEVER:
  ❌ Delete old code before new code works
  ❌ Make multi-file changes in one commit
  ❌ Merge to main without verification

ALWAYS:
  ✅ Keep rollback option available
  ✅ Test each commit independently
  ✅ Document what changed and why
```

---

## 🗃️ ELITE REPO DATABASE (Check Before Writing Code)

**Mirror these patterns FIRST before inventing custom solutions:**

### 🏗️ Architecture Patterns

| Pattern | Repo | Files to Mirror | Status | Priority |
|---------|------|----------------|--------|----------|
| **Error Boundaries** | `bvaughn/react-error-boundary` | `src/ErrorBoundary.tsx` | Auto-detect | 🔥 CRITICAL |
| **Folder Structure** | `alan2207/bulletproof-react` | `src/features/` organization | Auto-detect | HIGH |
| **Type Safety** | `colinhacks/zod` | Schema validation patterns | Auto-detect | HIGH |

### 🤖 AI Agent Patterns

| Pattern | Repo | Files to Mirror | Status | Priority |
|---------|------|----------------|--------|----------|
| **Agent Orchestration** | `langchain-ai/langchainjs` | `src/chains/sequential_chain.ts` | Auto-detect | MEDIUM |
| **Streaming Responses** | `vercel/ai` | `packages/react/src/use-chat.ts` | Auto-detect | MEDIUM |

### 💾 Automation & Cost Reduction

| Pattern | Repo | Files to Mirror | Status | Priority |
|---------|------|----------------|--------|----------|
| **GitHub Actions** | `upptime/upptime` | `.github/workflows/uptime.yml` | Auto-detect | HIGH |
| **HTTP Caching** | `sindresorhus/got` | `source/core/utils/cache.ts` | Auto-detect | HIGH |
| **State Management** | `pmndrs/zustand` | Official examples | Auto-detect | MEDIUM |

### 🛡️ Safety & Maintenance

| Pattern | Repo | Files to Mirror | Status | Priority |
|---------|------|----------------|--------|----------|
| **DB Migrations** | `dexie/Dexie.js` | `samples/dexie-cloud-todo-app/db.ts` | Only if needed | LOW |
| **Import Auto-Fix** | `facebook/jscodeshift` | `transforms/update-imports.ts` | Only if moving files | LOW |

---

## 🔄 ADAPTIVE WORKFLOW

### When User Requests a Change:

```
┌─────────────────┐
│  User Request   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Scan Current   │ (60s max)
│  State First    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Elite     │
│ Repo Database   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│ Found │ │  Not  │
│       │ │ Found │
└───┬───┘ └───┬───┘
    │         │
    │         ▼
    │    ┌────────────┐
    │    │ Search     │
    │    │ GitHub     │
    │    │ (3min max) │
    │    └─────┬──────┘
    │          │
    │     ┌────┴────┐
    │     │         │
    │     ▼         ▼
    │  ┌──────┐ ┌──────┐
    │  │Found │ │  Not │
    │  │      │ │Found │
    │  └───┬──┘ └───┬──┘
    │      │        │
    ▼      ▼        ▼
┌────────────────────┐
│  Mirror Pattern    │
│       OR           │
│  Write Minimal     │
│  Custom (document) │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│  Complete File     │
│  + Verification    │
│  + State Update    │
└────────────────────┘
```

### If Something Breaks:

```yaml
1. Revert: git revert HEAD (rollback last commit)
2. Search: Check elite repo for correct solution
3. Circuit Breaker: If same file modified twice → STOP
4. Root Cause: Search GitHub for how others solved this
5. Retry: Use proven pattern from elite repo
```

---

## 🚨 ANTI-HYDRA PROTOCOL (Prevent Fix Loops)

**Hydra Problem:** Fixing one bug creates two more.

### Before Making ANY Change:

```typescript
function preventHydra(proposedChange: string) {
  // 1. Check if we tried this before
  if (state.failed_attempts.includes(proposedChange)) {
    return "LOOP DETECTED: We tried this already. Searching GitHub for alternative...";
  }
  
  // 2. Analyze impact
  const affected = scanDependencies(proposedChange);
  if (affected.length > 3) {
    return `⚠️ This affects ${affected.length} files. Should I add Error Boundaries first?`;
  }
  
  // 3. Circuit breaker
  if (attempts_on_this_file >= 2) {
    return "CIRCUIT BREAKER: Stopping. Searching elite repos for root cause solution.";
  }
  
  return "Safe to proceed";
}
```

---

## 📊 ZERO INFRASTRUCTURE COSTS (Budget Constraints)

```yaml
Budget: $0/month infrastructure, low initial investment

ALLOWED (Free Tier):
  ✅ GitHub Actions (2,000 free minutes/month) - for passive automation
  ✅ IndexedDB (browser storage)
  ✅ localStorage (small data only)
  ✅ OpenRouter API (usage-based, pay-per-use only)
  ✅ Public APIs with no auth

FORBIDDEN (Costs Money):
  ❌ Firebase, Supabase, PlanetScale
  ❌ AWS, GCS, Azure, S3
  ❌ Hosted databases (MongoDB Atlas, etc.)
  ❌ Monitoring services (Sentry paid tier)
  ❌ CDN services (Cloudflare paid plans)
```

---

## 📝 PR REQUIREMENTS

### PR Title Format:
```
type(scope): brief description (mirrored from repo)

Examples:
✅ feat(error-handling): add error boundaries (bvaughn/react-error-boundary)
✅ refactor(structure): split Index.tsx into features (bulletproof-react)
✅ fix(types): replace 'any' with Zod schemas (colinhacks/zod)
```

### PR Description Template:
```markdown
## 🔍 What Changed
- [Bullet list of files modified]
- [What functionality was added/changed]

## 🎯 Pattern Source
Mirrored from: [repo-name/file-path]
Source URL: [GitHub link to the pattern]

OR

Custom implementation (no elite pattern found)
Rationale: [why custom was necessary]

## ⚠️ Impact Analysis
Files directly affected: [list]
Files indirectly affected: [list]
Risk level: [LOW/MEDIUM/HIGH]

## ✅ Verification
- TypeScript: [✓/✗] npm run typecheck
- Linting: [✓/✗] npm run lint
- Dev Server: [✓/✗] npm run dev
- Manual Testing: [what you tested and results]

## 🔄 Rollback Strategy
If this breaks something:
1. [How to rollback]
2. [Which commit to revert to]
```

### Commit Message Format:
```bash
# Use conventional commits:
type(scope): description

# Types: feat, fix, refactor, docs, style, test, chore

# Examples:
✅ feat(error-handling): add ErrorBoundary component
✅ refactor(pages): split Index.tsx into 4 components
✅ fix(types): remove all 'any' types from ai-client.ts
```

---

## 🎯 TASK PRIORITIZATION RULES

### When Multiple Tasks Exist:

```yaml
Priority 0 - BLOCKING (Fix First):
  - TypeScript compilation errors
  - Runtime crashes
  - Broken builds

Priority 1 - CRITICAL (Add Safety):
  - Install Error Boundaries (if missing)
  - Add retry logic for API calls
  - Split files > 500 lines

Priority 2 - IMPORTANT (Improve Structure):
  - Replace 'any' types with proper types
  - Type IndexedDB operations
  - Organize into feature folders

Priority 3 - NICE-TO-HAVE (Optimize):
  - Add GitHub Actions automation
  - Implement HTTP caching
  - Performance improvements
```

### When Choosing Approach:

```yaml
1st choice: Mirror from elite repo (safest, fastest, proven)
2nd choice: Search GitHub for similar pattern (3 min max)
3rd choice: Write minimal custom code (last resort, document why)
```

---

## ✅ VALIDATION BEFORE MERGE

**Every PR MUST pass these checks:**

```bash
# 1. TypeScript compilation (REQUIRED)
npm run typecheck
# Expected: "Found 0 errors"

# 2. Linting (REQUIRED)
npm run lint
# Expected: No errors

# 3. Dev server (REQUIRED)
npm run dev
# Expected: Starts successfully on http://localhost:5000

# 4. Build (REQUIRED)
npm run build
# Expected: Build succeeds, bundle < 2MB
```

### Manual Testing (REQUIRED):
```yaml
1. App loads without errors
2. Core functionality works:
   - Expert panel selection
   - Synthesis generates output
   - Error boundaries catch errors (test by throwing intentional error)
3. No regressions (everything that worked before still works)
```

---

## 📊 STATE TRACKING (Auto-Update After Each Task)

**Update `.council/state.json` after completing ANY task:**

```json
{
  "last_change": {
    "timestamp": "2025-01-05T10:30:00Z",
    "task": "[what we did]",
    "exploit_used": "[repo mirrored or 'custom']",
    "files_changed": ["[list of files]"],
    "status": "success",
    "duration_minutes": 45,
    "commits": 4
  },
  "metrics": {
    "total_exploits_used": 3,
    "total_custom_code_lines": 0,
    "pr_success_rate": 1.0,
    "circuit_breaker_triggers": 0
  },
  "failed_attempts": {
    "[approach]": {
      "tried": "[what we did]",
      "why_failed": "[root cause]",
      "learned": "[lesson]",
      "next_try": "[alternative approach]"
    }
  }
}
```

---

## 🔒 TYPESCRIPT STRICT MODE (Enforce Quality)

```yaml
BANNED:
  ❌ any types (use unknown instead)
  ❌ @ts-ignore comments (fix the error properly)
  ❌ Non-null assertions (!) without guards
  ❌ Implicit any
  ❌ Loose type checking

REQUIRED:
  ✅ strict: true in tsconfig.json
  ✅ All functions have explicit return types
  ✅ All API responses validated with Zod
  ✅ Zero 'any' anywhere in the codebase
```

---

## 🔐 SECURITY GUIDELINES

```yaml
NEVER commit:
  ❌ API keys or secrets
  ❌ Environment variables with sensitive data
  ❌ User data or PII
  ❌ Database credentials

ALWAYS:
  ✅ Use environment variables for secrets
  ✅ Add .env to .gitignore
  ✅ Document required env vars in .env.example
```

---

## 🎓 LEARNING FROM MISTAKES

**If a PR fails or needs revision:**

```yaml
1. Document in .council/state.json under failed_attempts:
   {
     "approach": "[what we tried]",
     "why_failed": "[root cause]",
     "learned": "[lesson]",
     "next_try": "[alternative]"
   }

2. Don't repeat the same approach (circuit breaker)
3. Search elite repo for correct solution
4. Try again with proven pattern
```

---

## ✅ FINAL CHECKLIST (Before Submitting ANY PR)

### Code Quality:
- [ ] Zero TypeScript errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] No 'any' types introduced
- [ ] All functions have return types
- [ ] Complete files (no "..." snippets)

### Pattern Compliance:
- [ ] Mirrored from elite repo (or documented why custom)
- [ ] Source linked in PR description
- [ ] Follows project structure conventions
- [ ] Uses existing patterns (Zustand, Zod, etc.)

### Constraints:
- [ ] Works on tablet (no heavy dependencies)
- [ ] Zero infrastructure costs
- [ ] Personal use only (no auth/analytics)
- [ ] Reversible (can rollback easily)

### Testing:
- [ ] Dev server starts (`npm run dev`)
- [ ] Core functionality works
- [ ] No regressions
- [ ] Manual testing completed

### Documentation:
- [ ] PR description complete
- [ ] Impact analysis included
- [ ] Verification proof provided
- [ ] Rollback strategy documented

---

## 📚 ELITE REPO REFERENCE LINKS

Study these repos for patterns:
- https://github.com/bvaughn/react-error-boundary
- https://github.com/alan2207/bulletproof-react
- https://github.com/colinhacks/zod
- https://github.com/langchain-ai/langchainjs
- https://github.com/vercel/ai
- https://github.com/pmndrs/zustand
- https://github.com/dexie/Dexie.js
- https://github.com/upptime/upptime
- https://github.com/sindresorhus/got
- https://github.com/facebook/jscodeshift

---

## 🤖 MODEL CONFIGURATION

```yaml
Recommended Model: GPT-4 Turbo (or Auto)
Temperature: 0.1 (low creativity, high consistency)
Max Tokens: 8000 (enough for complete files)

Why GPT-4:
  - Best TypeScript/React understanding
  - 128K context = reads entire codebase
  - Most consistent instruction following
  - Best iterative improvement from feedback

Fallback Strategy:
  1. Start with Auto (GitHub's choice)
  2. If inconsistent → switch to GPT-4
  3. If too slow → Claude 3.5 Sonnet for planning
  4. Never use: GPT-3.5 (ignores complex instructions)
```

---

**END OF INSTRUCTIONS**

*These instructions apply to ALL Copilot agents, ALL Copilot sessions, and ALL code changes.*  
*Violating these rules will result in PR rejection.*  
*Last updated: 2025-01-05*

---

## 🚀 QUICK START EXAMPLE

**First issue to create on GitHub.com:**

```markdown
Title: Fix TypeScript errors and validate build

@copilot Please fix all TypeScript compilation errors in this project.

**Instructions:**
1. Run `npm run typecheck` to identify all errors
2. Fix each error following .github/copilot-instructions.md rules
3. Make atomic commits (1 fix = 1 commit)
4. Mirror patterns from elite repos when possible
5. Document which patterns you used

**Success criteria:**
- `npm run typecheck` shows 0 errors
- `npm run build` succeeds
- `npm run dev` starts without errors
- All changes are reversible

**Constraints:**
- Follow exploit-first philosophy (check elite repo database)
- No partial code snippets
- Complete files only
- Keep tablet constraints in mind

Assign to: @copilot
```
]
