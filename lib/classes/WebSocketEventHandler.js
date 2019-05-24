const io = require("socket.io-client");

class WebSocketEventHandler
{
    constructor(client, baseURL = "http://127.0.0.1:8080/", options = {})
    {
        this.client = client;
        this.socket = io(baseURL, options);

        this.socket.on("connect", () => { console.log("[WEBSOCKET] Connected to socket!"); } );
        this.socket.on("connect_error", (error) => { console.error("Websocket connection error:", error); });
        this.socket.on("connect_timeout", (error) => { console.error("Websocket connection timeout:", error); });
        this.socket.on("reconnect_attempt", this.on_reconnect_attempt.bind(this));
        this.socket.on("error", (error) => { console.error("Websocket error:", error); });

        this.socket.on("esoNews_en-us", this.on_eso_new_article.bind(this));
    }

    on_reconnect_attempt()
    {
        this.socket.io.opts.transports = [ "polling", "websocket" ];
    }

    on_eso_new_article(article)
    {
        this.client.emit("news", article);
    }
}

module.exports = WebSocketEventHandler;
