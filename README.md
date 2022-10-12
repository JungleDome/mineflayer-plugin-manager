<h1 align="center">mineflayer-plugin-manager</h1>
<p align="center"><i>A plugin manager that is capable of hot-reloading Mineflayer plugin.</i></p>

<p align="center">
  <img src="https://github.com/JungleDome/mineflayer-plugin-manager/workflows/Build/badge.svg" />
  <img src="https://img.shields.io/npm/v/mineflayer-plugin-manager" />
  <img src="https://img.shields.io/github/repo-size/JungleDome/mineflayer-plugin-manager" />
  <img src="https://img.shields.io/npm/dm/mineflayer-plugin-manager" />
  <img src="https://img.shields.io/github/contributors/JungleDome/mineflayer-plugin-manager" />
  <img src="https://img.shields.io/github/license/JungleDome/mineflayer-plugin-manager" />
</p>

---

### Installation

```bash
npm install mineflayer-plugin-manager
```

### Usage

Simple example:

- Run `npm install mineflayer-plugin-manager`.
- Place all Mineflayer plugins inside `./plugins` folder.
- Import mineflayer-plugin-manager: `const { plugin as PluginManager } = require('mineflayer-plugin-manager')`.
- Call `bot.loadPlugin(PluginManager)`.
- Make changes to your plugins.
- Call `bot.pluginManager.reload()`.
- Enjoy new changes.

```js
const Mineflayer = require("mineflayer");
const { plugin as PluginManager } = require("mineflayer-plugin-manager");
const gui = require("mineflayer-gui");

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'bot',
});

//Load all remote plugins that is installed from npm
bot.loadPlugin(gui.plugin);

//Loads plugin manager, it will automatically load all local plugins inside './myFolder' folder
bot.loadPlugin(PluginManager);

//Reload all plugins with latest content
bot.pluginManager.reload();
```

Advanced usage (refer [API](https://github.com/JungleDome/mineflayer-plugin-manager/blob/master/docs/api.md)):

```js
const Mineflayer = require("mineflayer");
const { plugin as PluginManager } = require("mineflayer-plugin-manager");
const gui = require("mineflayer-gui");

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'bot',
  pluginManager: {
    logDebug: true, //Enable debug logging
    pluginDir: './myFolder' //Override default plugin folder path
    removeListener: true,
    removeAttributes: true,
    onlyLoadJsPlugin: true,
    whitelistFileTypes: ['.js', '.json']
  }
});

//Load all remote plugins that is installed from npm
bot.loadPlugin(gui.plugin);

//Loads plugin manager, it will automatically load all local plugins inside './myFolder' folder
bot.loadPlugin(PluginManager);

//Reload all plugins with latest content
bot.pluginManager.reload();
```

### Documentation

[API](https://github.com/JungleDome/mineflayer-plugin-manager/blob/master/docs/api.md)

### License

This project uses the [MIT](https://github.com/JungleDome/mineflayer-plugin-manager/blob/master/LICENSE) license.

### Contributions

This project is accepting PRs and Issues. See something you think can be improved? Go for it! Any and all help is highly appreciated!

For larger changes, it is recommended to discuss these changes in the issues tab before writing any code. It's also preferred to make many smaller PRs than one large one, where applicable.
