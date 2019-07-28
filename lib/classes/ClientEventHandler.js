class ClientEventHandler
{
    constructor(client)
    {
        this.client = client;
        this.handlers = require(client.Client.__paths.handlers);

        // native events
        this.client.on("message", this.handlers.message);
        this.client.on("guildCreate", this.handlers.guildCreate);
        this.client.on("guildDelete", this.handlers.guildDelete);
        this.client.on("voiceStateUpdate", this.handlers.voiceStateUpdate);

        // custom events
        this.client.on("tweet", this.handlers.tweet);
        this.client.on("news", this.handlers.esoNews);
        // this.client.on("serverUpdate", this.handlers.serverUpdate);

        console.log("Finished setting up custom event handlers.");
    }
}

module.exports = ClientEventHandler;
