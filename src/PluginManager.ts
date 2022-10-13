import { Bot, BotOptions } from 'mineflayer'
import { BotProxy } from './BotProxy'
import { Util } from './Util'

export interface PluginManagerOptions {
    /**
     * Directory where all Mineflayer plugins is located in. default: `./plugins`
     */
    pluginDir?: string,
    /**
     * File type that is allowed to load. default: `['.js','.json']`
     */
    whitelistFileTypes?: string[],
    /**
     * Only load files with `.js` extension as plugin. default: `true`
     */
    onlyLoadJsPlugin?: boolean
    /**
     * Remove all listeners registered by other plugins. default: `true`
     */
    removeListener?: boolean,
    /**
     * Remove all attributes registered by other plugins. default: `true`
     */
    removeAttributes?: boolean
    /**
     * Logs information about what Plugin Manager is up to. default: `false`
     */
    logDebug?: boolean,
}

export class PluginManager {
    private loaded: boolean = false
    private proxy: BotProxy
    public get proxifiedBot(): Bot {
        return this.proxy.proxifiedBot
    }

    constructor(private bot: Bot, private botOptions: BotOptions, public options: PluginManagerOptions) {
        this.proxy = new BotProxy(this.bot, this.options)
    }

    private async getPluginPaths(): Promise<string[]> {
        let pluginPaths = await Util.getFiles(this.options.pluginDir)
        return pluginPaths.filter((filePath) =>
            this.options.whitelistFileTypes.some(whitelistType =>
                filePath.endsWith(whitelistType)
            )
        )
    }

    /**
     * Override default Mineflayer `plugin_loader.loadPlugin()` function
     */
    private loadPlugin(plugin: Function): void {
        if (typeof plugin !== 'function')
            throw 'plugin needs to be a function'


        plugin(this.proxy.proxifiedBot, this.botOptions)
    }

    /**
     * Load all Mineflayer plugins in `pluginDir` folder.
     * @async
     */
    public async load(): Promise<Bot> {
        if (this.loaded)
            throw new Error('Plugins already loaded, please use `bot.pluginManager.reload()` instead.')


        let proxifiedBot = this.proxy.setupProxy()
        let pluginPaths = await this.getPluginPaths()


        Util.debug(this.options.logDebug, `Loading plugins from ${this.options.pluginDir}...`)
        pluginPaths.forEach(pluginPath => {
            Util.debug(this.options.logDebug, `Loading ${pluginPath}`)
            let plugin = require(pluginPath)

            if (this.options.onlyLoadJsPlugin) {
                if (pluginPath.endsWith('.js'))
                    this.loadPlugin(plugin)
            } else {
                this.loadPlugin(plugin)
            }
        })

        Util.debug(this.options.logDebug, "Plugins loaded")
        this.loaded = true

        //@ts-ignore
        proxifiedBot.emit('pluginManager_loaded')

        return proxifiedBot
    }

    /**
     * Unload all Mineflayer plugins in `pluginDir` folder.
     * @async
     */
    public async unload(): Promise<Bot> {
        //Enforce proxy setup
        if (!this.loaded)
            throw new Error('Plugins are not loaded, please use `bot.pluginManager.load()` first.')

        this.loaded = false

        let proxifiedBot = this.proxy.proxifiedBot
        let pluginPaths = await this.getPluginPaths()

        Util.debug(this.options.logDebug, "Removing loaded plugins...")
        pluginPaths.forEach(x => {
            Util.debug(this.options.logDebug, `Removing ${x}`)
            delete require.cache[require.resolve(x)]
        })

        Util.debug(this.options.logDebug, "Removing plugin variables & listeners...")
        this.proxy.reset()

        return proxifiedBot
    }

    /**
     * Reload all Mineflayer plugins.
     * 
     * Shorthand for `bot.pluginManager.load(); bot.pluginManager.reload();`
     * @async
     */
    public async reload(): Promise<Bot> {
        await this.unload()
        return await this.load()
    }
}