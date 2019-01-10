class ClientEventHandler
{
    constructor(client)
    {
        this.client = client;
        this.handlers = require("../handlers");

        this.client.on("message", this.handlers.message);
    }
}

module.exports = ClientEventHandler;
