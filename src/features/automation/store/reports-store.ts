import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FeatureReport } from '../types/feature.types';

interface ReportsState {
  reports: FeatureReport[];
  
  // Actions
  addReport: (report: FeatureReport) => void;
  updateReport: (reportId: string, updates: Partial<FeatureReport>) => void;
  deleteReport: (reportId: string) => void;
  archiveReport: (reportId: string) => void;
  
  // Queries
  getReport: (reportId: string) => FeatureReport | undefined;
  getReportsByFeature: (featureId: string) => FeatureReport[];
  getRecentReports: (limit?: number) => FeatureReport[];
  searchReports: (query: string) => FeatureReport[];
  
  // Filters
  filterReports: (filters: ReportFilters) => FeatureReport[];
  
  // Cleanup
  cleanupOldReports: (retentionDays: number) => void;
}

interface ReportFilters {
  featureId?: string;
  status?: 'success' | 'partial' | 'failed';
  dateFrom?: Date;
  dateTo?: Date;
  hasRuthlessJudge?: boolean;
  hasCouncil?: boolean;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      reports: [],

      // Add new report
      addReport: (report) => {
        set((state) => ({
          reports: [report, ...state.reports],
        }));
      },

      // Update report
      updateReport: (reportId, updates) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === reportId ? { ...r, ...updates } : r
          ),
        }));
      },

      // Delete report
      deleteReport: (reportId) => {
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== reportId),
        }));
      },

      // Archive report
      archiveReport: (reportId) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === reportId
              ? {
                  ...r,
                  actions: {
                    ...r.actions,
                    archived: true,
                  },
                }
              : r
          ),
        }));
      },

      // Get report by ID
      getReport: (reportId) => {
        return get().reports.find((r) => r.id === reportId);
      },

      // Get reports by feature
      getReportsByFeature: (featureId) => {
        return get().reports.filter((r) => r.featureId === featureId);
      },

      // Get recent reports
      getRecentReports: (limit = 10) => {
        return get().reports.slice(0, limit);
      },

      // Search reports
      searchReports: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().reports.filter(
          (r) =>
            r.featureName.toLowerCase().includes(lowerQuery) ||
            r.data.summary.toLowerCase().includes(lowerQuery) ||
            r.data.keyFindings.some((f) =>
              f.title.toLowerCase().includes(lowerQuery)
            )
        );
      },

      // Filter reports
      filterReports: (filters) => {
        return get().reports.filter((report) => {
          if (filters.featureId && report.featureId !== filters.featureId) {
            return false;
          }
          if (filters.status && report.status !== filters.status) {
            return false;
          }
          if (
            filters.dateFrom &&
            new Date(report.timestamp) < filters.dateFrom
          ) {
            return false;
          }
          if (filters.dateTo && new Date(report.timestamp) > filters.dateTo) {
            return false;
          }
          if (
            filters.hasRuthlessJudge !== undefined &&
            report.processing.ruthlessJudgeProcessed !== filters.hasRuthlessJudge
          ) {
            return false;
          }
          if (
            filters.hasCouncil !== undefined &&
            report.processing.sentToCouncil !== filters.hasCouncil
          ) {
            return false;
          }
          return true;
        });
      },

      // Cleanup old reports
      cleanupOldReports: (retentionDays) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

        set((state) => ({
          reports: state.reports.filter(
            (r) => new Date(r.timestamp) >= cutoffDate
          ),
        }));
      },
    }),
    {
      name: 'reports-store',
      version: 1,
    }
  )
);
