// Feature Automation Type Definitions

export type FeatureCategory = 'github' | 'reddit' | 'hybrid' | 'other';
export type FeatureStatus = 'active' | 'inactive' | 'running' | 'error' | 'paused';
export type RunMode = 'scheduled' | 'manual' | 'triggered';
export type Frequency = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface FeatureMetrics {
  lastRun: Date | null;
  nextRun: Date | null;
  successRate: number;
  totalRuns: number;
  reportsGenerated: number;
  averageExecutionTime: number;
  lastError?: string;
}

export interface ScheduleConfig {
  frequency: Frequency;
  interval: number;
  specificTimes?: string[];
  daysOfWeek?: number[];
  timezone: string;
}

export interface ExecutionLimits {
  maxRunTime: number;
  maxAPIRequests: number;
  maxDataPoints: number;
  retryAttempts: number;
  cooldownPeriod: number;
}

export interface GitHubTargets {
  repositories?: string[];
  organizations?: string[];
  topics?: string[];
  languages?: string[];
  stars?: { min?: number; max?: number };
  searchQuery?: string;
  excludePatterns?: string[];
}

export interface RedditTargets {
  subreddits: string[];
  sortBy: 'hot' | 'new' | 'top' | 'rising';
  timeRange: 'hour' | 'day' | 'week' | 'month' | 'year';
  minUpvotes?: number;
  minComments?: number;
  keywords?: string[];
  excludeKeywords?: string[];
  flairFilters?: string[];
}

export interface NicheSpec {
  primary: string;
  secondary?: string[];
  keywords: string[];
  excludedKeywords: string[];
  targetAudience?: string;
}

export interface DataFilters {
  minQualityScore?: number;
  requireEngagement?: boolean;
  sentimentFilter?: 'positive' | 'negative' | 'neutral' | 'all';
  recencyFilter?: number;
}

export interface AnalysisSettings {
  enableSentiment: boolean;
  enableTrending: boolean;
  enablePainPoints: boolean;
  enableOpportunities: boolean;
  deepAnalysis: boolean;
}

export interface AIEnhancement {
  enabled: boolean;
  model: string;
  promptTemplate: string;
  maxTokens: number;
}

export interface ReportFormat {
  type: 'structured' | 'narrative' | 'bullet-points' | 'mixed';
  includeRawData: boolean;
  includeCharts: boolean;
  includeMetadata: boolean;
}

export interface ReportSections {
  summary: boolean;
  keyFindings: boolean;
  painPoints: boolean;
  opportunities: boolean;
  recommendations: boolean;
  rawData: boolean;
  charts: boolean;
}

export interface ReportStorage {
  saveToIndexedDB: boolean;
  exportToJSON: boolean;
  retentionDays: number;
}

export interface ReportRouting {
  sendToRuthlessJudge: boolean;
  ruthlessJudgeMode: 'quick' | 'balanced' | 'deep';
  sendToCouncil: boolean;
  specificExperts?: string[];
  executionMode: 'parallel' | 'sequential' | 'consensus' | 'adversarial';
  directToExperts?: string[];
  notifyOnComplete: boolean;
  notifyOnError: boolean;
}

export interface FeatureConfiguration {
  featureId: string;
  featureName: string;
  enabled: boolean;
  runMode: RunMode;
  schedule?: ScheduleConfig;
  limits: ExecutionLimits;
  targets: {
    github?: GitHubTargets;
    reddit?: RedditTargets;
    niches?: NicheSpec;
  };
  processing: {
    filters: DataFilters;
    analysis: AnalysisSettings;
    aiEnhancement?: AIEnhancement;
  };
  output: {
    format: ReportFormat;
    sections: ReportSections;
    storage: ReportStorage;
    routing: ReportRouting;
  };
}

export interface Finding {
  id: string;
  type: 'insight' | 'trend' | 'pain-point' | 'opportunity';
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}

export interface PainPoint {
  id: string;
  description: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high';
  sources: string[];
  category: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  marketSize: string;
  competition: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  confidence: number;
  painPointsAddressed: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  actions: string[];
}

export interface RuthlessJudgeVerdict {
  verdict: string;
  confidence: number;
  keyInsights: string[];
  warnings: string[];
  recommendations: string[];
  processedAt: Date;
}

export interface CouncilSynthesis {
  synthesis: string;
  expertOutputs: Record<string, string>;
  consensus: string[];
  conflicts: string[];
  processedAt: Date;
}

export interface FeatureReport {
  id: string;
  featureId: string;
  featureName: string;
  executionId: string;
  timestamp: Date;
  executionTime: number;
  status: 'success' | 'partial' | 'failed';
  data: {
    summary: string;
    keyFindings: Finding[];
    painPoints?: PainPoint[];
    opportunities?: Opportunity[];
    recommendations?: Recommendation[];
    rawData?: unknown[];
    metadata: {
      sourcesScanned: number;
      dataPointsCollected: number;
      qualityScore: number;
    };
  };
  processing: {
    ruthlessJudgeProcessed: boolean;
    ruthlessJudgeVerdict?: RuthlessJudgeVerdict;
    sentToCouncil: boolean;
    councilSynthesis?: CouncilSynthesis;
  };
  actions?: {
    exported: boolean;
    shared: boolean;
    archived: boolean;
  };
}

export interface ExecutionResult {
  featureId: string;
  executionId: string;
  status: 'success' | 'failed' | 'partial';
  report?: FeatureReport;
  error?: string;
  executionTime: number;
  timestamp: Date;
}

export interface ActiveExecution {
  featureId: string;
  executionId: string;
  startTime: Date;
  progress: number;
  currentPhase: string;
}

export interface FeatureDefinition {
  id: string;
  name: string;
  category: FeatureCategory;
  description: string;
  icon: string;
  defaultConfig: FeatureConfiguration;
  enabled: boolean;
  status: FeatureStatus;
  metrics: FeatureMetrics;
}

export interface ExecutionHistory {
  executionId: string;
  featureId: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'partial';
  executionTime: number;
  error?: string;
  reportId?: string;
}
