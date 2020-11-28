const Event = require(join(__clientdir, "classes", "DiscordEvent.js"));

class News extends Event
{
	constructor(client)
	{
		super(client, "ttm-news");
	}

	async trigger(language, article)
	{
		super.trigger(language, article);
		console.log(`\ntriggered 'ttm-news' for ${language}`);
	}
}

module.exports = News;
