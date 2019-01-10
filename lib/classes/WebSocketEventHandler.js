const io = require("socket.io-client");

class WebSocketEventHandler
{
    constructor(url = "https://127.0.0.1:8080", options = {})
    {
        this.socket = io(url, options);

        this.socket.on("connect", () => { console.log("Websocket Connection Established"); });
        this.socket.on("connect_error", (error) => { console.error("Websocket connection error:", error); });
        this.socket.on("connect_timeout", (error) => { console.error("Websocket connection timeout:", error); });
        this.socket.on("error", (error) => { console.error("Websocket error:", error); });

        this.socket.on("test", this.test);
    }

    test(data)
    {
        console.log(data);
    }
}

module.exports = WebSocketEventHandler;
