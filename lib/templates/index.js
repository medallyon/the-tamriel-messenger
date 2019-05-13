const path = require("path")
    , client = require(path.join(process.cwd(), "client"))
    , modules = require(client.Client.__paths.modules);

module.exports.ServerConfigTemplate = class ServerConfigTemplate
{
    constructor()
    {
        this.prefix = client.Client.DEFAULT_PREFIX;

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
