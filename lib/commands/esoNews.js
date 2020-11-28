const Command = require("../classes/DiscordCommand.js")
	, Browser = require("../classes/MessageBrowser.js");

const ESO_NEWS_URL = {
		"en-us": "https://www.elderscrollsonline.com/en-us/news",
		"de": "https://www.elderscrollsonline.com/de/news",
		"fr": "https://www.elderscrollsonline.com/fr/news"
	}
	, ESO_NEWS_ICON = "http://i.imgur.com/qqvt2UX.png";

class news extends Command
{
	constructor(client)
	{
		super(client, {
			name: "news",
			alias: [ "news" ],
			description: "Display and choose from the latest news in the ESO Universe.",
			permission: 100,
		});

		this.languageRegExp = /^(?:(en)(?:(?:glish)|-(?:us|uk))?|(de)(?:utsch)?|(fr)(?:(?:ench)|(?:an(?:ç|c)ais))?|(ger)(?:man)?)$/i;
		this.numberRegExp = /^[1-5]$/;
	}

	async run(msg)
	{
		let lang = "en-us";
		if (msg.args[0] && this.languageRegExp.test(msg.args[0]))
			lang = msg.args[0].match(this.languageRegExp).filter(m => !(!m))[1].toLowerCase();

		if ([ "en", "en-us", "en-uk" ].includes(lang))
			lang = "en-us";
		else if (lang === "ger")
			lang = "de";

		let newsId = null;
		if (msg.args[0] && this.numberRegExp.test(msg.args[0]))
			newsId = parseInt(msg.args[0]) - 1;
		else if (msg.args[1] && this.numberRegExp.test(msg.args[1]))
			newsId = parseInt(msg.args[1]) - 1;

		const db = this.client.db
			, table = await db.models.NewsTable.findByPk(lang, { include: db.models.NewsArticle })
			, items = table.NewsArticles.map(a => ({
				name: a.title,
				description: a.url,
				content: a.url
			}));

		if (!items || (items && !items.length))
			return "Couldn't retrieve News at this time. Try again later!";

		if (newsId && (newsId >= 0 && newsId < items.length))
			return table.NewsArticles[newsId].url;

		new Browser(msg.channel, items);
	}
}

module.exports = news;
