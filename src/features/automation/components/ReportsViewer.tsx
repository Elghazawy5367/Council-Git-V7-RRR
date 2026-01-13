import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { Input } from '@/components/primitives/input';
import { useReportsStore } from '../store/reports-store';
import { useFeaturesStore } from '../store/features-store';
import type { FeatureReport } from '../types/feature.types';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';

export function ReportsViewer(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<FeatureReport | null>(null);
  
  const reports = useReportsStore((state) => state.reports);
  const searchReports = useReportsStore((state) => state.searchReports);
  const features = useFeaturesStore((state) => state.features);

  const displayedReports = searchQuery
    ? searchReports(searchQuery)
    : reports;

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  const getFeatureIcon = (featureId: string): string => {
    const feature = features.find(f => f.id === featureId);
    return feature?.icon || '📊';
  };

  const handleExport = (report: FeatureReport): void => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedReport) {
    return <ReportDetail report={selectedReport} onBack={() => setSelectedReport(null)} />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intelligence Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generated reports from automation features
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search reports by content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {displayedReports.length > 0 ? (
          displayedReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader onClick={() => setSelectedReport(report)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getFeatureIcon(report.featureId)}</span>
                    <div>
                      <CardTitle>{report.featureName}</CardTitle>
                      <CardDescription>
                        {formatDate(report.timestamp)} • {report.executionTime}ms
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        report.status === 'success'
                          ? 'default'
                          : report.status === 'partial'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {report.status}
                    </Badge>
                    {report.processing.ruthlessJudgeProcessed && (
                      <Badge variant="outline">⚖️ Validated</Badge>
                    )}
                    {report.processing.sentToCouncil && (
                      <Badge variant="outline">👥 Council</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent onClick={() => setSelectedReport(report)}>
                <p className="text-sm text-muted-foreground mb-4">
                  {report.data.summary}
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span>📊 {report.data.keyFindings.length} findings</span>
                  {report.data.painPoints && (
                    <span>• 💬 {report.data.painPoints.length} pain points</span>
                  )}
                  {report.data.opportunities && (
                    <span>• 🎯 {report.data.opportunities.length} opportunities</span>
                  )}
                  <span>• ⭐ {report.data.metadata.qualityScore.toFixed(2)} quality</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? 'No reports found matching your search' : 'No reports yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ReportDetail({ report, onBack }: { report: FeatureReport; onBack: () => void }): JSX.Element {
  const handleExport = (): void => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>

      {/* Report Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">{report.featureName}</CardTitle>
            <Badge
              variant={
                report.status === 'success'
                  ? 'default'
                  : report.status === 'partial'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {report.status}
            </Badge>
          </div>
          <CardDescription>
            Generated {new Date(report.timestamp).toLocaleString()} in {report.executionTime}ms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Sources Scanned</p>
              <p className="font-medium">{report.data.metadata.sourcesScanned}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data Points</p>
              <p className="font-medium">{report.data.metadata.dataPointsCollected}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Quality Score</p>
              <p className="font-medium">{report.data.metadata.qualityScore.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Processing</p>
              <div className="flex gap-1">
                {report.processing.ruthlessJudgeProcessed && <span>⚖️</span>}
                {report.processing.sentToCouncil && <span>👥</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="judge">Judge</TabsTrigger>
          <TabsTrigger value="council">Council</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{report.data.summary}</p>
            </CardContent>
          </Card>

          {report.data.recommendations && report.data.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.data.recommendations.map((rec, index) => (
                    <div key={rec.id} className="border-l-4 border-primary pl-4">
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">Priority: {rec.priority}</Badge>
                        <Badge variant="outline">Effort: {rec.effort}</Badge>
                        <Badge variant="outline">Impact: {rec.impact}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Findings Tab */}
        <TabsContent value="findings" className="space-y-4">
          {report.data.keyFindings.map((finding) => (
            <Card key={finding.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{finding.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge>{finding.type}</Badge>
                    <Badge variant="outline">{Math.round(finding.confidence * 100)}%</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{finding.description}</p>
                <div>
                  <p className="text-sm font-medium mb-2">Evidence:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {finding.evidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          {report.data.opportunities && report.data.opportunities.length > 0 ? (
            report.data.opportunities.map((opp) => (
              <Card key={opp.id}>
                <CardHeader>
                  <CardTitle>{opp.title}</CardTitle>
                  <CardDescription>{opp.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Market Size</p>
                      <p className="font-medium">{opp.marketSize}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Competition</p>
                      <Badge variant="outline">{opp.competition}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Effort</p>
                      <Badge variant="outline">{opp.effort}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Confidence</p>
                      <p className="font-medium">{Math.round(opp.confidence * 100)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No opportunities identified
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Judge Tab */}
        <TabsContent value="judge" className="space-y-4">
          {report.processing.ruthlessJudgeVerdict ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>⚖️ Ruthless Judge Verdict</CardTitle>
                    <Badge variant="outline">
                      {Math.round(report.processing.ruthlessJudgeVerdict.confidence * 100)}% Confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {report.processing.ruthlessJudgeVerdict.verdict}
                  </div>
                </CardContent>
              </Card>

              {report.processing.ruthlessJudgeVerdict.keyInsights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.processing.ruthlessJudgeVerdict.keyInsights.map((insight, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {report.processing.ruthlessJudgeVerdict.warnings.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-900">⚠️ Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-yellow-900">
                      {report.processing.ruthlessJudgeVerdict.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Not yet validated by Ruthless Judge
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Council Tab */}
        <TabsContent value="council" className="space-y-4">
          {report.processing.councilSynthesis ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>👥 Council Synthesis</CardTitle>
                  <CardDescription>
                    {Object.keys(report.processing.councilSynthesis.expertOutputs).length} experts consulted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {report.processing.councilSynthesis.synthesis}
                  </div>
                </CardContent>
              </Card>

              {report.processing.councilSynthesis.consensus.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-900">✓ Areas of Agreement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-green-900">
                      {report.processing.councilSynthesis.consensus.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {report.processing.councilSynthesis.conflicts.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-900">⚔️ Areas of Disagreement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-orange-900">
                      {report.processing.councilSynthesis.conflicts.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Not yet analyzed by Council
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
