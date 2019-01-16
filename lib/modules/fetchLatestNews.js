const puppeteer = require("puppeteer")
    , cheerio = require("cheerio")
    , fs = require("fs-extra")
    , client = require("../../client");

const STORED_NEWS_PATH = `${client.Client.__paths.persistence}/modules/fetchLatestNews/latest.json`
    , ESO_DOMAIN = "https://www.elderscrollsonline.com"
    , ESO_NEWS_URL = "https://www.elderscrollsonline.com/en-us/news"
    , ESO_AGEGATE_URL = "https://www.elderscrollsonline.com/en-us/agegate";

function createEmbedFromArticle(article)
{
    let embed = new client.utils.Embed()
        .setAuthor("ESO News", "https://elderscrollsonline.wiki.fextralife.com/file/Elder-Scrolls-Online/quest_book_001.png", ESO_NEWS_URL)
        .setTitle(article.title)
        .setURL(article.url)
        .setDescription(article.summary)
        .setImage(article.imageUrl)
        .setTimestamp(article.timestamp);

    if (article.relevantTitles.length)
        embed.addField("Article Contents", "***" + article.relevantTitles.join("***, ***") + "***");

    return embed;
}

function distributeArticle(article)
{
    let articleEmbed = createEmbedFromArticle(article);
    for (const guild of client.guilds.values())
    {
        const newsSettings = (guild.config.server && guild.config.server.news) || { enabled: false };
        if (!newsSettings.enabled)
            continue;

        if (!newsSettings.channel)
            continue;

        const channel = guild.channels.get(newsSettings.channel);
        if (channel)
            channel.send(articleEmbed).catch(console.error);
    }
}

function curateArticleInfo($)
{
    let relevantTitles = [];
    for (const title of $(" div#blog-body ").find(" h2 ").toArray())
        relevantTitles.push($(title).text().trim());

    return {
        title: $(" h1 ").first().text().trim(),
        summary: $(" .text_block ").find(" p > i ").first().text().trim(),
        imageUrl: $(" img.lead-img ").attr("src"),
        timestamp: new Date($(" span.date ").text().trim()),
        url: $(" link[rel='alternate'][hreflang='en'] ").attr("href"),
        relevantTitles
    };
}

async function bypassAgegate(page, targetUrl = null)
{
    await page.waitForSelector(" input#month ");

    await page.type(" input#month ", "1");
    await page.type(" input#day ", "1");
    await page.type(" input#year ", "1990");
    await page.click(" button[type='submit'] ");

    await page.waitForNavigation();
    if (targetUrl && (typeof targetUrl) === "string")
        await page.goto(targetUrl);
}

async function fetchLatestNews()
{
    puppeteer.launch().then(function(browser)
    {
        browser.newPage().then(async function(page)
        {
            await page.goto(ESO_NEWS_URL);
            if (page.url().toLowerCase() === ESO_AGEGATE_URL.toLowerCase())
            {
                try
                {
                    await bypassAgegate(page, ESO_NEWS_URL);
                } catch (err)
                {
                    return console.error(err);
                }
            }

            const body = await page.content();
            let latest = fs.readJsonSync(STORED_NEWS_PATH);

            const $ = cheerio.load(body);
            const $newest = $(" .tier-2-list-item ");
            let matches = $newest.toArray().slice(0, 5).reverse();
            matches = matches.filter(m => !latest.map(l => l.title).includes($(m).find(" h3 ").text().trim()));

            for (const m of matches)
            {
                if (latest.length > 5)
                    latest.pop();

                await page.goto(ESO_DOMAIN + $(m).find(" a ").attr("href"));
                latest.unshift(curateArticleInfo(cheerio.load(await page.content())));

                distributeArticle(latest[0]);
            }

            fs.outputJson(STORED_NEWS_PATH, latest).catch(console.error);
            browser.close().catch(console.error);
        }).catch(console.error);
    }).catch(console.error);
}

fetchLatestNews.meta = {
    name: "fetchLatestNews",
    system: true
};

module.exports = fetchLatestNews;
