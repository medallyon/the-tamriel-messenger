const Client = require("../classes/Client.js")
    , modules = require("../modules");

module.exports.ServerConfigTemplate = class ServerConfigTemplate
{
    constructor()
    {
        this.prefix = Client.DEFAULT_PREFIX;

        this.commands = {};
        for (const m in modules)
        {
            let mod = modules[m];

            if (mod.meta.system)
                continue;

            this.commands[mod.meta.name] = {
                enabled: true
            };
        }
    }
};
