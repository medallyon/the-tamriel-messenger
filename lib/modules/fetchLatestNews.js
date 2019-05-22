const path = require("path")
    , request = require("request")
    , cheerio = require("cheerio")
    , fs = require("fs-extra")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"));

const ESO_NEWS_URL = "http://files.elderscrollsonline.com/rss/en-us/eso-rss.xml";

class fetchLatestNews extends Command
{
    constructor()
    {
        super({
            name: "fetchLatestNews",
            system: true
        });
    }

    run()
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            request(ESO_NEWS_URL, async function(err, res, body)
            {
                if (err)
                    return reject(err);

                client.api.get("/news").then(function(latest)
                {
                    const $ = cheerio.load(body, { xmlMode: true });
                    const $newest = $(" item ");

                    let matches = $newest.toArray().slice(0, 5).reverse();
                    matches = matches.filter(m => !latest.map(l => l.url).includes($(m).find(" link ").text().trim()));

                    for (const m of matches)
                        client.emit("esoNews", self.getArticleURL($(m)));
                }).catch(reject);
            });
        });
    }

    getArticleURL($m)
    {
        return $m.find(" link ").text().trim();
    }
}

module.exports = fetchLatestNews;
