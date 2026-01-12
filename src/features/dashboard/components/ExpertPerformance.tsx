import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/primitives/card';
import { Badge } from '@/components/primitives/badge';
import { Progress } from '@/components/primitives/progress';
import { useDashboardStore } from '../store/dashboard-store';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';

interface ExpertStats {
  mode: string;
  count: number;
  avgCost: number;
  avgDuration: number;
  successRate: number;
}

export const ExpertPerformance: React.FC = () => {
  const { recentDecisions, metrics } = useDashboardStore();

  // Calculate expert performance by mode
  const modeStats: Record<string, ExpertStats> = {
    parallel: { mode: 'Parallel', count: 0, avgCost: 0, avgDuration: 0, successRate: 0 },
    consensus: { mode: 'Consensus', count: 0, avgCost: 0, avgDuration: 0, successRate: 0 },
    adversarial: { mode: 'Adversarial', count: 0, avgCost: 0, avgDuration: 0, successRate: 0 },
    sequential: { mode: 'Sequential', count: 0, avgCost: 0, avgDuration: 0, successRate: 0 },
  };

  recentDecisions.forEach((decision) => {
    const stats = modeStats[decision.mode];
    if (stats) {
      stats.count++;
      stats.avgCost += decision.cost;
      stats.avgDuration += decision.duration;
      if (decision.success) {
        stats.successRate++;
      }
    }
  });

  // Calculate averages
  Object.values(modeStats).forEach((stats) => {
    if (stats.count > 0) {
      stats.avgCost /= stats.count;
      stats.avgDuration /= stats.count;
      stats.successRate = (stats.successRate / stats.count) * 100;
    }
  });

  const sortedModes = Object.values(modeStats)
    .filter((s) => s.count > 0)
    .sort((a, b) => b.successRate - a.successRate);

  const MODE_COLORS: Record<string, string> = {
    Parallel: 'bg-blue-500',
    Consensus: 'bg-purple-500',
    Adversarial: 'bg-red-500',
    Sequential: 'bg-green-500',
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Expert Performance Analysis
        </CardTitle>
        <CardDescription>
          Compare execution modes by success rate, cost, and speed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedModes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No execution data available yet
          </div>
        ) : (
          <div className="space-y-6">
            {sortedModes.map((stats) => (
              <div key={stats.mode} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={MODE_COLORS[stats.mode]}>
                      {stats.mode}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {stats.count} executions
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {stats.successRate >= 90 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="font-semibold">
                      {Math.round(stats.successRate)}%
                    </span>
                  </div>
                </div>
                <Progress value={stats.successRate} className="h-2" />
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Avg Cost:</span> $
                    {stats.avgCost.toFixed(4)}
                  </div>
                  <div>
                    <span className="font-medium">Avg Duration:</span>{' '}
                    {Math.round(stats.avgDuration)}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Insights */}
        {sortedModes.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Insights
            </h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {sortedModes[0] && (
                <li>
                  • <span className="font-medium">{sortedModes[0].mode}</span> mode has the highest success rate at{' '}
                  {Math.round(sortedModes[0].successRate)}%
                </li>
              )}
              {(() => {
                const fastest = sortedModes.reduce((prev, curr) => 
                  curr.avgDuration < prev.avgDuration ? curr : prev
                );
                return (
                  <li>
                    • <span className="font-medium">{fastest.mode}</span> mode is the fastest at{' '}
                    {Math.round(fastest.avgDuration)}s avg
                  </li>
                );
              })()}
              {(() => {
                const cheapest = sortedModes.reduce((prev, curr) => 
                  curr.avgCost < prev.avgCost ? curr : prev
                );
                return (
                  <li>
                    • <span className="font-medium">{cheapest.mode}</span> mode is most cost-effective at ${cheapest.avgCost.toFixed(4)} avg
                  </li>
                );
              })()}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
