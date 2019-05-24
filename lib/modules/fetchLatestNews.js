const path = require("path")
    , fs = require("fs-extra")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"));

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
        return new Promise(function(resolve, reject)
        {
            client.api.get("/news/en").then(function(news)
            {
                const latestPath = path.join(process.cwd(), "persistence", "modules", "fetchLatestNews", "latest.json");
                fs.readJson(latestPath).then(function(latest)
                {
                    if (news[0].url === latest.url)
                        return;

                    latest = news[0];
                    client.emit("news", latest);

                    fs.outputJson(latestPath)
                        .catch(console.error)
                        .finally(resolve);
                });
            }).catch(reject);
        });
    }
}

module.exports = fetchLatestNews;
