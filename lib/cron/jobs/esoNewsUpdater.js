const CronJob = require("cron").CronJob
	, request = require("request")
	, cheerio = require("cheerio")
	, NewsArticle = require(join(__libdir, "classes", "database", "models", "NewsArticle.js"));

class ESONewsUpdater
{
	static get ESO_NEWS_URL_PREFIX() { return "http://files.elderscrollsonline.com/rss/"; }
	static get ESO_NEWS_URL_SUFFIX() { return "/eso-rss.xml"; }

	get languages()
	{
		return this.manager.client.data.news.languages.map(x => x.config.name);
	}

	constructor(manager)
	{
		this.manager = manager;
		this.cron = new CronJob({
			// run every 15 mins
			cronTime: "0 */15 * * * *",
			onTick: this.job,
			context: this,
			runOnInit: false,
			start: true
		});
	}

	_curateArticle(language, $a)
	{
		return new NewsArticle({
			title: $a.find(" title ").text().trim().replace(/&amp;/g, "&").replace(/—/g, " — "),
			link: $a.find(" link ").text().trim(),
			description: $a.find(" description ").text().trim().replace(/&amp;/g, "&"),
			date: new Date($a.find(" pubDate ").text().trim()),
			language
		});
	}

	job()
	{
		for (const language of this.languages)
		{
			request(ESONewsUpdater.ESO_NEWS_URL_PREFIX + language + ESONewsUpdater.ESO_NEWS_URL_SUFFIX, (err, res, body) =>
			{
				if (err)
					return console.error(err);

				try
				{
					const newsManager = this.manager.client.data.news[language]
						, $ = cheerio.load(body, { xmlMode: true })
						, newest = $(" item ").toArray()
							.slice(0, 5)
							.map(x => this._curateArticle(language, $(x)));

					// what's not in our cache yet?
					const allNew = newest.filter(x => !newsManager.cache.has(x.id));
					if (!allNew.length)
						return;

					// discard any articles that are older than other existing articles
					let actuallyNew = [];
					for (const article of newest.sort((a, b) => b.date - a.date))
					{
						if (!allNew.some(x => x.id === article.id))
							break;

						actuallyNew.push(article);
					}

					newsManager.update(...actuallyNew)
						.catch(console.error);
				}

				catch (err)
				{
					console.error(err);
				}
			});
		}
	}
}

module.exports = ESONewsUpdater;
