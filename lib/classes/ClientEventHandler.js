class ClientEventHandler
{
    constructor(client)
    {
        this.client = client;
        this.handlers = require(client.Client.__paths.handlers);

        this.client.on("tweet", this.handlers.tweet);
        this.client.on("message", this.handlers.message);
    }
}

module.exports = ClientEventHandler;
