const { ServerConfigTemplate } = require("../templates");

class ServerConfig
{
    constructor()
    {
        Object.assign(this, new ServerConfigTemplate());
    }
}

module.exports = ServerConfig;
