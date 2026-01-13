import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FeatureDefinition,
  FeatureConfiguration,
  ExecutionResult,
  ExecutionHistory,
  ActiveExecution,
} from '../types/feature.types';
import { FEATURE_DEFINITIONS } from '../constants/feature-definitions';

interface FeaturesState {
  // Feature definitions
  features: FeatureDefinition[];
  
  // Execution state
  activeExecutions: ActiveExecution[];
  executionHistory: ExecutionHistory[];
  
  // Actions
  updateFeature: (featureId: string, updates: Partial<FeatureDefinition>) => void;
  updateFeatureConfig: (featureId: string, config: Partial<FeatureConfiguration>) => void;
  toggleFeature: (featureId: string) => void;
  
  // Execution actions
  startExecution: (featureId: string) => string; // Returns executionId
  updateExecutionProgress: (executionId: string, progress: number, phase: string) => void;
  completeExecution: (result: ExecutionResult) => void;
  failExecution: (executionId: string, error: string) => void;
  
  // History
  getFeatureHistory: (featureId: string) => ExecutionHistory[];
  clearHistory: (featureId: string) => void;
  
  // Getters
  getFeature: (featureId: string) => FeatureDefinition | undefined;
  getActiveFeatures: () => FeatureDefinition[];
  getFeaturesByCategory: (category: string) => FeatureDefinition[];
}

export const useFeaturesStore = create<FeaturesState>()(
  persist(
    (set, get) => ({
      // Initial state
      features: FEATURE_DEFINITIONS.map(f => ({ ...f })),
      activeExecutions: [],
      executionHistory: [],

      // Update feature
      updateFeature: (featureId, updates) => {
        set((state) => ({
          features: state.features.map((f) =>
            f.id === featureId ? { ...f, ...updates } : f
          ),
        }));
      },

      // Update feature configuration
      updateFeatureConfig: (featureId, configUpdates) => {
        set((state) => ({
          features: state.features.map((f) => {
            if (f.id === featureId) {
              return {
                ...f,
                defaultConfig: {
                  ...f.defaultConfig,
                  ...configUpdates,
                } as FeatureConfiguration,
              };
            }
            return f;
          }),
        }));
      },

      // Toggle feature enabled/disabled
      toggleFeature: (featureId) => {
        set((state) => ({
          features: state.features.map((f) =>
            f.id === featureId
              ? {
                  ...f,
                  enabled: !f.enabled,
                  status: !f.enabled ? 'active' : 'inactive',
                }
              : f
          ),
        }));
      },

      // Start execution
      startExecution: (featureId) => {
        const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const feature = get().features.find((f) => f.id === featureId);
        
        if (!feature) {
          throw new Error(`Feature ${featureId} not found`);
        }

        const newExecution: ActiveExecution = {
          featureId,
          executionId,
          startTime: new Date(),
          progress: 0,
          currentPhase: 'Initializing',
        };

        set((state) => ({
          activeExecutions: [...state.activeExecutions, newExecution],
          features: state.features.map((f) =>
            f.id === featureId ? { ...f, status: 'running' } : f
          ),
        }));

        return executionId;
      },

      // Update execution progress
      updateExecutionProgress: (executionId, progress, phase) => {
        set((state) => ({
          activeExecutions: state.activeExecutions.map((exec) =>
            exec.executionId === executionId
              ? { ...exec, progress, currentPhase: phase }
              : exec
          ),
        }));
      },

      // Complete execution
      completeExecution: (result) => {
        const { executionId, featureId, status } = result;
        const feature = get().features.find((f) => f.id === featureId);
        
        if (!feature) return;

        const historyEntry: ExecutionHistory = {
          executionId,
          featureId,
          timestamp: result.timestamp,
          status,
          executionTime: result.executionTime,
          reportId: result.report?.id,
          error: result.error,
        };

        set((state) => ({
          activeExecutions: state.activeExecutions.filter(
            (exec) => exec.executionId !== executionId
          ),
          executionHistory: [historyEntry, ...state.executionHistory],
          features: state.features.map((f) => {
            if (f.id !== featureId) return f;

            const totalRuns = f.metrics.totalRuns + 1;
            const successfulRuns =
              f.metrics.successRate * f.metrics.totalRuns +
              (status === 'success' ? 1 : 0);
            const reportsGenerated =
              f.metrics.reportsGenerated + (result.report ? 1 : 0);
            const avgTime =
              (f.metrics.averageExecutionTime * f.metrics.totalRuns +
                result.executionTime) /
              totalRuns;

            return {
              ...f,
              status: f.enabled ? 'active' : 'inactive',
              metrics: {
                ...f.metrics,
                lastRun: result.timestamp,
                successRate: successfulRuns / totalRuns,
                totalRuns,
                reportsGenerated,
                averageExecutionTime: avgTime,
                lastError: result.error,
              },
            };
          }),
        }));
      },

      // Fail execution
      failExecution: (executionId, error) => {
        const execution = get().activeExecutions.find(
          (exec) => exec.executionId === executionId
        );
        
        if (!execution) return;

        const result: ExecutionResult = {
          featureId: execution.featureId,
          executionId,
          status: 'failed',
          error,
          executionTime:
            Date.now() - new Date(execution.startTime).getTime(),
          timestamp: new Date(),
        };

        get().completeExecution(result);
      },

      // Get feature history
      getFeatureHistory: (featureId) => {
        return get().executionHistory.filter((h) => h.featureId === featureId);
      },

      // Clear history
      clearHistory: (featureId) => {
        set((state) => ({
          executionHistory: state.executionHistory.filter(
            (h) => h.featureId !== featureId
          ),
        }));
      },

      // Get feature by ID
      getFeature: (featureId) => {
        return get().features.find((f) => f.id === featureId);
      },

      // Get active features
      getActiveFeatures: () => {
        return get().features.filter((f) => f.enabled);
      },

      // Get features by category
      getFeaturesByCategory: (category) => {
        return get().features.filter((f) => f.category === category);
      },
    }),
    {
      name: 'features-store',
      version: 1,
    }
  )
);
