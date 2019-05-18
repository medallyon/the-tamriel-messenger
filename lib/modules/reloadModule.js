const decache = require("decache")
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"));

class reloadModule extends Command
{
    constructor()
    {
        super({
            name: "reloadModule",
            description: "Completely reloads a specified system module.",
            alias: [ "reloadModule", "reload" ],
            usage: "[ module-name ]",
            permissions: 900
        });
    }

    run(msg)
    {
        return new Promise(function(resolve, reject)
        {
            if (!msg.args.length)
                return resolve("At least a module name needs to be provided.");

            let category, modName = msg.args[0];
            if (msg.args.length >= 2)
            {
                category = msg.args[0].toLowerCase();
                modName = msg.args[1];
            }

            let allModules = {
                handlers: client.handlers,
                modules: client.modules,
                utils: client.utils
            };

            if (category)
            {
                if (!Object.keys(allModules).includes(category))
                    return reject("The module category you have provided is not valid.");
            }

            else
            {
                category = Object.values(allModules).find(x => Object.keys(x).includes(modName));
                if (!category)
                    return reject(`No module with the name ${msg.args[0]} exists.`);
            }

            try
            {
                decache(path.join(client.Client.__paths[category], modName + ".js"));
                client[category][modName] = require(path.join(client.Client.__paths[category], modName + ".js"));
                resolve("Successfully reloaded `" + modName + "`.");
            }
            catch (error)
            {
                console.error(error);
                return reject("Something went wrong while reloading this module: ```js\n" + error + "```").catch(console.error);
            }
        });
    }
}

module.exports = reloadModule;
