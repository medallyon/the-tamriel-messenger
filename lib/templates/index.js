const path = require("path")
    , client = require(path.join(process.cwd(), "client"));

module.exports.ServerConfigTemplate = class ServerConfigTemplate
{
    constructor()
    {
        this.prefix = client.Client.DEFAULT_PREFIX;

        this.commands = {};
        for (const m in client.modules)
        {
            let mod = client.modules[m];

            if (mod.system)
                continue;

            this.commands[mod.name] = {
                enabled: true
            };
        }
    }
};
