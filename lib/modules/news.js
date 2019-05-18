const fs = require("fs-extra")
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"));

const STORED_NEWS_PATH = `${client.Client.__paths.persistence}/modules/fetchLatestNews/latest.json`
    , ESO_NEWS_URL = "https://www.elderscrollsonline.com/en-us/news";

class news extends Command
{
    constructor()
    {
        super({
            name: "news",
            description: "Display and choose from the latest news stories in the ESO universe.",
            alias: [ "news" ],
            usage: "[ 1-5 ]",
            permissions: 100
        });
    }

    run(msg)
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            fs.readJson(STORED_NEWS_PATH).then(function(articles)
            {
                if (!articles.length)
                    return resolve("There are currently no News Articles to display. Come back later!");

                if (articles.length === 1)
                    return resolve(self.createEmbedFromArticle(articles[0]));

                let fields = articles.map(a => ({
                    name: a.title,
                    value: `[Read this article online](${a.url}) | ${ (self.daysAgo(new Date(a.timestamp)) > 0) ? self.daysAgo(new Date(a.timestamp)) + " day" + ((self.daysAgo(new Date(a.timestamp)) > 1) ? "s" : "") + " ago" : "Today" }`
                }));
                let previewEmbed = new client.utils.Embed()
                    .setAuthor("ESO News", "https://elderscrollsonline.wiki.fextralife.com/file/Elder-Scrolls-Online/quest_book_001.png", ESO_NEWS_URL)
                    .setDescription("Here are the most recent ESO News Articles:");

                client.utils.createSelectorEmbed(msg, fields, previewEmbed).then(function([selectedNumber, collectorMessage])
                {
                    collectorMessage.edit(self.createEmbedFromArticle(articles[selectedNumber - 1])).then(resolve).catch(reject);
                }).catch(reject);
            });
        });
    }

    createEmbedFromArticle(article)
    {
        let embed = new client.utils.Embed()
            .setAuthor("ESO News", "https://elderscrollsonline.wiki.fextralife.com/file/Elder-Scrolls-Online/quest_book_001.png", ESO_NEWS_URL)
            .setTitle(article.title)
            .setURL(article.url)
            .setDescription(article.summary)
            .setImage(article.imageUrl)
            .setTimestamp(new Date(article.timestamp));

        if (article.relevantTitles.length)
            embed.addField("Article Contents", "***" + article.relevantTitles.join("***, ***") + "***");

        return embed;
    }

    daysAgo(date)
    {
        return Math.round(((new Date()) - date) / (1000 * 60 * 60 * 24));
    }
}

module.exports = news;
