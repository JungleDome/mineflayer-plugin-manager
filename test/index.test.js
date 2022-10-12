const assert = require('node:assert/strict');
const { createBot, Bot } = require('mineflayer');
const { plugin } = require('../lib/index');
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


    bot.loadPlugin(plugin);
    bot.pluginManager.load().then(x => {
        //Assert plugins loaded
        assert(x.newAttribute.attr1 == 'test_attr', 'Mock plugin failed to load.');
        //Assert newly added attribute are cleared after unload
        x.pluginManager.unload().then(() => {
            assert(x.newAttribute == undefined, 'Mock plugin failed to unload.');
            console.log('Plugins can be loaded & custom variable is unloaded succesfully.');
            process.exit(1);
        });
    });
}



testPluginManager();