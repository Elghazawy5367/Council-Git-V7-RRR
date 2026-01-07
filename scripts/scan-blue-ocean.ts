#!/usr/bin/env tsx
/**
 * Blue Ocean Scanner - Standalone Script
 * 
 * Finds abandoned goldmines with proven demand.
 * Usage: npx tsx scripts/scan-blue-ocean.ts [topic]
 */

import { scanBlueOcean } from "../src/lib/scout";

async function main(): Promise<void> {
  const topic = process.argv[2] || process.env.TARGET_NICHE || "developer-tools";
  
  console.log("🌊 Blue Ocean Scanner\n");
  console.log(`Topic: ${topic}\n`);
  
  try {
    const opportunities = await scanBlueOcean(topic);
    
    console.log("\n🏆 TOP 10 OPPORTUNITIES:\n");
    opportunities.slice(0, 10).forEach((opp, idx) => {
      console.log(`${idx + 1}. ${opp.owner}/${opp.name}`);
      console.log(`   Score: ${opp.blueOceanScore}/100`);
      console.log(`   Stars: ${opp.stars} | Forks: ${opp.forks} | Days idle: ${opp.daysSinceUpdate}`);
      if (opp.isAbandoned) console.log(`   🎯 GOLDMINE: Abandoned but popular!`);
      console.log(`   ${opp.url}\n`);
    });
    
    const goldmines = opportunities.filter(o => o.isAbandoned && o.hasProvenDemand);
    console.log(`\n💎 Found ${goldmines.length} abandoned goldmines ready to be revived!\n`);
    
    process.exit(0);
  } catch (error) {
    console.error("Scanner failed:", error);
    process.exit(1);
  }
}

main();
