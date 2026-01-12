import { create } from 'zustand';
import type { ExecutionMode } from '@/features/council/lib/types';
import { db, type DecisionRecord as DBDecisionRecord } from '@/lib/db';

export interface DecisionMetrics {
  totalDecisions: number;
  averageTime: number; // in seconds
  averageCost: number; // in USD
  successRate: number; // percentage
  expertConsensusRate: number; // percentage
  modeDistribution: Record<ExecutionMode, number>;
}

export interface DecisionRecord {
  id?: number;
  timestamp: Date;
  mode: ExecutionMode;
  task: string;
  expertCount: number;
  duration: number; // seconds
  cost: number; // USD
  verdict: string;
  synthesisContent?: string;
  synthesisModel?: string;
  synthesisTier?: string;
  success: boolean;
}

interface DashboardState {
  metrics: DecisionMetrics;
  recentDecisions: DecisionRecord[];
  dateRange: {
    start: Date;
    end: Date;
  };
  isLoading: boolean;
  setDateRange: (start: Date, end: Date) => void;
  addDecisionRecord: (record: DecisionRecord) => Promise<void>;
  loadDecisions: () => Promise<void>;
  updateMetrics: () => void;
  exportData: () => string;
  clearAllData: () => Promise<void>;
}

const calculateMetrics = (decisions: DecisionRecord[]): DecisionMetrics => {
  if (decisions.length === 0) {
    return {
      totalDecisions: 0,
      averageTime: 0,
      averageCost: 0,
      successRate: 0,
      expertConsensusRate: 0,
      modeDistribution: {
        parallel: 0,
        consensus: 0,
        adversarial: 0,
        sequential: 0,
      },
    };
  }

  const totalTime = decisions.reduce((sum, d) => sum + d.duration, 0);
  const totalCost = decisions.reduce((sum, d) => sum + d.cost, 0);
  const successCount = decisions.filter((d) => d.success).length;

  const modeDistribution = decisions.reduce((acc, d) => {
    acc[d.mode] = (acc[d.mode] || 0) + 1;
    return acc;
  }, {} as Record<ExecutionMode, number>);

  return {
    totalDecisions: decisions.length,
    averageTime: totalTime / decisions.length,
    averageCost: totalCost / decisions.length,
    successRate: (successCount / decisions.length) * 100,
    expertConsensusRate: 85, // TODO: Calculate from actual data
    modeDistribution,
  };
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  metrics: {
    totalDecisions: 0,
    averageTime: 0,
    averageCost: 0,
    successRate: 0,
    expertConsensusRate: 0,
    modeDistribution: {
      parallel: 0,
      consensus: 0,
      adversarial: 0,
      sequential: 0,
    },
  },
  recentDecisions: [],
  isLoading: false,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  },

  setDateRange: (start: Date, end: Date) => {
    set({ dateRange: { start, end } });
    get().updateMetrics();
  },

  addDecisionRecord: async (record: DecisionRecord) => {
    try {
      // Save to IndexedDB
      const dbRecord: DBDecisionRecord = {
        timestamp: record.timestamp.getTime(),
        mode: record.mode,
        task: record.task,
        expertCount: record.expertCount,
        duration: record.duration,
        cost: record.cost,
        verdict: record.verdict,
        synthesisContent: record.synthesisContent,
        synthesisModel: record.synthesisModel,
        synthesisTier: record.synthesisTier,
        success: record.success,
      };
      
      await db.decisionRecords.add(dbRecord);
      
      // Reload decisions from DB
      await get().loadDecisions();
    } catch (error) {
      console.error('Failed to save decision record:', error);
    }
  },

  loadDecisions: async () => {
    set({ isLoading: true });
    try {
      const records = await db.decisionRecords
        .orderBy('timestamp')
        .reverse()
        .limit(100)
        .toArray();
      
      const decisions: DecisionRecord[] = records.map(r => ({
        id: r.id,
        timestamp: new Date(r.timestamp),
        mode: r.mode as ExecutionMode,
        task: r.task,
        expertCount: r.expertCount,
        duration: r.duration,
        cost: r.cost,
        verdict: r.verdict,
        synthesisContent: r.synthesisContent,
        synthesisModel: r.synthesisModel,
        synthesisTier: r.synthesisTier,
        success: r.success,
      }));
      
      set({ recentDecisions: decisions });
      get().updateMetrics();
    } catch (error) {
      console.error('Failed to load decisions:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateMetrics: () => {
    const { recentDecisions, dateRange } = get();
    const filteredDecisions = recentDecisions.filter(
      (d) => d.timestamp >= dateRange.start && d.timestamp <= dateRange.end
    );
    const metrics = calculateMetrics(filteredDecisions);
    set({ metrics });
  },

  exportData: () => {
    const { recentDecisions } = get();
    return JSON.stringify(recentDecisions, null, 2);
  },

  clearAllData: async () => {
    try {
      await db.decisionRecords.clear();
      set({ 
        recentDecisions: [],
        metrics: {
          totalDecisions: 0,
          averageTime: 0,
          averageCost: 0,
          successRate: 0,
          expertConsensusRate: 0,
          modeDistribution: {
            parallel: 0,
            consensus: 0,
            adversarial: 0,
            sequential: 0,
          },
        },
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  },
}));
