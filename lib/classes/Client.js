const fs = require("fs")
    , join = require("path").join
    , Discord = require("discord.js")
    , request = require("request-promise")
    , Profile = require("./Profile.js")
    , Character = require("./Character.js")
    , Guild = require("./Guild.js");

const APP_NAME = "the-tamriel-messenger"
    , APP_VERSION = "0.0.1"
    , DEFAULT_REQUEST_OPTIONS = {
        baseUrl: "https://api.grogsile.org",
        headers: {
            "User-Agent": `${APP_NAME}/${APP_VERSION}`,
            "Authorization": process.env.GROGSILE_API_KEY
        },
        json: true
    };

class Client extends Discord.Client
{
    static get name()
    {
        return APP_NAME;
    }

    static get version()
    {
        return APP_VERSION;
    }

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

        this.request = request.defaults(DEFAULT_REQUEST_OPTIONS);
        this.utils = {};
        this.modules = {};
        this.handlers = {};
    }

    fetchProfile(userId)
    {
        return new Promise(async function(resolve, reject)
        {
            let profileData;
            try
            {
                profileData = await this._get(`/profiles/${userId}`);
            }
            catch (error)
            {
                return reject(error);
            }

            resolve(new Profile(profileData));
        });
    }

    fetchCharacters(userId)
    {
        return new Promise(async function(resolve, reject)
        {
            let characterData;
            try
            {
                characterData = await this._get(`profile/${userId}/characters`);
            }
            catch (error)
            {
                return reject(error);
            }

            let characters = [];
            for (const character of characterData)
                characters.push(new Character(character));

            resolve(characters);
        });
    }

    fetchGuild(guildId)
    {
        return new Promise(async function(resolve, reject)
        {
            let guildData;
            try
            {
                guildData = await this._get(`/guilds/${guildId}`);
            }
            catch(error)
            {
                return reject(error);
            }

            resolve(new Guild(guildData));
        });
    }
}

module.exports = Client;
