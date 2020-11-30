const CronJob = require("cron").CronJob
	, request = require("request")
	, cheerio = require("cheerio");

class FetchLatestEsoNews
{
	constructor(manager)
	{
		this.manager = manager;
		this.cron = new CronJob({
			// run every 5 mins
			cronTime: "0 */5 * * * *",
			onTick: this.job,
			context: this,
			runOnInit: false,
			start: true
		});

		this.ESO_NEWS_URL_PREFIX = "http://files.elderscrollsonline.com/rss/";
		this.ESO_NEWS_URL_SUFFIX = "/eso-rss.xml";
		this.LANGUAGES = [ "en-us", "de", "fr" ];
	}

	_curateArticle($a)
	{
		return {
			title: $a.find(" title ").text().trim().replace(/&amp;/g, "&").replace(/—/g, " — "),
			url: $a.find(" link ").text().trim(),
			description: $a.find(" description ").text().trim().replace(/&amp;/g, "&"),
			date: new Date($a.find(" pubDate ").text().trim())
		};
	}

	job()
	{
		for (const lang of this.LANGUAGES)
		{
			request(this.ESO_NEWS_URL_PREFIX + lang + this.ESO_NEWS_URL_SUFFIX, async (err, res, body) =>
			{
				if (err)
					return console.error(err);

				try
				{
					const $ = cheerio.load(body, { xmlMode: true })
						, $newest = $(" item ").toArray().slice(0, 5).reverse();

					const db = this.manager.client.db
						, table = await db.models.NewsTable.findByPk(lang, { include: db.models.NewsArticle })
						, latestArticles = table.NewsArticles
						, matches = $newest.filter(m => !latestArticles.map(l => l.url).includes($(m).find(" link ").text().trim()));

					// emit event with any new articles for this language
					for (const m of matches)
						this.manager.client.emit("ttm-news", lang, this._curateArticle($(m)));

					// overwrite table with new articles
					for (const article of table.NewsArticles)
						await article.destroy();
					for (const item of $newest.reverse())
						await table.createNewsArticle(this._curateArticle($(item)));
				}

				catch (err)
				{
					console.error(err);
				}
			});
		}
	}
}

module.exports = FetchLatestEsoNews;
