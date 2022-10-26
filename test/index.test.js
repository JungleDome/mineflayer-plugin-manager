const assert = require('node:assert/strict');
const { createBot, Bot } = require('mineflayer');
const { plugin: PluginManager } = require('../lib/index');
const Config = require('./config.json');


function testPluginManager() {
    let bot = createBot({
        username: Config.username,
        host: Config.host,
        port: Config.port,
        version: Config.version,
        pluginManager: {
            logDebug: true,
            pluginDir: './test/plugins'
        }
    });


    bot.loadPlugin(PluginManager);
    
    bot.once('pluginManager_loaded', async () => {
        assertAttributeAdded()
        assertListenerAdded()
        await bot.pluginManager.unload()
        assertAttributeRemoved()
        assertListenerRemoved()
        console.log('Plugins can be loaded & custom variable is unloaded succesfully.');

        console.log('Testing events removed are untracked by proxy properly.');
        console.log('Log should show event unregistered.');
        testListenerAddAndRemove()
        process.exit(1);
    })


    function assertAttributeAdded() {
        assert(bot.pluginManager.proxifiedBot.newAttribute.attr1 == 'test_attr', 'No new attribute is added.');
        assert(bot.pluginManager.proxifiedBot.newAssignAttribute.attr1 == 'test_attr', 'No new attribute is added from Object.assign.');
        
    }
    function assertListenerAdded() {
        assert(bot.pluginManager.proxifiedBot.listenerCount('newEvent') == 1, 'No new listener is added.');
    }
    function assertAttributeRemoved() {
        assert(bot.pluginManager.proxifiedBot.newAttribute == undefined, 'New attribute failed to remove.');
        assert(bot.pluginManager.proxifiedBot.newAssignAttribute == undefined, 'New attribute added from Object.assign failed to remove.');
    }
    function assertListenerRemoved() {
        assert(bot.pluginManager.proxifiedBot.listenerCount('newEvent') == 0, 'New listener failed to remove.');
    }
    function testListenerAddAndRemove() {
        let cb = () => {return true}
        bot.pluginManager.proxifiedBot.addListener('newRemovingEvent', cb)
        bot.pluginManager.proxifiedBot.removeListener('newRemovingEvent', cb)

        bot.pluginManager.proxifiedBot.addListener('newRemovingEvent', cb)
        bot.pluginManager.proxifiedBot.addListener('newRemovingEvent', cb)
        bot.pluginManager.proxifiedBot.removeAllListeners('newRemovingEvent')
    }

}




testPluginManager();
