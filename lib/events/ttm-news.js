const Event = require(join(__clientdir, "classes", "DiscordEvent.js"))
	, { Op } = require("sequelize");

class News extends Event
{
	constructor(client)
	{
		super(client, "ttm-news");
		this.db = this.client.db;
	}

	async trigger(language, article)
	{
		super.trigger(language, article);
		console.log(`\ntriggered 'ttm-news' for ${language}`);

		this.db.models.Guild.findAll({
			where: {
				news: {
					[Op.and]: {
						enabled: true,
						language: language
					}
				}
			}
		})
			.then(subscribedGuilds =>
			{
				for (let guildInstance of subscribedGuilds)
				{
					this.client.channels.fetch(guildInstance.news.channel)
						.then(channel =>
						{
							channel.send(`${guildInstance.news.prefix || ""} ${article.url}`)
								.catch(console.error);
						}).catch(console.error);
				}
			}).catch(console.error);
	}
}

module.exports = News;
