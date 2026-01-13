// Export main components
export { FeaturesDashboard } from './components/FeaturesDashboard';
export { FeatureCard } from './components/FeatureCard';
export { FeatureConfigModal } from './components/FeatureConfigModal';
export { ReportsViewer } from './components/ReportsViewer';

// Export stores
export { useFeaturesStore } from './store/features-store';
export { useReportsStore } from './store/reports-store';

// Export execution engine
export { executionEngine } from './lib/execution-engine';

// Export scheduler
export { scheduler } from './lib/scheduler';

// Export API clients
export { githubClient } from './lib/api/github-client';
export { redditClient } from './lib/api/reddit-client';

// Export feature executors
export { executeGitHubTrendingScanner } from './lib/features/github-trending';
export { executeRedditPainPointExtractor } from './lib/features/reddit-pain-points';
export { executeMarketGapIdentifier } from './lib/features/market-gap-identifier';
export { executeGitHubIssuesAnalyzer } from './lib/features/github-issues-analyzer';
export { executeGitHubStarsTracker } from './lib/features/github-stars-tracker';
export { executeRedditSentimentAnalyzer } from './lib/features/reddit-sentiment-analyzer';

// Export types
export type {
  FeatureDefinition,
  FeatureConfiguration,
  FeatureReport,
  FeatureMetrics,
  ExecutionResult,
  Finding,
  PainPoint,
  Opportunity,
  Recommendation,
  RuthlessJudgeVerdict,
  CouncilSynthesis,
} from './types/feature.types';

// Export feature definitions
export {
  FEATURE_DEFINITIONS,
  getFeatureById,
  getFeaturesByCategory,
  getEnabledFeatures,
} from './constants/feature-definitions';
