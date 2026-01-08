# Goldmine Detector - Feature Documentation

## Overview

The **Abandoned Goldmine Detector** is Feature 7 in the Council App's intelligence suite. It filters high-ROI opportunities from Blue Ocean scans, identifying abandoned open source projects with proven demand that can be revived as SaaS products.

## Purpose

Transform Scout/Sonar's opportunity data into actionable business ventures by identifying:
- **Abandoned projects** (1+ years no updates)
- **Proven demand** (1,000+ stars)
- **Active user pain** (20+ open issues)
- **Low competition** (fork ratio < 0.2)

## Architecture

### Core Files

- **[src/lib/goldmine-detector.ts](../src/lib/goldmine-detector.ts)** - Filtering and business logic
- **[src/lib/opportunity-loader.ts](../src/lib/opportunity-loader.ts)** - Data loading and GitHub API enrichment
- **[src/features/council/components/GoldmineDetector.tsx](../src/features/council/components/GoldmineDetector.tsx)** - UI component

### Data Flow

```
Scout/Sonar Results → opportunity-loader.ts → GitHub API Enrichment → goldmine-detector.ts → GoldmineDetector.tsx
      (JSON)              (Transform)           (Real-time stats)         (Filter)            (Display)
```

## Key Functions

### 1. `findGoldmines(opportunities: Opportunity[]): Opportunity[]`
Filters opportunities by goldmine criteria:
- `stars > 1000` - Proven demand
- `daysSinceUpdate > 365` - Abandoned for 1+ years
- `openIssues > 20` - Active user need
- `forkRatio < 0.2` - Low competition

### 2. `calculateGoldmineMetrics(repo: Opportunity): GoldmineMetrics`
Estimates business potential:
- **Potential Customers**: `stars × 0.01` (1% conversion rate)
- **Pricing**: Tiered by star count ($99-$499/year)
  - >10k stars: $499
  - >5k stars: $299
  - >2k stars: $199
  - >1k stars: $149
  - Default: $99
- **Revenue Range**: `customers × price × (0.5 to 1.0)` multiplier
- **Competition Level**: Based on fork ratio
- **Time to Market**: Based on stars and open issues

### 3. `generateGoldmineReport(goldmines: Opportunity[]): string`
Creates comprehensive markdown reports:
- Executive summary with total opportunities and revenue estimates
- Ranked goldmines by Blue Ocean score
- Business metrics per repository
- Quick Win strategies
- Market validation evidence

### 4. `categorizeGoldmines(goldmines: Opportunity[]): { easyWins, mediumEffort, highEffort }`
Sorts by difficulty:
- **Easy Wins**: <2k stars + <3mo launch
- **Medium Effort**: <5k stars + <6mo launch
- **High Effort**: >5k stars or >6mo launch

### 5. `generateActionPlan(repo: Opportunity): string[]`
Provides step-by-step implementation roadmap:
1. Fork repository & audit codebase
2. Update dependencies & security fixes
3. Fix top 10 issues from original repo
4. Modernize UI/UX with current design trends
5. Add premium features (analytics, team collaboration)
6. Set up SaaS infrastructure
7. Launch marketing campaign
8. Engage original user base

## UI Components

### GoldmineDetector Component

Displays goldmines in tabbed categories with:
- **Summary Card**: Total goldmines, estimated revenue, easy wins count
- **Categorized Tabs**: Easy Wins / Medium Effort / High Effort
- **Goldmine Cards**: Per repository with:
  - Stars, abandonment duration, potential customers, pricing
  - Revenue estimate range
  - Competition level, time-to-market, language badges
  - Quick Win Strategy (4-step roadmap)
  - Copy Action Plan button
  - View Repo link

### Integration

Integrated into [src/pages/FeaturesDashboard.tsx](../src/pages/FeaturesDashboard.tsx) below Mining Drill panel:
- Automatically loads opportunities from Scout/Sonar output
- Enriches data with real-time GitHub API stats (when GitHub token available)
- Displays loading state while fetching data

## Usage Workflow

### 1. Run Scout/Sonar
```bash
npm run scout
# or via GitHub Actions
```

### 2. View Results
Navigate to **Features Dashboard** → Scroll to Goldmine Detector panel

### 3. Explore Goldmines
- Browse by difficulty category (Easy/Medium/High)
- Review business metrics and revenue estimates
- Copy action plans for implementation
- Open repositories to audit code

### 4. Export Report
Click "Copy Full Goldmine Report" to get markdown report with:
- All goldmines ranked by score
- Detailed business analysis
- Implementation strategies

## Data Sources

### Primary: Scout Output
**File**: `data/opportunities/latest.json`

Scout-generated opportunities with:
- Pain points from GitHub issues
- Market size estimates
- Competition levels
- Evidence (repository links)

**Transform**: Extracts repository names from `evidence[0]` field

### Secondary: Blue Ocean Markdown
**File**: `data/intelligence/blue-ocean-2026-01-07.md`

Markdown reports from Blue Ocean scans with repository mentions.

**Parse**: Regex extraction of `**owner/name** (stars⭐)` patterns

### Enrichment: GitHub API
Real-time data fetched per repository:
- Accurate star/fork counts
- Open issues count
- Last update timestamp
- Description and language
- Calculated abandonment duration

**Rate Limit**: 10 requests/second (100ms delay between calls)

## Business Metrics

### Revenue Estimation Formula

```typescript
const potentialCustomers = stars * 0.01; // 1% conversion rate
const baseRevenue = customers * price / 12; // Monthly revenue

// Revenue range with 50%-100% confidence
const low = baseRevenue * 0.5;
const high = baseRevenue * 1.0;
```

### Pricing Tiers

Based on proven demand (star count):
- **10k+ stars**: $499/year - Enterprise-grade tools
- **5k-10k stars**: $299/year - Professional tools
- **2k-5k stars**: $199/year - Growing tools
- **1k-2k stars**: $149/year - Niche tools
- **<1k stars**: $99/year - Specialized tools

### Market Validation

Goldmines have built-in validation:
- **Stars**: Proven user interest
- **Open Issues**: Active feature requests and bug reports
- **Low Forks**: Market gap (users didn't fork to fix themselves)
- **Abandonment**: Original maintainer gave up, creating opportunity

## Quick Win Strategy

All goldmines display a 4-step quick win path:

1. **Fork & Update** - Modernize dependencies
2. **Fix Top Issues** - Address 5-10 most requested features/bugs
3. **Add Modern UI/UX** - Update design to current standards
4. **Launch as SaaS** - Deploy with subscription pricing

## Example Output

### Sample Goldmine Card

**apollographql/apollo-client** (15,234 stars, 2 years abandoned)

- **Potential Customers**: 152
- **Pricing**: $299/year
- **Monthly Revenue**: $3,795 - $7,590
- **Competition**: Low (fork ratio: 0.15)
- **Time to Market**: Fast

**Quick Win Strategy:**
1. Fork & update dependencies
2. Fix top 5-10 issues
3. Add modern UI/UX
4. Launch as SaaS

[Copy Action Plan] [View Repo]

## Configuration

No specific configuration required. Automatically uses:
- Scout's target niche for opportunity filtering
- GitHub API token from vault (optional, for enrichment)
- Blue Ocean scan results

## API Integration

### GitHub API (Optional)

When GitHub token is available (from vault), enriches opportunities with:
- Real-time star/fork counts
- Accurate open issues
- Last update timestamp
- Repository metadata

**Without token**: Uses Scout's approximate data (market size as stars proxy)

## Error Handling

- **No Opportunities**: Displays message to run Scout
- **Failed GitHub API**: Falls back to Scout data
- **Parse Errors**: Logs to console, continues with valid data
- **Network Issues**: Shows loading state, retries on user refresh

## Performance

- **Initial Load**: <2 seconds (local JSON parse)
- **GitHub Enrichment**: ~100ms per repository (rate-limited)
- **50 Opportunities**: ~5 seconds to fully enrich
- **Report Generation**: <100ms (synchronous)

## Future Enhancements

- [ ] Auto-refresh opportunities on Scout completion
- [ ] Historical tracking of goldmine evolution
- [ ] Integration with financial forecasting tools
- [ ] Competitive analysis against existing SaaS
- [ ] Automated due diligence reports (license check, security audit)
- [ ] Direct fork + Netlify deployment workflow

## Related Features

- **Feature 4: Phantom Scout** - Generates opportunity data
- **Feature 5: Sonar (Blue Ocean Scanner)** - Finds abandoned repos
- **Feature 6: Mining Drill** - Extracts pain points from issues
- **Self-Improve Loop** - Learns patterns from successful SaaS products

## Developer Notes

### Adding New Goldmine Criteria

Edit [src/lib/goldmine-detector.ts](../src/lib/goldmine-detector.ts):

```typescript
export function findGoldmines(opportunities: Opportunity[]): Opportunity[] {
  return opportunities.filter(repo => {
    const forkRatio = repo.forkRatio ?? (repo.forks / repo.stars);
    
    // Add new criteria here
    const hasCommercialLicense = checkLicense(repo); // New criterion
    
    return repo.stars > 1000 &&
           repo.daysSinceUpdate > 365 &&
           repo.openIssues > 20 &&
           forkRatio < 0.2 &&
           hasCommercialLicense; // Include new criterion
  });
}
```

### Customizing Revenue Models

Modify `calculateGoldmineMetrics()`:

```typescript
// Adjust pricing tiers
const price = 
  repo.stars > 10000 ? 999 : // Higher enterprise pricing
  repo.stars > 5000 ? 499 :
  repo.stars > 2000 ? 299 :
  repo.stars > 1000 ? 199 : 129;

// Adjust conversion rate
const potentialCustomers = repo.stars * 0.02; // 2% conversion
```

## Troubleshooting

**No goldmines found?**
- Run Scout with broader niche (`any` or `web-development`)
- Lower star threshold (edit `findGoldmines` filter)
- Check `data/opportunities/latest.json` exists

**Revenue estimates seem off?**
- Adjust pricing tiers in `calculateGoldmineMetrics`
- Modify conversion rate (default 1%)
- Review fork ratio threshold (affects competition level)

**GitHub API rate limit errors?**
- Add GitHub token to vault (5000 req/hr vs 60 req/hr)
- Increase delay in `enrichOpportunitiesFromGitHub` (100ms → 200ms)
- Process opportunities in smaller batches

---

**Last Updated**: January 7, 2026  
**Version**: 1.0  
**Status**: Production Ready
