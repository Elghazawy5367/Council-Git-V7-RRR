import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import type { FeatureDefinition } from '../types/feature.types';
import { useFeaturesStore } from '../store/features-store';
import { executionEngine } from '../lib/execution-engine';
import { useState } from 'react';
import { FeatureConfigModal } from './FeatureConfigModal';

interface FeatureCardProps {
  feature: FeatureDefinition;
}

const STATUS_COLORS = {
  active: 'bg-green-500',
  inactive: 'bg-gray-500',
  running: 'bg-blue-500 animate-pulse',
  error: 'bg-red-500',
  paused: 'bg-yellow-500',
};

const STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  running: 'Running',
  error: 'Error',
  paused: 'Paused',
};

export function FeatureCard({ feature }: FeatureCardProps): JSX.Element {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const toggleFeature = useFeaturesStore((state) => state.toggleFeature);
  const updateFeature = useFeaturesStore((state) => state.updateFeature);

  const handleToggle = (): void => {
    toggleFeature(feature.id);
  };

  const handleRunNow = async (): Promise<void> => {
    if (isExecuting) return;

    setIsExecuting(true);
    updateFeature(feature.id, { status: 'running' });

    try {
      await executionEngine.executeFeature(feature.id);
    } catch (error) {
      console.error(`Failed to execute feature ${feature.id}:`, error);
      updateFeature(feature.id, { status: 'error' });
    } finally {
      setIsExecuting(false);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{feature.icon}</span>
            <div>
              <CardTitle className="text-lg">{feature.name}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {feature.description}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${STATUS_COLORS[feature.status]} text-white border-none`}
          >
            {STATUS_LABELS[feature.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Last Run</p>
              <p className="font-medium">{formatDate(feature.metrics.lastRun)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Success Rate</p>
              <p className="font-medium">
                {feature.metrics.totalRuns > 0
                  ? `${Math.round(feature.metrics.successRate * 100)}%`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Runs</p>
              <p className="font-medium">{feature.metrics.totalRuns}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Reports</p>
              <p className="font-medium">{feature.metrics.reportsGenerated}</p>
            </div>
          </div>

          {/* Last Error */}
          {feature.metrics.lastError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <p className="font-medium">Last Error:</p>
              <p className="truncate">{feature.metrics.lastError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant={feature.enabled ? 'outline' : 'default'}
              size="sm"
              onClick={handleToggle}
              className="flex-1"
            >
              {feature.enabled ? '⏸️ Disable' : '▶️ Enable'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRunNow}
              disabled={!feature.enabled || isExecuting}
              className="flex-1"
            >
              {isExecuting ? '⏳ Running...' : '🔄 Run Now'}
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => setShowConfig(true)}
            >
              ⚙️ Configure
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-xs">
              📊 Reports
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Config Modal */}
      <FeatureConfigModal
        feature={feature}
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
      />
    </Card>
  );
}
