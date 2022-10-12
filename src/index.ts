import { Bot, BotOptions } from 'mineflayer'
import { PluginManager, PluginManagerOptions } from './PluginManager'

export function plugin(bot: Bot, options: BotOptions) {
    const defaultOptions: PluginManagerOptions = {
        logDebug: false,
        removeListener: true,
        removeAttributes: true,
        onlyLoadJsPlugin: true,
        pluginDir: './plugins',
        whitelistFileTypes: ['.js', '.json']
    }

    //@ts-ignore
    bot.pluginManager = new PluginManager(bot, options, Object.assign({}, defaultOptions, options.pluginManager))
    bot.pluginManager.load()
}

declare module "mineflayer" {
    interface Bot {
        pluginManager: PluginManager;
    }
    interface BotOptions {
        pluginManager: PluginManagerOptions
    }
}

export { PluginManager, PluginManagerOptions } from './PluginManager'