const Discord = require("discord.js")
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"));

const ESO_NEWS_URL = "http://elderscrollsonline.com/en-us/news"
    , ESO_NEWS_ICON = "http://i.imgur.com/qqvt2UX.png";

function daysAgo(date)
{
    return Math.round(((new Date()) - date) / (1000 * 60 * 60 * 24));
}

class NewsBrowser
{
    static get navigationEmojis()
    {
        return new Map([
            [1, "⏮"],
            [2, "⬅"],
            [3, "➡"],
            [4, "⏭"]
        ]);
    }

    constructor(message, news, startId)
    {
        this.respondToMsg = message;
        this.channel = this.respondToMsg.channel;
        this.initiator = this.respondToMsg.author;

        this.news = news.slice(0, 5);
        this.browserMsg = null;
        this.currentNewsId = startId || 0;

        if (typeof startId === "number")
            this.createBrowser(true)
                .catch(console.error);
        else
        {
            let self = this;
            this.fetchUserChoice()
                .then(function()
                {
                    self.createBrowser(true)
                        .catch(console.error);
                })
                .catch(console.error);
        }
    }

    fetchUserChoice()
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            let items = self.news.map(a => ({
                name: (a.title.length > 125) ? `${a.title.slice(0, 120)}...` : a.title,
                value: `[Read this article online](${a.url}) | ${daysAgo(new Date(a.date))} days ago`
            }));

            let selectorEmbed = new Discord.RichEmbed()
                .setAuthor("ESO News", ESO_NEWS_ICON, ESO_NEWS_URL)
                .setDescription("Here's what's going on in The Elder Scrolls Online!");

            (new client.utils.SelectorEmbed(self.respondToMsg, items, selectorEmbed)).await()
                .then(function([ selectedNumber, collectorMessage ])
                {
                    self.currentNewsId = selectedNumber;

                    self.browserMsg = collectorMessage;
                    self.browserMsg.clearReactions()
                        .catch(console.error)
                        .finally(resolve);
                })
                .catch(reject);
        });
    }

    createBrowser(addEmojis = false)
    {
        let self = this;
        return new Promise(async function(resolve, reject)
        {
            if (!self.browserMsg)
                self.browserMsg = await self.channel.send(self.news[self.currentNewsId].url);

            self.browserMsg.edit(`${client.utils.ReactionAdder.numberEmojis.get(self.currentNewsId + 1)} ${self.news[self.currentNewsId].url}`, { embed: null })
                .then(function()
                {
                    if (addEmojis)
                        (new client.utils.ReactionAdder(self.browserMsg, NewsBrowser.navigationEmojis)).addReactions()
                            .catch(console.error);

                    const filter = function(r, u)
                    {
                        return Array.from(NewsBrowser.navigationEmojis.values()).includes(r.emoji.toString())
                            && u.id === self.initiator.id;
                    };

                    self.browserMsg.awaitReactions(filter, { errors: [ "time" ], time: 1000 * 120, max: 1 })
                        .then(function(collected)
                        {
                            let selectedEmoji = Array.from(NewsBrowser.navigationEmojis.values()).indexOf(collected.first().emoji.toString());

                            switch (selectedEmoji)
                            {
                            case 0:
                                self.currentNewsId = 0;
                                break;
                            case 1:
                                if (self.currentNewsId > 0)
                                    self.currentNewsId--;
                                break;
                            case 2:
                                if (self.currentNewsId < 4)
                                    self.currentNewsId++;
                                break;
                            case 3:
                                self.currentNewsId = 4;
                                break;
                            }

                            self.createBrowser().catch(console.error);
                        })
                        .catch(function()
                        {
                            self.browserMsg.clearReactions().catch(console.error);
                        })
                        .finally(function()
                        {
                            let userReactions = self.browserMsg.reactions.filter(r => r.users.has(self.initiator.id));
                            for (const reaction of userReactions.values())
                                reaction.remove(self.initiator).catch(console.error);
                        });
                })
                .catch(reject);
        });
    }
}

class news extends Command
{
    constructor()
    {
        super({
            name: "news",
            description: "Displays and choose from the latest news in the ESO Universe.",
            alias: [ "news" ],
            usage: "[ en, de, fr ] [ 1-5 ]",
            permissions: 100
        });

        this.languageRegExp = /^(?:(en)(?:(?:glish)|-(?:us|uk))?|(de)(?:utsch)?|(fr)(?:(?:ench)|(?:an(?:ç|c)ais))?|(ger)(?:man)?)$/i;
        this.numberRegExp = /^[1-5]$/;
    }

    run(msg)
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            let lang = null;
            if (msg.args[0] && self.languageRegExp.test(msg.args[0]))
                lang = msg.args[0].match(self.languageRegExp).filter(m => !(!m))[1].toLowerCase();

            if ([ "en", "en-uk" ].includes(lang))
                lang = "en-us";
            else if (lang === "ger")
                lang = "de";

            let newsId = null;
            if (msg.args[0] && self.numberRegExp.test(msg.args[0]))
                newsId = parseInt(msg.args[0]) - 1;
            else if (msg.args[1] && self.numberRegExp.test(msg.args[1]))
                newsId = parseInt(msg.args[1]) - 1;

            client.api.get("/news").then(function(news)
            {
                // create a new Browser, default to 'en-us'
                resolve(new NewsBrowser(msg, news[lang || "en-us"], newsId));
            }).catch(reject);
        });
    }
}

module.exports = news;

