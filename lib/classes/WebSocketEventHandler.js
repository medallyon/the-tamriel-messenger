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
        this.socket.on("connect_error", this.on_error_connect.bind(this));
        this.socket.on("connect_timeout", (error) => { console.error("Websocket connection timeout:", error); });
        this.socket.on("error", (error) => { console.error("Websocket error:", error); });

        // custom events sent from grogsile server
        this.socket.on("esoNews_en-us", this.on_eso_new_article.bind(this));
        this.socket.on("patchNotes_en", this.on_eso_patch_notes.bind(this));
        this.socket.on("updatedStatus", this.on_eso_server_update.bind(this));
    }

    on_eso_new_article(article)
    {
        console.log("received new ESO article. Emitting 'news' event...");
        this.client.emit("news", article);
    }

    on_eso_patch_notes(patch)
    {
        if (!patch.title.toUpperCase().includes("PC"))
            return;

        // call 'news' event since the distribution process is identical
        console.log("received new ESO Patch. Emitting 'news' event...");
        this.client.emit("news", patch);
    }

    on_eso_server_update(serversUpdated)
    {
        console.log("received new Server Status Update. Emitting 'serverUpdate' event...");
        this.client.emit("serverUpdate", serversUpdated);
    }
}

module.exports = WebSocketEventHandler;
