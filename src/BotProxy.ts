//@ts-nocheck
import { debug } from 'console'
import { Bot } from 'mineflayer'
import { Util } from './Util'

interface BotProxyOptions {
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

export class BotProxy {
    public addedProperties: string[] | symbol[] = []
    public addedListeners: string[] = []
    public proxyListenerAddMethod = ['addListener', 'on', 'once', 'prependListener', 'prependOnceListener']
    public proxyListenerRemoveMethod = ['removeListener']
    public bot: Bot
    public proxifiedBot: Bot

    constructor(public bot: Bot, public options: BotProxyOptions) { }

    /**
     * Setting up proxy that will catch all property & listener registered
     */
    public setupProxy(): Bot {
        let vm = this
        this.proxifiedBot = new Proxy(this.bot, {
            //Required to let 'this' keyword works properly in private property & methods
            get(target, prop, receiver) {
                const value = target[prop];
                Util.debug(vm.options.logDebug, `Requested attribute '${prop}'`)

                if (value instanceof Function) {
                    return function (...args) {
                        //Register listeners added from plugins
                        if (vm.proxyListenerAddMethod.includes(prop)) {
                            vm.addedListeners.push([...args])
                            Util.debug(vm.options.logDebug, `Listener '${args[0]}' is registered`)
                        } else if (vm.proxyListenerRemoveMethod.includes(prop)) {
                            vm.addedListeners.splice(vm.addedListeners.findIndex(x => x == [...args]),1)
                            Util.debug(vm.options.logDebug, `Listener '${args[0]}' is unregistered`)
                        } else if (prop == 'removeAllListeners') {
                            vm.addedListeners = vm.addedListeners.filter(x => x[0] != args[0])
                            Util.debug(vm.options.logDebug, `All listener '${args[0]}' is unregistered`)
                        }

                        return value.apply(this === receiver ? target : this, args);
                    };
                }
                return value;
            },
            set(target, prop, value) {
                //Register properties added from plugins
                Util.debug(vm.options.logDebug, `Property '${prop}' is registering`)
                if (!(prop in target)) {
                    vm.addedProperties.push(prop)
                    Util.debug(vm.options.logDebug, `Property '${prop}' is registered`)
                }

                //Handle fundamental property ('this' keyword is supported)
                return target[prop] = value
            },
            deleteProperty(target, prop) {
                //Unregister properties when plugins does not use it anymore, so js can GC properly
                if (vm.addedProperties.includes(prop)) {
                    vm.addedProperties.splice(vm.addedProperties.findIndex(x => x == prop), 1)
                    Util.debug(vm.options.logDebug, `Property '${prop}' is unregistered`)
                }
                return delete target[prop]
            },
        })

        return this.proxifiedBot
    }

    /**
     * Remove all property & listener catched
     */
    public reset(): void {
        //Remove properties
        if (this.options.removeAttributes) {
            for (let prop of this.addedProperties) {
                try {
                    Util.debug(this.options.logDebug, `Removing property '${prop}'...`)

                    delete this.bot[prop]

                    if (this.bot[prop] != undefined)
                        Util.debug(this.options.logDebug, `Failed to remove property '${prop}', is it configurable?`)

                } catch (error) {
                    Util.debug(this.options.logDebug, `Error removing property '${prop}'`)
                    Util.debug(this.options.logDebug, error)
                }
            }
        }

        //Remove listener
        if (this.options.removeListener) {
            for (let listener of this.addedListeners) {
                Util.debug(this.options.logDebug, `Removing listener '${listener[0]}'`)
                this.bot.removeListener(...listener)
                Util.debug(this.options.logDebug, `Removed listener '${listener[0]}'`)
            }
        }

        this.clear()
    }

    private clear(): void {
        this.addedProperties = []
        this.addedListeners = []
    }
}