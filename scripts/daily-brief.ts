/**
 * Daily Intelligence Report Generator
 * 
 * Feature 11: Combines Scout + Goldmine Detector + Mining Drill
 * Generates comprehensive daily briefs with actionable intelligence
 * 
 * Usage: npm run brief [niche]
 * Example: npm run brief react-native
 */

import { 
  findGoldmines, 
  generateGoldmineReport, 
  type Opportunity,
  calculateGoldmineMetrics 
} from '../src/lib/goldmine-detector';
import { minePainPoints, type PainPoint } from '../src/lib/mining-drill';
import * as fs from 'fs';
import * as path from 'path';

interface DailyBriefData {
  date: string;
  niche: string;
  opportunitiesFound: number;
  goldminesFound: number;
  opportunities: Opportunity[];
  painPoints: PainPoint[][];
  topRecommendation: Opportunity | null;
  estimatedRevenue: string;
  actionItems: string[];
}

/**
 * Estimate pricing based on star count and metrics
 */
function estimatePrice(repo: Opportunity): number {
  const metrics = calculateGoldmineMetrics(repo);
  return metrics.estimatedPrice;
}

/**
 * Generate comprehensive daily intelligence brief
 */
export async function generateDailyBrief(niche: string): Promise<void> {
  console.log('🔍 Starting daily intelligence gathering...\n');
  
  try {
    // Dynamically import scanBlueOcean to avoid running scout initialization
    const { scanBlueOcean } = await import('../src/lib/scout');
    
    // Step 1: Scan GitHub
    console.log('📡 Scanning GitHub for opportunities...');
    const opportunities = await scanBlueOcean(niche);
    console.log(`   ✓ Found ${opportunities.length} opportunities\n`);
    
    // Step 2: Find goldmines
    console.log('💰 Filtering for abandoned goldmines...');
    const goldmines = findGoldmines(opportunities);
    console.log(`   ✓ Identified ${goldmines.length} goldmines\n`);
    
    if (goldmines.length === 0) {
      console.log('❌ No goldmines found matching criteria. Try a different niche.\n');
      console.log('Criteria:');
      console.log('  - Stars > 1,000 (proven demand)');
      console.log('  - Abandoned > 1 year');
      console.log('  - Open Issues > 20 (active user need)');
      console.log('  - Fork Ratio < 0.2 (low competition)');
      return;
    }
    
    // Step 3: Extract pain points from top 3
    console.log('⛏️  Mining pain points from top 3 goldmines...');
    const top3 = goldmines.slice(0, 3);
    const painPoints: PainPoint[][] = [];
    
    for (const repo of top3) {
      try {
        console.log(`   - ${repo.owner}/${repo.name}...`);
        const pains = await minePainPoints(repo.owner, repo.name);
        painPoints.push(pains);
      } catch (error) {
        console.error(`   ⚠️  Failed to mine ${repo.owner}/${repo.name}:`, error);
        painPoints.push([]);
      }
    }
    console.log(`   ✓ Extracted pain points\n`);
    
    // Step 4: Generate markdown report
    console.log('📄 Generating daily brief...');
    let report = generateGoldmineReport(goldmines);
    
    // Add pain point analysis
    report += '\n\n---\n\n# 🎯 PAIN POINT ANALYSIS\n\n';
    report += '*Marketing copy extracted from actual user complaints*\n\n';
    
    top3.forEach((repo, i) => {
      const pains = painPoints[i]?.slice(0, 5) || [];
      
      report += `## ${i + 1}. ${repo.owner}/${repo.name}\n\n`;
      
      if (pains.length === 0) {
        report += '*No pain points extracted (possible rate limit or private repo)*\n\n';
        return;
      }
      
      pains.forEach((pain, painIndex) => {
        report += `### ${painIndex + 1}. "${pain.title}"\n\n`;
        report += `- **Urgency Score:** ${pain.urgencyScore}/100\n`;
        report += `- **Buying Intent:** ${pain.buyingIntent}/10\n`;
        report += `- **Comments:** ${pain.comments} (active discussion)\n`;
        report += `- **Pain Keywords:** ${pain.painKeywords.join(', ')}\n`;
        report += `- **Status:** ${pain.state}\n`;
        report += `- **URL:** ${pain.url}\n\n`;
        
        // Show snippet of issue body
        const bodySnippet = pain.body.slice(0, 200).trim();
        if (bodySnippet) {
          report += `**User Quote:**\n> ${bodySnippet}${pain.body.length > 200 ? '...' : ''}\n\n`;
        }
      });
      
      report += '\n';
    });
    
    // Add marketing copy section
    report += '## 💡 MARKETING COPY ANGLES\n\n';
    report += '*Use these actual pain points in your marketing:*\n\n';
    
    const allPainKeywords = painPoints
      .flat()
      .flatMap(p => p.painKeywords)
      .reduce((acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const topKeywords = Object.entries(allPainKeywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    if (topKeywords.length > 0) {
      report += '**Top Pain Keywords** (use in headlines):\n';
      topKeywords.forEach(([keyword, count]) => {
        report += `- "${keyword}" (mentioned ${count}x)\n`;
      });
      report += '\n';
    }
    
    // Add action items
    report += '\n## 🚀 ACTION ITEMS - START TODAY\n\n';
    
    if (goldmines[0]) {
      const top = goldmines[0];
      const price = estimatePrice(top);
      const metrics = calculateGoldmineMetrics(top);
      
      report += `### Recommended Starting Point: **${top.owner}/${top.name}**\n\n`;
      report += `**Why this one?**\n`;
      report += `- ⭐ ${top.stars.toLocaleString()} stars = proven demand\n`;
      report += `- 📅 ${top.daysSinceUpdate} days abandoned = zero competition\n`;
      report += `- 🐛 ${top.openIssues} open issues = clear roadmap\n`;
      report += `- 💰 Est. revenue: $${metrics.estimatedRevenueLow.toLocaleString()}-$${metrics.estimatedRevenueHigh.toLocaleString()}/month\n\n`;
      
      report += `**Your 30-Day Sprint:**\n\n`;
      report += `1. ✅ **Week 1: Fork & Fix**\n`;
      report += `   - Clone: \`git clone ${top.url}\`\n`;
      report += `   - Update all dependencies\n`;
      report += `   - Fix top 5 issues (${painPoints[0]?.slice(0, 5).length || 0} already identified)\n`;
      report += `   - Run security audit\n\n`;
      
      report += `2. 💰 **Week 2: Monetization Setup**\n`;
      report += `   - Price point: $${price}/year (or $${Math.round(price / 12)}/month)\n`;
      report += `   - Create landing page at \`${top.name}.io\`\n`;
      report += `   - Set up Stripe/Paddle payment\n`;
      report += `   - Add license key system\n\n`;
      
      report += `3. 📣 **Week 3: Marketing Launch**\n`;
      report += `   - Email all ${top.stars.toLocaleString()} stargazers\n`;
      report += `   - Post in original repo: "Maintained fork available"\n`;
      report += `   - Create comparison table (old vs new)\n`;
      report += `   - Submit to Product Hunt\n\n`;
      
      report += `4. 📈 **Week 4: Growth**\n`;
      report += `   - Target: ${Math.round(metrics.potentialCustomers * 0.01)}-${Math.round(metrics.potentialCustomers * 0.02)} customers (1-2% conversion)\n`;
      report += `   - Revenue goal: $${Math.round(metrics.estimatedRevenueLow * 0.5).toLocaleString()}/month (50% of potential)\n`;
      report += `   - Add testimonials to landing page\n`;
      report += `   - Start second goldmine\n\n`;
      
      report += `**Success Probability: ${metrics.competitionLevel === 'low' ? 'HIGH ✅' : 'MEDIUM ⚠️'}**\n`;
      report += `- Competition: ${metrics.competitionLevel}\n`;
      report += `- Time to market: ${metrics.timeToMarket}\n`;
      report += `- Blue Ocean Score: ${top.blueOceanScore || 0}/100\n\n`;
    }
    
    // Add portfolio strategy
    report += '## 📊 PORTFOLIO STRATEGY\n\n';
    report += `You found **${goldmines.length} goldmines** today. Here's how to build a portfolio:\n\n`;
    report += `**Parallel Launch Strategy:**\n`;
    report += `- Months 1-2: Launch goldmine #1 (${goldmines[0]?.name || 'TBD'})\n`;
    report += `- Months 3-4: Launch goldmine #2 (${goldmines[1]?.name || 'TBD'})\n`;
    report += `- Months 5-6: Launch goldmine #3 (${goldmines[2]?.name || 'TBD'})\n\n`;
    
    const totalPotential = goldmines.slice(0, 3).reduce((sum, repo) => {
      const metrics = calculateGoldmineMetrics(repo);
      return sum + metrics.estimatedRevenueLow;
    }, 0);
    
    report += `**6-Month Revenue Target:**\n`;
    report += `- Conservative (1% conversion): $${Math.round(totalPotential * 0.01).toLocaleString()}/month\n`;
    report += `- Realistic (2% conversion): $${Math.round(totalPotential * 0.02).toLocaleString()}/month\n`;
    report += `- Optimistic (5% conversion): $${Math.round(totalPotential * 0.05).toLocaleString()}/month\n\n`;
    
    // Footer
    report += '\n---\n\n';
    report += `*Generated by Council Daily Intelligence Report*\n`;
    report += `*Date: ${new Date().toISOString()}*\n`;
    report += `*Niche: ${niche}*\n`;
    
    // Save markdown report
    const date = new Date().toISOString().split('T')[0];
    const dataDir = path.join(process.cwd(), 'data');
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const markdownFilename = path.join(dataDir, `daily-brief-${niche}-${date}.md`);
    fs.writeFileSync(markdownFilename, report);
    console.log(`   ✓ Markdown report: ${markdownFilename}\n`);
    
    // Save JSON data for programmatic access
    const jsonData: DailyBriefData = {
      date,
      niche,
      opportunitiesFound: opportunities.length,
      goldminesFound: goldmines.length,
      opportunities: goldmines,
      painPoints,
      topRecommendation: goldmines[0] || null,
      estimatedRevenue: goldmines[0] 
        ? `${calculateGoldmineMetrics(goldmines[0]).estimatedRevenueLow}-${calculateGoldmineMetrics(goldmines[0]).estimatedRevenueHigh}`
        : '0-0',
      actionItems: goldmines[0] ? [
        `Fork ${goldmines[0].owner}/${goldmines[0].name}`,
        'Fix top 5 issues',
        `Price at $${estimatePrice(goldmines[0])}`,
        'Market using pain keywords',
        `Email ${goldmines[0].stars.toLocaleString()} stargazers`
      ] : []
    };
    
    const jsonFilename = path.join(dataDir, `daily-brief-${niche}-${date}.json`);
    fs.writeFileSync(jsonFilename, JSON.stringify(jsonData, null, 2));
    console.log(`   ✓ JSON data: ${jsonFilename}\n`);
    
    // Print summary to console
    console.log('✅ Daily brief generated successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 QUICK SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Niche: ${niche}`);
    console.log(`Opportunities Found: ${opportunities.length}`);
    console.log(`Goldmines Identified: ${goldmines.length}`);
    
    if (goldmines[0]) {
      const top = goldmines[0];
      const metrics = calculateGoldmineMetrics(top);
      console.log(`\n🏆 TOP RECOMMENDATION: ${top.owner}/${top.name}`);
      console.log(`   ⭐ Stars: ${top.stars.toLocaleString()}`);
      console.log(`   📅 Abandoned: ${top.daysSinceUpdate} days`);
      console.log(`   💰 Est. Revenue: $${metrics.estimatedRevenueLow.toLocaleString()}-$${metrics.estimatedRevenueHigh.toLocaleString()}/month`);
      console.log(`   🎯 Price Point: $${metrics.estimatedPrice}/year`);
      console.log(`   📊 Blue Ocean Score: ${top.blueOceanScore || 0}/100`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`\n📖 Read full report: ${markdownFilename}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error generating daily brief:', error);
    
    if (error instanceof Error) {
      console.error('\nDetails:', error.message);
      
      if (error.message.includes('API rate limit')) {
        console.error('\n💡 TIP: Wait a few minutes and try again, or set GITHUB_TOKEN environment variable');
      }
    }
    
    process.exit(1);
  }
}

/**
 * CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  // Check for help flag FIRST before any other operations
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📊 Daily Intelligence Report Generator

USAGE:
  npm run brief [niche]
  npm run brief -- --help

EXAMPLES:
  npm run brief react-native          # Scan React Native ecosystem
  npm run brief developer-tools       # Scan developer tools
  npm run brief machine-learning      # Scan ML/AI tools
  npm run brief data-visualization    # Scan data viz tools

WHAT IT DOES:
  1. Scans GitHub for abandoned projects with high stars
  2. Filters for "goldmines" (high demand, zero competition)
  3. Extracts pain points from top 3 goldmines
  4. Generates actionable intelligence report
  5. Provides 30-day sprint plan to fork & monetize

OUTPUT FILES:
  - data/daily-brief-[niche]-[date].md   (Human-readable report)
  - data/daily-brief-[niche]-[date].json (Machine-readable data)

ENVIRONMENT:
  GITHUB_TOKEN - Optional, increases rate limits from 60 to 5,000/hour

TIPS:
  - Run this daily to track new opportunities
  - Focus on niches you understand
  - Start with "easy wins" (2-4 week projects)
  - Target goldmines with 1,000-5,000 stars first
    `);
    process.exit(0);
  }
  
  const niche = args[0] || 'developer-tools';
  
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 DAILY INTELLIGENCE REPORT GENERATOR');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Target Niche: ${niche}`);
  console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  await generateDailyBrief(niche);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
