const io = require("socket.io-client");

class WebSocketEventHandler
{
    on_error_connect(error)
    {
        if (error.type === "TransportError" && error.description === 503)
            console.error("Disconnected from Server. Attempting to reconnect...");
        else
            console.error("Websocket connection error:", error);
    }

    constructor(client, baseURL = "http://127.0.0.1:8080/", options = {})
    {
        this.client = client;
        this.socket = io(baseURL, options);
        this.socket.io.opts.transports = [ "polling", "websocket" ];

        this.socket.on("connect", () => { console.log("[WEBSOCKET] Connected to socket!"); } );
        this.socket.on("connect_error", this.on_error_connect);
        this.socket.on("connect_timeout", (error) => { console.error("Websocket connection timeout:", error); });
        this.socket.on("error", (error) => { console.error("Websocket error:", error); });

        // ESO News
        this.socket.on("esoNews_en-us", this.on_eso_new_article_en.bind(this));
        this.socket.on("esoNews_de", this.on_eso_new_article_de.bind(this));
        this.socket.on("esoNews_fr", this.on_eso_new_article_fr.bind(this));

        // ESO PatchNotes
        this.socket.on("patchNotes_en", this.on_eso_patch_notes_en.bind(this));
        this.socket.on("patchNotes_de", this.on_eso_patch_notes_de.bind(this));
        this.socket.on("patchNotes_fr", this.on_eso_patch_notes_fr.bind(this));

        // ESO Server Status
        this.socket.on("updatedStatus", this.on_eso_server_update.bind(this));
    }

    on_eso_new_article_en(article)
    {
        this.client.emit("news", "en-us", article);
    }

    on_eso_new_article_de(article)
    {
        this.client.emit("news", "de", article);
    }

    on_eso_new_article_fr(article)
    {
        this.client.emit("news", "fr", article);
    }

    _determinePatchNotesPlatform(title)
    {
        let platform = null;

        if (title.includes("PC"))
            platform = "pc";
        else if (title.includes("XBOX"))
            platform = "xbox";
        else if (title.includes("PS4") || title.includes("PLAYSTATION"))
            platform = "ps4";

        return platform;
    }

    on_eso_patch_notes_en(patch)
    {
        const platform = this._determinePatchNotesPlatform(patch.title.toUpperCase());
        this.client.emit("patchNotes", "en", platform, patch);
    }

    on_eso_patch_notes_de(patch)
    {
        const platform = this._determinePatchNotesPlatform(patch.title.toUpperCase());
        this.client.emit("patchNotes", "de", platform, patch);
    }

    on_eso_patch_notes_fr(patch)
    {
        const platform = this._determinePatchNotesPlatform(patch.title.toUpperCase());
        this.client.emit("patchNotes", "fr", platform, patch);
    }

    on_eso_server_update(serversUpdated)
    {
        console.log("received new Server Status Update. Emitting 'serverUpdate' event...");
        this.client.emit("serverUpdate", serversUpdated);
    }

    emitNewServer(guild)
    {
        console.log("Sending out 'server_add' to connection...");
        this.socket.emit("server_add", {
            id: guild.id,
            owner_id: guild.owner.id
        });
    }

    emitRemoveServer(guild)
    {
        console.log("Sending out 'server_remove' to connection...");
        this.socket.emit("server_remove", guild.id);
    }
}

module.exports = WebSocketEventHandler;
