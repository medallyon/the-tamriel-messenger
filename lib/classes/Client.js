const join = require("path").join
    , Discord = require("discord.js")
    , request = require("request-promise")
    /*, WebSocketEventHandler = require("./WebSocketEventHandler.js")*/;

const APP_NAME = "the-tamriel-messenger"
    , APP_VERSION = "0.0.1"
    , DEFAULT_REQUEST_OPTIONS = {
        baseUrl: "https://api.grogsile.org",
        headers: {
            "User-Agent": `${APP_NAME}/${APP_VERSION}`,
            "Authorization": process.env.GROGSILE_API_KEY
        },
        json: true
    }
    , PATHS = {
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
    static get NAME() { return APP_NAME; }
    static get VERSION() { return APP_VERSION; }
    static get DEFAULT_PREFIX() { return process.env.DEFAULT_PREFIX || "\\"; }
    static get OWNER_ID() { return process.env.OWNER_ID || ""; }
    static get DEVELOPERS() { return []; }
    static get __paths() { return PATHS; }

    _get(endpoint)
    {
        return new Promise(function(resolve, reject)
        {
            if (!endpoint)
                endpoint = "";

            return this.request(endpoint)
                .then(resolve)
                .catch(reject);
        });
    }

    _post(endpoint, data)
    {
        return new Promise(function(resolve, reject)
        {
            if (!endpoint)
                endpoint = "";

            this.request({
                uri: endpoint,
                method: "POST",
                body: data
            })
                .then(resolve)
                .catch(reject);
        });
    }

    constructor(options)
    {
        super(options);
        this.Client = Client;
        this.prefix = Client.DEFAULT_PREFIX;

        // this.socketEventHandler = new WebSocketEventHandler(DEFAULT_REQUEST_OPTIONS.baseUrl, { path: "/ttm-connection" });
        this.request = request.defaults(DEFAULT_REQUEST_OPTIONS);

        this.utils = null;
        this.modules = null;
        this.eventHandler = null;
    }
}

module.exports = Client;
