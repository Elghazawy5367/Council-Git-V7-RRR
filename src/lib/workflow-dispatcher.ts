/**
 * GitHub Actions Workflow Dispatcher
 * Triggers workflows with configuration from the app
 */

import { ScoutConfig, MirrorConfig, QualityConfig, SelfImproveConfig } from '@/features/council/store/feature-config-store';

export interface WorkflowDispatchOptions {
  owner: string;
  repo: string;
  workflow: string;
  ref?: string;
  inputs?: Record<string, string>;
}

/**
 * Generate GitHub Actions workflow dispatch URL
 * Opens GitHub's workflow dispatch page with pre-filled inputs
 */
export function generateWorkflowDispatchUrl(options: WorkflowDispatchOptions): string {
  const { owner, repo, workflow, ref = 'main' } = options;
  return `https://github.com/${owner}/${repo}/actions/workflows/${workflow}?ref=${ref}`;
}

/**
 * Generate inputs for Scout workflow from config
 */
export function getScoutWorkflowInputs(config: ScoutConfig): Record<string, string> {
  return {
    target_niche: config.targetNiche,
    depth: config.depth,
    min_stars: config.minStars.toString(),
    max_repos: config.maxRepos.toString(),
  };
}

/**
 * Generate inputs for Mirror workflow from config
 */
export function getMirrorWorkflowInputs(config: MirrorConfig): Record<string, string> {
  return {
    generate_report: config.generateReport.toString(),
  };
}

/**
 * Generate inputs for Quality workflow from config
 */
export function getQualityWorkflowInputs(config: QualityConfig): Record<string, string> {
  return {
    auto_fix: config.autoFix.toString(),
    run_linter: config.runLinter.toString(),
    run_typecheck: config.runTypeCheck.toString(),
  };
}

/**
 * Generate inputs for Self-Improve workflow from config
 */
export function getSelfImproveWorkflowInputs(config: SelfImproveConfig): Record<string, string> {
  return {
    niche: config.niche,
    min_stars: config.minStars.toString(),
    max_repos: config.maxRepos.toString(),
  };
}

/**
 * Export configuration as GitHub Actions workflow YAML snippet
 * User can copy this and update their workflow file
 */
export function exportConfigAsYaml(
  feature: 'scout' | 'mirror' | 'quality' | 'self-improve',
  config: ScoutConfig | MirrorConfig | QualityConfig | SelfImproveConfig
): string {
  switch (feature) {
    case 'scout': {
      const c = config as ScoutConfig;
      return `# Scout Configuration
on:
  schedule:
    - cron: '${c.schedule}'
  workflow_dispatch:
    inputs:
      target_niche:
        default: '${c.targetNiche}'
      depth:
        default: '${c.depth}'
      min_stars:
        default: '${c.minStars}'
      max_repos:
        default: '${c.maxRepos}'`;
    }
    case 'mirror': {
      const c = config as MirrorConfig;
      return `# Mirror Configuration
on:
  schedule:
    - cron: '${c.schedule}'
  workflow_dispatch:
    inputs:
      generate_report:
        default: '${c.generateReport}'`;
    }
    case 'quality': {
      const c = config as QualityConfig;
      return `# Quality Configuration
on:
  schedule:
    - cron: '${c.schedule}'
  workflow_dispatch:
    inputs:
      auto_fix:
        default: '${c.autoFix}'
      run_linter:
        default: '${c.runLinter}'
      run_typecheck:
        default: '${c.runTypeCheck}'`;
    }
    case 'self-improve': {
      const c = config as SelfImproveConfig;
      return `# Self-Improve Configuration
on:
  schedule:
    - cron: '${c.schedule}'
  workflow_dispatch:
    inputs:
      niche:
        default: '${c.niche}'
      min_stars:
        default: '${c.minStars}'
      max_repos:
        default: '${c.maxRepos}'`;
    }
  }
}

/**
 * Parse cron schedule to human-readable text
 */
export function parseCronSchedule(cron: string): string {
  const patterns: Record<string, string> = {
    '0 6 * * *': 'Daily at 6:00 AM UTC',
    '0 8 * * 0': 'Weekly on Sundays at 8:00 AM UTC',
    '0 10 * * 2,5': 'Twice weekly (Tue, Fri) at 10:00 AM UTC',
    '0 9 * * 1': 'Weekly on Mondays at 9:00 AM UTC',
  };

  return patterns[cron] || cron;
}
