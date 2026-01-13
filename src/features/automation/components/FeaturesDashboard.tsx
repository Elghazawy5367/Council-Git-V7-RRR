import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/primitives/tabs';
import { Input } from '@/components/primitives/input';
import { useFeaturesStore } from '../store/features-store';
import { executionEngine } from '../lib/execution-engine';
import { FeatureCard } from './FeatureCard';

export function FeaturesDashboard(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExecutingAll, setIsExecutingAll] = useState(false);
  
  const features = useFeaturesStore((state) => state.features);
  const activeExecutions = useFeaturesStore((state) => state.activeExecutions);

  // Filter features
  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      searchQuery === '' ||
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || feature.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Category counts
  const categoryCounts = {
    all: features.length,
    github: features.filter((f) => f.category === 'github').length,
    reddit: features.filter((f) => f.category === 'reddit').length,
    hybrid: features.filter((f) => f.category === 'hybrid').length,
    other: features.filter((f) => f.category === 'other').length,
  };

  const handleStartAll = async (): Promise<void> => {
    setIsExecutingAll(true);
    try {
      await executionEngine.startAll();
    } catch (error) {
      console.error('Failed to start all features:', error);
    } finally {
      setIsExecutingAll(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Features Automation</h1>
          <p className="text-muted-foreground mt-2">
            Intelligence-gathering features that feed the Council
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStartAll}
            disabled={isExecutingAll || activeExecutions.length > 0}
            size="lg"
          >
            {isExecutingAll ? '⏳ Starting All...' : '▶️ Start All'}
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{features.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {features.filter((f) => f.enabled).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Running Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {activeExecutions.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reports Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {features.reduce((sum, f) => sum + f.metrics.reportsGenerated, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Executions */}
      {activeExecutions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Active Executions</CardTitle>
            <CardDescription>Features currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeExecutions.map((exec) => {
                const feature = features.find((f) => f.id === exec.featureId);
                return (
                  <div
                    key={exec.executionId}
                    className="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{feature?.icon}</span>
                      <div>
                        <p className="font-medium">{feature?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exec.currentPhase}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{exec.progress}%</p>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${exec.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                <TabsTrigger value="all">
                  All ({categoryCounts.all})
                </TabsTrigger>
                <TabsTrigger value="github">
                  GitHub ({categoryCounts.github})
                </TabsTrigger>
                <TabsTrigger value="reddit">
                  Reddit ({categoryCounts.reddit})
                </TabsTrigger>
                <TabsTrigger value="hybrid">
                  Hybrid ({categoryCounts.hybrid})
                </TabsTrigger>
                <TabsTrigger value="other">
                  Other ({categoryCounts.other})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      {filteredFeatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No features found</p>
            {searchQuery && (
              <Button
                variant="link"
                onClick={() => setSearchQuery('')}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
