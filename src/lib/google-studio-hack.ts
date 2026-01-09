/**
 * Google Studio Hack - IDE Limit Bypass
 * 
 * Opens Google AI Studio in browser when Copilot hits message limits.
 * Provides unlimited, free, high-context tokens for heavy coding tasks.
 * 
 * Priority: 10/10
 * Effort: Low
 */

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface GoogleStudioOptions {
  context?: string;
  files?: string[];
  autoOpen?: boolean;
  exportToFile?: boolean;
}

/**
 * Opens Google AI Studio with optional context
 */
export function openGoogleStudio(options: GoogleStudioOptions = {}): void {
  const url = 'https://aistudio.google.com/app/prompts/new_chat';
  
  console.log('🚀 Opening Google AI Studio...');
  console.log('   Bypass: Copilot message limits');
  console.log('   Access: Unlimited free tokens');
  
  // Open in browser (works on Linux, macOS, Windows)
  const command = process.platform === 'darwin' 
    ? 'open' 
    : process.platform === 'win32' 
      ? 'start' 
      : 'xdg-open';
  
  try {
    child_process.execSync(`${command} "${url}"`, { stdio: 'ignore' });
    console.log('✅ Google AI Studio opened in browser');
    
    if (options.context || options.files) {
      prepareContext(options);
    }
  } catch (error) {
    console.error('❌ Failed to open browser:', error);
    console.log(`📋 Manual URL: ${url}`);
  }
}

/**
 * Prepares context for pasting into Google Studio
 */
function prepareContext(options: GoogleStudioOptions): void {
  let context = '';
  
  if (options.context) {
    context += `# Context\n\n${options.context}\n\n`;
  }
  
  if (options.files && options.files.length > 0) {
    context += '# Code Files\n\n';
    
    for (const filePath of options.files) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(process.cwd(), filePath);
        context += `## ${relativePath}\n\`\`\`\n${content}\n\`\`\`\n\n`;
      } catch (error) {
        console.warn(`⚠️  Failed to read ${filePath}`);
      }
    }
  }
  
  if (context && options.exportToFile !== false) {
    const outputPath = path.join(process.cwd(), 'data', 'google-studio-context.txt');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, context);
    console.log(`📄 Context saved to: ${outputPath}`);
    console.log('   Copy and paste into Google AI Studio');
  }
}

/**
 * Creates a shareable prompt template
 */
export function createPromptTemplate(taskDescription: string, files: string[]): string {
  const template = `# Task
${taskDescription}

# Files to Analyze
${files.map(f => `- ${path.basename(f)}`).join('\n')}

# Instructions
1. Analyze the provided code files
2. Suggest improvements following best practices
3. Provide complete, working code (no placeholders)
4. Ensure TypeScript strict mode compliance

# Code Files
`;

  let fullPrompt = template;
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(process.cwd(), filePath);
      fullPrompt += `\n## ${relativePath}\n\`\`\`typescript\n${content}\n\`\`\`\n`;
    } catch (error) {
      console.warn(`⚠️  Failed to read ${filePath}`);
    }
  }
  
  return fullPrompt;
}

/**
 * Auto-switch to Google Studio when limit detected
 */
export function autoSwitchOnLimit(errorMessage: string, context?: string): boolean {
  const limitKeywords = [
    'rate limit',
    'too many requests',
    'quota exceeded',
    'message limit',
    'token limit'
  ];
  
  const isLimit = limitKeywords.some(keyword => 
    errorMessage.toLowerCase().includes(keyword)
  );
  
  if (isLimit) {
    console.log('🔄 Copilot limit detected - switching to Google Studio...');
    openGoogleStudio({ context, autoOpen: true });
    return true;
  }
  
  return false;
}

/**
 * CLI interface
 */
export async function runGoogleStudioHack(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 Google Studio Hack - IDE Limit Bypass

Usage:
  npm run studio                    # Open Google AI Studio
  npm run studio --context "task"   # Open with context
  npm run studio --files src/*.ts   # Include files
  npm run studio --template         # Create prompt template

Options:
  --context <text>   Add context description
  --files <paths>    Include file paths (comma-separated)
  --template         Generate prompt template
  --help, -h         Show this help

Examples:
  npm run studio
  npm run studio --context "Fix TypeScript errors"
  npm run studio --files "src/lib/scout.ts,src/lib/mining-drill.ts"
  npm run studio --template --files "src/features/council/api/ai-client.ts"

Tip: Use when Copilot hits message limits for uninterrupted coding.
    `);
    return;
  }
  
  const contextIndex = args.indexOf('--context');
  const filesIndex = args.indexOf('--files');
  const isTemplate = args.includes('--template');
  
  const options: GoogleStudioOptions = {
    context: contextIndex !== -1 ? args[contextIndex + 1] : undefined,
    files: filesIndex !== -1 ? args[filesIndex + 1].split(',') : undefined,
    autoOpen: !isTemplate
  };
  
  if (isTemplate && options.files) {
    const template = createPromptTemplate(
      options.context || 'Analyze and improve these files',
      options.files
    );
    
    const outputPath = path.join(process.cwd(), 'data', 'google-studio-prompt.txt');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, template);
    
    console.log('✅ Prompt template created');
    console.log(`📄 Path: ${outputPath}`);
    console.log('📋 Copy contents and paste into Google AI Studio');
  } else {
    openGoogleStudio(options);
  }
}

// Run if called directly
if (require.main === module) {
  runGoogleStudioHack().catch(console.error);
}
