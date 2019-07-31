const join = require("path").join
    , Discord = require("discord.js")
    , APIWrapper = require(join(__dirname, "APIWrapper.js"))
    , WebSocketEventHandler = require(join(__dirname, "WebSocketEventHandler.js"));

const PATHS = {
    base: process.cwd(),
    lib: join(process.cwd(), "lib"),
    classes: join(process.cwd(), "lib", "classes"),
    modules: join(process.cwd(), "lib", "modules"),
    handlers: join(process.cwd(), "lib", "handlers"),
    utils: join(process.cwd(), "lib", "utils"),
    persistence: join(process.cwd(), "persistence")
};

class Client extends Discord.Client
{
    static get NAME() { return process.env.APP_NAME; }
    static get VERSION() { return process.env.APP_VERSION; }
    static get OWNER_ID() { return process.env.OWNER_ID || ""; }
    static get DEFAULT_PREFIX() { return process.env.DEFAULT_PREFIX || "\\"; }
    static get DEVELOPERS() { return []; }
    static get __paths() { return PATHS; }

    constructor(options)
    {
        super(options);
        this.Client = Client;
        this.prefix = Client.DEFAULT_PREFIX;

        this.socketEventHandler = new WebSocketEventHandler(this, process.env.WEBSOCKET_DOMAIN);
        this.api = new APIWrapper();

        this.crons = null;
        this.utils = null;
        this.modules = null;
        this.eventHandler = null;
    }
}



module.exports = Client;
