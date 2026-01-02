import { ExpertPlugin } from "./plugins";

class PluginManager {
  private static instance: PluginManager;
  private expertPlugins: Map<string, ExpertPlugin> = new Map();

  private constructor() {}

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  public registerExpertPlugin(plugin: ExpertPlugin): void {
    this.expertPlugins.set(plugin.id, plugin);
  }

  public getExpertPlugin(id: string): ExpertPlugin | undefined {
    return this.expertPlugins.get(id);
  }

  public getAllExpertPlugins(): ExpertPlugin[] {
    return Array.from(this.expertPlugins.values());
  }
}

export const pluginManager = PluginManager.getInstance();
