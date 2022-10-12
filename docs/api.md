# API

## Properties

### bot.pluginManager.options.pluginDir

Directory where all Mineflayer plugins is located in.

default: `./plugins`

### bot.pluginManager.options.whitelistFileTypes

File type that is allowed to load.

default: `['.js','.json']`

### bot.pluginManager.options.onlyLoadJsPlugin

Only load files with `.js` extension as plugin. 

Set to `false` if you have plugin that is not js file

default: `true`    

### bot.pluginManager.options.removeListener

Remove all listeners registered by other plugins.

*Caution: Only disable this only when you know what you are doing.*

default: `true`

### bot.pluginManager.options.removeAttributes

Remove all attributes registered by other plugins.

*Caution: Only disable this only when you know what you are doing.*

default: `true`

### bot.pluginManager.options.logDebug

Logs information about what Plugin Manager is up to.

default: `false`

## Methods

### bot.pluginManager.load()

Load all Mineflayer plugins in `pluginDir` folder

### bot.pluginManager.unload()

Unload all Mineflayer plugins in `pluginDir` folder.

### bot.pluginManager.reload()

Reload all Mineflayer plugins.

Shorthand for `bot.pluginManager.load(); bot.pluginManager.reload();`
