import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Switch } from '@/components/primitives/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { toast } from 'sonner';

interface FeatureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureConfigModal: React.FC<FeatureConfigModalProps> = ({ isOpen, onClose }) => {
  const {
    scout,
    mirror,
    quality,
    selfImprove,
    stargazerAnalysis,
    dataFetching,
    typeSafeForms,
    errorHandling,
    authSecurity,
    mobileDrawers,
    virtualizedLists,
    streamingAI,
    agentOrchestration,
    localDatabase,
    updateScoutConfig,
    updateMirrorConfig,
    updateQualityConfig,
    updateSelfImproveConfig,
    updateStargazerAnalysisConfig,
    updateDataFetchingConfig,
    updateTypeSafeFormsConfig,
    updateErrorHandlingConfig,
    updateAuthSecurityConfig,
    updateMobileDrawersConfig,
    updateVirtualizedListsConfig,
    updateStreamingAIConfig,
    updateAgentOrchestrationConfig,
    updateLocalDatabaseConfig,
    resetToDefaults,
  } = useFeatureConfigStore();

  const handleSave = (): void => {
    toast.success('Configuration saved successfully');
    onClose();
  };

  const handleReset = (): void => {
    resetToDefaults();
    toast.info('Reset to default configuration');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto glass-panel">
        <DialogHeader>
          <DialogTitle>Feature Configuration</DialogTitle>
          <DialogDescription>
            Configure automated features and their schedules
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="scout" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1">
            <TabsTrigger value="scout">Scout</TabsTrigger>
            <TabsTrigger value="mirror">Mirror</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="self-improve">Self-Improve</TabsTrigger>
            <TabsTrigger value="stargazer">Stargazer</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="more">More...</TabsTrigger>
          </TabsList>

          {/* Scout Configuration */}
          <TabsContent value="scout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>👻 Phantom Scout Configuration</CardTitle>
                <CardDescription>GitHub intelligence gathering settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scout-enabled">Enable Scout</Label>
                  <Switch
                    id="scout-enabled"
                    checked={scout.enabled}
                    onCheckedChange={(checked) => updateScoutConfig({ enabled: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scout-niche">Target Niche</Label>
                  <Input
                    id="scout-niche"
                    value={scout.targetNiche}
                    onChange={(e) => updateScoutConfig({ targetNiche: e.target.value })}
                    placeholder="e.g., developer-tools, react-native"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-min-stars">Minimum Stars</Label>
                  <Input
                    id="scout-min-stars"
                    type="number"
                    value={scout.minStars}
                    onChange={(e) => updateScoutConfig({ minStars: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-max-repos">Maximum Repositories</Label>
                  <Input
                    id="scout-max-repos"
                    type="number"
                    value={scout.maxRepos}
                    onChange={(e) => updateScoutConfig({ maxRepos: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-depth">Scan Depth</Label>
                  <Select value={scout.depth} onValueChange={(value: 'shallow' | 'normal' | 'deep') => updateScoutConfig({ depth: value })}>
                    <SelectTrigger id="scout-depth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shallow">Shallow (Fast)</SelectItem>
                      <SelectItem value="normal">Normal (Balanced)</SelectItem>
                      <SelectItem value="deep">Deep (Thorough)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scout-schedule">Cron Schedule</Label>
                  <Input
                    id="scout-schedule"
                    value={scout.schedule}
                    onChange={(e) => updateScoutConfig({ schedule: e.target.value })}
                    placeholder="0 6 * * *"
                  />
                  <p className="text-xs text-muted-foreground">Daily at 6 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mirror Configuration */}
          <TabsContent value="mirror" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔄 Code Mirror Configuration</CardTitle>
                <CardDescription>Code quality analysis settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mirror-enabled">Enable Mirror</Label>
                  <Switch
                    id="mirror-enabled"
                    checked={mirror.enabled}
                    onCheckedChange={(checked) => updateMirrorConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="mirror-report">Generate Detailed Report</Label>
                  <Switch
                    id="mirror-report"
                    checked={mirror.generateReport}
                    onCheckedChange={(checked) => updateMirrorConfig({ generateReport: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mirror-schedule">Cron Schedule</Label>
                  <Input
                    id="mirror-schedule"
                    value={mirror.schedule}
                    onChange={(e) => updateMirrorConfig({ schedule: e.target.value })}
                    placeholder="0 8 * * 0"
                  />
                  <p className="text-xs text-muted-foreground">Weekly on Sundays at 8 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Configuration */}
          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>⚡ QUALITY Pipeline Configuration</CardTitle>
                <CardDescription>Automated quality improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-enabled">Enable Quality Pipeline</Label>
                  <Switch
                    id="quality-enabled"
                    checked={quality.enabled}
                    onCheckedChange={(checked) => updateQualityConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-autofix">Auto-Fix Issues</Label>
                  <Switch
                    id="quality-autofix"
                    checked={quality.autoFix}
                    onCheckedChange={(checked) => updateQualityConfig({ autoFix: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-linter">Run Linter</Label>
                  <Switch
                    id="quality-linter"
                    checked={quality.runLinter}
                    onCheckedChange={(checked) => updateQualityConfig({ runLinter: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-typecheck">Run TypeScript Check</Label>
                  <Switch
                    id="quality-typecheck"
                    checked={quality.runTypeCheck}
                    onCheckedChange={(checked) => updateQualityConfig({ runTypeCheck: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality-schedule">Cron Schedule</Label>
                  <Input
                    id="quality-schedule"
                    value={quality.schedule}
                    onChange={(e) => updateQualityConfig({ schedule: e.target.value })}
                    placeholder="0 10 * * 2,5"
                  />
                  <p className="text-xs text-muted-foreground">Twice weekly - Tuesday and Friday at 10 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Self-Improve Configuration */}
          <TabsContent value="self-improve" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🧠 Self-Improve Configuration</CardTitle>
                <CardDescription>Learn from successful repositories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="improve-enabled">Enable Self-Improve</Label>
                  <Switch
                    id="improve-enabled"
                    checked={selfImprove.enabled}
                    onCheckedChange={(checked) => updateSelfImproveConfig({ enabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-niche">Target Niche</Label>
                  <Input
                    id="improve-niche"
                    value={selfImprove.niche}
                    onChange={(e) => updateSelfImproveConfig({ niche: e.target.value })}
                    placeholder="e.g., AI tools, React libraries"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-min-stars">Minimum Stars</Label>
                  <Input
                    id="improve-min-stars"
                    type="number"
                    value={selfImprove.minStars}
                    onChange={(e) => updateSelfImproveConfig({ minStars: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-max-repos">Maximum Repositories</Label>
                  <Input
                    id="improve-max-repos"
                    type="number"
                    value={selfImprove.maxRepos}
                    onChange={(e) => updateSelfImproveConfig({ maxRepos: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improve-schedule">Cron Schedule</Label>
                  <Input
                    id="improve-schedule"
                    value={selfImprove.schedule}
                    onChange={(e) => updateSelfImproveConfig({ schedule: e.target.value })}
                    placeholder="0 9 * * 1"
                  />
                  <p className="text-xs text-muted-foreground">Weekly on Mondays at 9 AM UTC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stargazer Analysis Configuration */}
          <TabsContent value="stargazer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>⭐ Stargazer Quality Analysis</CardTitle>
                <CardDescription>Analyze WHO starred repos for institutional backing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stargazer-enabled">Enable Analysis</Label>
                  <Switch
                    id="stargazer-enabled"
                    checked={stargazerAnalysis.enabled}
                    onCheckedChange={(checked) => updateStargazerAnalysisConfig({ enabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stargazer-min-followers">Minimum Followers (Influencer)</Label>
                  <Input
                    id="stargazer-min-followers"
                    type="number"
                    value={stargazerAnalysis.minFollowers}
                    onChange={(e) => updateStargazerAnalysisConfig({ minFollowers: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="stargazer-check-companies">Check Company Affiliations</Label>
                  <Switch
                    id="stargazer-check-companies"
                    checked={stargazerAnalysis.checkCompanies}
                    onCheckedChange={(checked) => updateStargazerAnalysisConfig({ checkCompanies: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stargazer-max">Max Stargazers to Analyze</Label>
                  <Input
                    id="stargazer-max"
                    type="number"
                    value={stargazerAnalysis.maxStargazers}
                    onChange={(e) => updateStargazerAnalysisConfig({ maxStargazers: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Higher values = better accuracy but slower</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="font-medium mb-1">Target Companies:</p>
                  <p className="text-xs text-muted-foreground">
                    {stargazerAnalysis.targetCompanies.join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Fetching Configuration */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📊 Data Fetching & Caching</CardTitle>
                <CardDescription>React Query configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-enabled">Enable Advanced Fetching</Label>
                  <Switch
                    id="data-enabled"
                    checked={dataFetching.enabled}
                    onCheckedChange={(checked) => updateDataFetchingConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="data-caching">Enable Caching</Label>
                  <Switch
                    id="data-caching"
                    checked={dataFetching.useCaching}
                    onCheckedChange={(checked) => updateDataFetchingConfig({ useCaching: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-expiry">Cache Expiry (hours)</Label>
                  <Input
                    id="data-expiry"
                    type="number"
                    value={dataFetching.cacheExpiry}
                    onChange={(e) => updateDataFetchingConfig({ cacheExpiry: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Type-Safe Forms Configuration */}
          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📝 Type-Safe Forms</CardTitle>
                <CardDescription>Zod validation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-enabled">Enable Type-Safe Forms</Label>
                  <Switch
                    id="forms-enabled"
                    checked={typeSafeForms.enabled}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-zod">Use Zod Validation</Label>
                  <Switch
                    id="forms-zod"
                    checked={typeSafeForms.useZod}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ useZod: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="forms-validate-change">Validate on Change</Label>
                  <Switch
                    id="forms-validate-change"
                    checked={typeSafeForms.validateOnChange}
                    onCheckedChange={(checked) => updateTypeSafeFormsConfig({ validateOnChange: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Handling Configuration */}
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🛡️ Error Handling</CardTitle>
                <CardDescription>Retry and circuit breaker settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-enabled">Enable Advanced Error Handling</Label>
                  <Switch
                    id="errors-enabled"
                    checked={errorHandling.enabled}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-retry">Enable Automatic Retry</Label>
                  <Switch
                    id="errors-retry"
                    checked={errorHandling.useRetry}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ useRetry: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="errors-max-retries">Max Retry Attempts</Label>
                  <Input
                    id="errors-max-retries"
                    type="number"
                    value={errorHandling.maxRetries}
                    onChange={(e) => updateErrorHandlingConfig({ maxRetries: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="errors-circuit-breaker">Circuit Breaker</Label>
                  <Switch
                    id="errors-circuit-breaker"
                    checked={errorHandling.circuitBreaker}
                    onCheckedChange={(checked) => updateErrorHandlingConfig({ circuitBreaker: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auth & Security Configuration */}
          <TabsContent value="auth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔐 Authentication & Security</CardTitle>
                <CardDescription>Vault and session settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-enabled">Enable Security Features</Label>
                  <Switch
                    id="auth-enabled"
                    checked={authSecurity.enabled}
                    onCheckedChange={(checked) => updateAuthSecurityConfig({ enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-vault">Use Encrypted Vault</Label>
                  <Switch
                    id="auth-vault"
                    checked={authSecurity.useVault}
                    onCheckedChange={(checked) => updateAuthSecurityConfig({ useVault: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auth-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="auth-timeout"
                    type="number"
                    value={authSecurity.sessionTimeout}
                    onChange={(e) => updateAuthSecurityConfig({ sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* More Features (Remaining 5) */}
          <TabsContent value="more" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📱 Mobile & UI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mobile Drawers */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Touch Gestures & Drawers</Label>
                      <p className="text-xs text-muted-foreground">Mobile-first UI patterns</p>
                    </div>
                    <Switch
                      checked={mobileDrawers.enabled}
                      onCheckedChange={(checked) => updateMobileDrawersConfig({ enabled: checked })}
                    />
                  </div>
                  {mobileDrawers.enabled && (
                    <div className="pl-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Enable Swipe Gestures</span>
                        <Switch
                          checked={mobileDrawers.gesturesEnabled}
                          onCheckedChange={(checked) => updateMobileDrawersConfig({ gesturesEnabled: checked })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Virtualized Lists */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Virtualized Lists</Label>
                      <p className="text-xs text-muted-foreground">Handle 1000+ items smoothly</p>
                    </div>
                    <Switch
                      checked={virtualizedLists.enabled}
                      onCheckedChange={(checked) => updateVirtualizedListsConfig({ enabled: checked })}
                    />
                  </div>
                </div>

                {/* Streaming AI */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Streaming AI Responses</Label>
                      <p className="text-xs text-muted-foreground">Typewriter effect for agents</p>
                    </div>
                    <Switch
                      checked={streamingAI.enabled}
                      onCheckedChange={(checked) => updateStreamingAIConfig({ enabled: checked })}
                    />
                  </div>
                </div>

                {/* Agent Orchestration */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Agent Orchestration</Label>
                      <p className="text-xs text-muted-foreground">Multi-expert coordination</p>
                    </div>
                    <Switch
                      checked={agentOrchestration.enabled}
                      onCheckedChange={(checked) => updateAgentOrchestrationConfig({ enabled: checked })}
                    />
                  </div>
                  {agentOrchestration.enabled && (
                    <div className="pl-4 space-y-2">
                      <Label className="text-sm">Execution Mode</Label>
                      <Select
                        value={agentOrchestration.executionMode}
                        onValueChange={(value: any) => updateAgentOrchestrationConfig({ executionMode: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="separated">Separated</SelectItem>
                          <SelectItem value="synthesis">Synthesis</SelectItem>
                          <SelectItem value="debate">Debate</SelectItem>
                          <SelectItem value="pipeline">Pipeline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Local Database */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Local-First Database</Label>
                      <p className="text-xs text-muted-foreground">Offline-capable with Dexie</p>
                    </div>
                    <Switch
                      checked={localDatabase.enabled}
                      onCheckedChange={(checked) => updateLocalDatabaseConfig({ enabled: checked })}
                    />
                  </div>
                  {localDatabase.enabled && (
                    <div className="pl-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Auto-Sync</span>
                        <Switch
                          checked={localDatabase.autoSync}
                          onCheckedChange={(checked) => updateLocalDatabaseConfig({ autoSync: checked })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureConfigModal;
