const path = require("path")
    , request = require("request")
    , cheerio = require("cheerio")
    , fs = require("fs-extra")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"));

const STORED_NEWS_PATH = `${client.Client.__paths.persistence}/modules/fetchLatestNews/latest.json`
    , ESO_NEWS_URL = "http://files.elderscrollsonline.com/rss/en-us/eso-rss.xml";

class fetchLatestNews extends Command
{
    constructor()
    {
        super({
            name: "fetchLatestNews",
            system: true
        });
    }

    run(msg)
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            request(ESO_NEWS_URL, function(err, res, body)
            {
                if (err)
                    return reject(err);

                let latest = fs.readJsonSync(STORED_NEWS_PATH);
                const $ = cheerio.load(body, { xmlMode: true });
                const $newest = $(" item ");

                let matches = $newest.toArray().slice(0, 5).reverse();
                matches = matches.filter(m => !latest.map(l => l.url).includes($(m).find(" link ").text().trim()));

                for (const m of matches)
                {
                    if (latest.length > 5)
                        latest.pop();

                    latest.unshift(self.curateArticle($(m)));
                    client.emit("esoNews", latest[0]);
                }

                if (latest.length > 5)
                    latest = latest.slice(0, 5);

                fs.outputJson(STORED_NEWS_PATH, latest).catch(reject);
            });
        });
    }

    curateArticle($m)
    {
        return {
            title: $m.find(" title ").text().trim(),
            summary: $m.find(" description ").text().trim(),
            url: $m.find(" link ").text().trim()
        };
    }
}

module.exports = fetchLatestNews;
