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
        this.client.on("news", this.handlers.esoNews);
        // this.client.on("serverUpdate", this.handlers.serverUpdate);
        this.client.on("voiceStateUpdate", this.handlers.voiceStateUpdate);

        console.log("Finished setting up custom event handlers.");
    }
}

module.exports = ClientEventHandler;
