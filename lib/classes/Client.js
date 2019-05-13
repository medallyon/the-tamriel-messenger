const join = require("path").join
    , Discord = require("discord.js")
    , request = require("request-promise")
    , Twitter = require("twitter")
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

        this.twitterClient = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_TOKEN_SECRET
        });

        this.initiateTwitterStream();
    }

    initiateTwitterStream()
    {
        let self = this;
        getTwitterUserIds.call(this).then(function(twitterUsers)
        {
            if (!twitterUsers.size)
                return self.twitterClient = null;

            self.twitterClient.stream("statuses/filter", { follow: Array.from(twitterUsers.keys()).join(",") }, function(stream)
            {
                console.log("\nNow streaming `statuses/filter` for the following accounts:\n" + Array.from(twitterUsers.values()).join(", "));

                stream.on("data", function(tweet)
                {
                    if (!tweet)
                        return;

                    if (tweet.in_reply_to_status_id || tweet.in_reply_to_user_id)
                        return;

                    if ((tweet.retweeted_status || tweet.quoted_status) &&
                        !twitterUsers.has(tweet.user.id_str))
                        return;

                    if (!tweet.user)
                        return;

                    // hard-code exclusive ESO filter for Bethesda Support
                    if (tweet.user.id_str === "718475378751381504" && !tweet.entities.hashtags.includes("ESO"))
                        return;

                    self.emit("tweet", tweet);
                });

                stream.on("error", console.error);
            });
        }).catch(console.error);
    }
}

function getTwitterUserIds()
{
    let self = this;
    return new Promise(function(resolve, reject)
    {
        let usersToFetch = process.env.TWEETER_SUBSCRIBE_USERS.split(",")
        , twitterFollowIdFilter = new Map()
        , usersProcessed = 0;

        for (const screenName of usersToFetch)
        {
            self.twitterClient.get("/users/show", { screen_name: screenName }, function(err, user)
            {
                usersProcessed++;

                if (err)
                    return reject(err);

                twitterFollowIdFilter.set(user.id_str, screenName);

                if (usersProcessed === usersToFetch.length)
                    resolve(twitterFollowIdFilter);
            });
        }
    });
}

module.exports = Client;
