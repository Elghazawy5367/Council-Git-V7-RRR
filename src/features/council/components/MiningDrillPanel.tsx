import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Badge } from '@/components/primitives/badge';
import { Loader2, Zap, ExternalLink, Copy } from 'lucide-react';
import { minePainPoints, analyzePainPoints, generateMarketingCopy, PainPoint } from '@/lib/mining-drill';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { toast } from 'sonner';

export const MiningDrillPanel: React.FC = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const githubApiKey = useSettingsStore(state => state.githubApiKey);

  const handleMine = async (): Promise<void> => {
    if (!owner || !repo) {
      toast.error('Please enter repository owner and name');
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
      const results = await minePainPoints(owner, repo, {
        minBuyingIntent: 3,
        minUrgency: 20,
        maxResults: 20,
        githubToken: githubApiKey,
      });

      setPainPoints(results);
      setShowResults(true);
      
      if (results.length === 0) {
        toast.info('No high-intent pain points found');
      } else {
        toast.success(`Found ${results.length} pain points with buying intent`);
      }
    } catch (error) {
      console.error('Mining error:', error);
      toast.error('Failed to mine pain points. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarketing = (): void => {
    const copy = generateMarketingCopy(painPoints);
    navigator.clipboard.writeText(copy);
    toast.success('Marketing copy copied to clipboard');
  };

  const insight = painPoints.length > 0 ? analyzePainPoints(painPoints) : null;

  const getUrgencyColor = (score: number): string => {
    if (score >= 70) return 'bg-red-500/10 text-red-600 dark:text-red-400';
    if (score >= 40) return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    return 'bg-green-500/10 text-green-600 dark:text-green-400';
  };

  const getBuyingIntentColor = (score: number): string => {
    if (score >= 7) return 'bg-green-500/10 text-green-600 dark:text-green-400';
    if (score >= 5) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⛏️ Mining Drill - Pain Point Extractor
          </CardTitle>
          <CardDescription>
            Extract marketing intelligence from GitHub issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Repository Owner</Label>
              <Input
                id="owner"
                placeholder="facebook"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo">Repository Name</Label>
              <Input
                id="repo"
                placeholder="react"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleMine} 
            disabled={isLoading || !owner || !repo}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mining...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Start Mining
              </>
            )}
          </Button>

          {!githubApiKey && (
            <div className="text-xs text-muted-foreground bg-yellow-500/10 p-2 rounded">
              ⚠️ Add GitHub API key in settings for higher rate limits
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {showResults && insight && (
        <>
          {/* Market Insights Summary */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>
                Intelligence extracted from {painPoints.length} high-intent pain points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{insight.totalPainPoints}</div>
                  <div className="text-xs text-muted-foreground">Total Pain Points</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{insight.highIntentCount}</div>
                  <div className="text-xs text-muted-foreground">High Intent (5+)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{insight.averageUrgency.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">Avg Urgency</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Top Pain Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {insight.topPainKeywords.slice(0, 8).map((kw) => (
                    <Badge key={kw.keyword} variant="outline">
                      {kw.keyword} ({kw.count})
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleCopyMarketing} variant="outline" className="w-full gap-2">
                <Copy className="h-4 w-4" />
                Copy Marketing Intelligence
              </Button>
            </CardContent>
          </Card>

          {/* Pain Points List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">High-Intent Pain Points</h3>
              <Badge>{painPoints.length} found</Badge>
            </div>

            {painPoints.map((point, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base leading-tight flex-1">
                        {point.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getBuyingIntentColor(point.buyingIntent)}>
                          Intent: {point.buyingIntent}/10
                        </Badge>
                        <Badge className={getUrgencyColor(point.urgencyScore)}>
                          Urgency: {point.urgencyScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>💬 {point.comments} comments</span>
                      <span>📅 {new Date(point.created).toLocaleDateString()}</span>
                      <span>👤 {point.author}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {point.body && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {point.body}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {point.painKeywords.slice(0, 6).map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {point.labels.slice(0, 3).map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => window.open(point.url, '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MiningDrillPanel;
