# Features Automation System

**Complete intelligence-gathering automation for The Council**

## Overview

The Features Automation System provides automated intelligence gathering from GitHub and Reddit to feed actionable insights to the Council's expert system. Reports are validated by the Ruthless Judge and can be routed to Council experts for analysis.

## Architecture

```
Intelligence Sources (GitHub/Reddit)
          ↓
    Feature Executors
          ↓
   Ruthless Judge (Validation)
          ↓
   Council Experts (Analysis)
          ↓
    Reports & Storage
```

## Features

### GitHub Intelligence

1. **GitHub Trending Scanner** (`github-trending`)
   - Scans trending repositories
   - Identifies emerging technologies
   - Detects market opportunities
   - Status: ✅ Implemented

2. **GitHub Issues Analyzer** (`github-issues-analyzer`)
   - Analyzes common problems
   - Identifies bug patterns
   - Extracts feature requests
   - Status: ✅ Implemented

3. **GitHub Stars Tracker** (`github-stars-tracker`)
   - Monitors star growth
   - Tracks repository health
   - Analyzes community engagement
   - Status: ✅ Implemented

### Reddit Intelligence

4. **Reddit Pain Point Extractor** (`reddit-pain-points`)
   - Extracts customer frustrations
   - Identifies unmet needs
   - Analyzes discussion sentiment
   - Status: ✅ Implemented

5. **Reddit Sentiment Analyzer** (`reddit-sentiment-analyzer`)
   - Analyzes sentiment patterns
   - Identifies emotional trends
   - Tracks keyword popularity
   - Status: ✅ Implemented

### Hybrid Intelligence

6. **Market Gap Identifier** (`market-gap-identifier`)
   - Combines GitHub + Reddit data
   - Identifies underserved markets
   - Cross-references pain points with solutions
   - Status: ✅ Implemented

## Components

### Stores (Zustand + IndexedDB)

- **`useFeaturesStore`**: Manages feature configurations, execution state, metrics
- **`useReportsStore`**: Manages generated reports, search, filtering

### UI Components

- **`FeaturesDashboard`**: Main dashboard with all features
- **`FeatureCard`**: Individual feature display with controls
- **`FeatureConfigModal`**: Comprehensive configuration interface (4 tabs)
- **`ReportsViewer`**: Browse and analyze generated reports

### Execution Engine

- **`ExecutionEngine`**: Orchestrates feature execution
  - Progress tracking
  - Error handling
  - Parallel/sequential execution
  - Automatic routing to Judge/Council

### Scheduling System

- **`AutomationScheduler`**: Cron-like scheduling
  - Hourly/Daily/Weekly/Monthly frequencies
  - Run on startup option
  - Automatic retries
  - Task management

### API Clients

- **`githubClient`**: GitHub REST API v3
  - Rate limiting (5000/hour with token)
  - Automatic retries
  - Repository search, issues, trending

- **`redditClient`**: Reddit JSON API
  - No authentication required
  - Subreddit posts
  - Filtering utilities

### Integration Systems

- **`ruthless-judge-router`**: Routes reports to synthesis engine
  - Converts to expert outputs format
  - Runs 3-tier validation (quick/balanced/deep)
  - Extracts key insights and warnings

- **`council-router`**: Routes validated reports to Council experts
  - Parallel/sequential execution
  - Expert consensus analysis
  - Conflict identification

## Usage

### Basic Usage

```typescript
import { executionEngine, scheduler } from '@features/automation';

// Execute a single feature
await executionEngine.executeFeature('github-trending');

// Execute multiple features in parallel
await executionEngine.executeMultiple(['github-trending', 'reddit-pain-points']);

// Schedule a feature for automatic execution
scheduler.scheduleFeature(feature);
```

### Configuration

```typescript
import { useFeaturesStore } from '@features/automation';

const store = useFeaturesStore();

// Update feature configuration
store.updateFeature('github-trending', {
  targets: {
    github: {
      topics: ['ai', 'machine-learning'],
      minStars: 100,
    },
  },
});

// Enable/disable feature
store.toggleFeature('github-trending', true);
```

### Reports

```typescript
import { useReportsStore } from '@features/automation';

const reports = useReportsStore();

// Search reports
const results = reports.searchReports('market gap');

// Filter reports
const githubReports = reports.filterReports({ category: 'github' });

// Get report by ID
const report = reports.getReport('report-123');
```

## Configuration Options

### Execution Settings

- **Run Mode**: Manual, Scheduled
- **Schedule**: Hourly, Daily, Weekly, Monthly
- **Limits**: Max runtime, API requests, data points
- **Retries**: Attempts, cooldown period

### Targets

#### GitHub
- Topics (e.g., ['ai', 'saas'])
- Languages (e.g., ['TypeScript', 'Python'])
- Star range (min/max)
- Time range (daily, weekly, monthly)
- Repositories (specific repos to track)

#### Reddit
- Subreddits (e.g., ['SaaS', 'startups'])
- Sort by (hot, top, new)
- Max posts per subreddit
- Min upvotes threshold
- Include comments

#### Niches
- Primary niche
- Keywords (interests)
- Excluded keywords (filters)

### Processing

- **Filters**: Quality score, engagement, recency, sentiment
- **Analysis**: Sentiment, trending, pain points, opportunities
- **AI Enhancement**: Enable, model selection, custom prompts

### Output

- **Format**: Structured, raw, mixed
- **Sections**: Summary, findings, pain points, opportunities
- **Storage**: IndexedDB, JSON export, retention days
- **Routing**: Ruthless Judge mode, Council experts, execution mode

## Data Flow

1. **Feature Execution**
   ```
   User triggers → Execution engine starts → Feature executor runs
   ```

2. **Data Collection**
   ```
   API clients fetch data → Parse & filter → Extract insights
   ```

3. **Report Generation**
   ```
   Structure findings → Calculate metrics → Create report
   ```

4. **Validation (Optional)**
   ```
   Route to Ruthless Judge → 3-tier synthesis → Add verdict
   ```

5. **Analysis (Optional)**
   ```
   Route to Council → Expert consultation → Add synthesis
   ```

6. **Storage**
   ```
   Save to IndexedDB → Update metrics → Notify user
   ```

## Rate Limits

### GitHub
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour
- **Search**: 10 requests/minute

Configure token in feature settings for higher limits.

### Reddit
- **Public API**: ~60 requests/minute
- **No authentication** required for public data

## Scheduling

### Frequency Options

- **Hourly**: Every N hours
- **Daily**: Every N days at specific time
- **Weekly**: Every N weeks on specific day
- **Monthly**: Every N months on specific date

### Multipliers

Use `intervalMultiplier` to run every N periods:
- `frequency: 'daily', intervalMultiplier: 3` = Every 3 days
- `frequency: 'weekly', intervalMultiplier: 2` = Every 2 weeks

### Run on Startup

Enable `runOnStartup` to execute immediately when scheduler initializes.

## Error Handling

- **Automatic retries**: Configurable attempts with exponential backoff
- **Partial success**: Reports saved even if some sources fail
- **Error logging**: All errors logged to console with context
- **Notifications**: Optional alerts on completion/error

## Performance

- **Parallel execution**: Multiple features run concurrently
- **Progress tracking**: Real-time updates during execution
- **Caching**: API responses cached to reduce redundant requests
- **Rate limiting**: Automatic throttling to respect API limits

## Development

### Adding New Features

1. Create executor in `/lib/features/your-feature.ts`
2. Add feature definition to `/constants/feature-definitions.ts`
3. Register executor in `/lib/execution-engine.ts`
4. Update types in `/types/feature.types.ts` if needed

### Testing

```bash
# Type checking
npm run typecheck

# Run development server
npm run dev

# Test feature execution
# Navigate to /features in app, enable feature, click "Run Now"
```

## Integration Points

### Ruthless Judge
- Located: `/src/lib/synthesis-engine.ts`
- Tiers: Quick (⚡), Balanced (🎯), Deep (🔍)
- Input: Report with findings
- Output: Verdict with insights and warnings

### Council
- Located: `/src/features/council/`
- Experts: 7 pre-configured personas
- Input: Task with validated report
- Output: Expert outputs + synthesis

### Storage
- **IndexedDB**: Persistent storage via Dexie
- **Stores**: Zustand with persistence middleware
- **Retention**: Automatic cleanup based on retention days

## API Reference

### Execution Engine

```typescript
class ExecutionEngine {
  executeFeature(featureId: string): Promise<ExecutionResult>
  executeMultiple(featureIds: string[]): Promise<ExecutionResult[]>
  startAll(): Promise<void>
  routeToRuthlessJudge(report: FeatureReport, mode: string): Promise<void>
  routeToCouncil(report: FeatureReport, config: any): Promise<void>
}
```

### Scheduler

```typescript
class AutomationScheduler {
  initialize(): void
  scheduleFeature(feature: FeatureConfiguration): void
  unscheduleFeature(featureId: string): void
  updateSchedule(featureId: string): void
  getNextRunTime(featureId: string): Date | null
  getScheduledTasks(): ScheduledTask[]
  stopAll(): void
  restart(): void
}
```

### GitHub Client

```typescript
class GitHubClient {
  searchRepositories(query: string, options?: SearchOptions): Promise<Repository[]>
  getTrendingRepositories(options?: TrendingOptions): Promise<Repository[]>
  getRepositoryIssues(owner: string, repo: string, options?: IssuesOptions): Promise<Issue[]>
  getRateLimit(): Promise<RateLimitInfo>
}
```

### Reddit Client

```typescript
class RedditClient {
  getSubredditPosts(subreddit: string, options?: PostOptions): Promise<Post[]>
  getMultipleSubredditPosts(subreddits: string[], options?: PostOptions): Promise<Post[]>
  searchPosts(query: string, options?: SearchOptions): Promise<Post[]>
  filterByEngagement(posts: Post[], minScore: number): Post[]
  filterNegativeSentiment(posts: Post[]): Post[]
}
```

## Status

**Current Implementation Status**: ✅ Core System Complete

- ✅ 6 intelligence features
- ✅ Execution engine with orchestration
- ✅ Ruthless Judge integration
- ✅ Council routing integration
- ✅ Scheduling system
- ✅ Report viewer UI
- ✅ Configuration UI (4-tab modal)
- ✅ GitHub & Reddit API clients
- ✅ TypeScript strict mode compliance

**Future Enhancements**:
- 🔄 Additional 9 features from roadmap
- 🔄 Advanced analytics dashboard
- 🔄 Historical trend analysis
- 🔄 Export to various formats (PDF, CSV)
- 🔄 Custom feature templates

---

**Last Updated**: January 7, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
