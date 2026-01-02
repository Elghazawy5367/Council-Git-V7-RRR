export interface PluginBase {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ExpertPlugin extends PluginBase {
  renderConfig: (config: any, onChange: (newConfig: any) => void) => React.ReactNode;
  execute: (input: string, config: any) => Promise<string>;
  validateConfig: (config: any) => boolean;
  defaultConfig: any;
}

export interface ModePlugin extends PluginBase {
  execute: (experts: any[], task: string, config: any) => Promise<any>;
  defaultConfig: any;
}
