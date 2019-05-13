const path = require("path");

class ClientEventHandler
{
    constructor(client)
    {
        this.client = client;
        this.handlers = require(path.join(__base, "lib", "handlers"));

        this.client.on("tweet", this.handlers.tweet);
        this.client.on("message", this.handlers.message);
    }
}

module.exports = ClientEventHandler;
