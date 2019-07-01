class ClientEventHandler
{
    constructor(client)
    {
        this.client = client;
        this.handlers = require(client.Client.__paths.handlers);

        // native events
        this.client.on("message", this.handlers.message);

        // custom events
        this.client.on("tweet", this.handlers.tweet);
        console.log("Finished setting up custom event handlers.");
        this.client.on("news", this.handlers.esoNews);
    }
}

module.exports = ClientEventHandler;
