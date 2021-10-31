const { Constants } = require("discord.js")
	, promiseRetry = require("promise-retry")
	, EventMiddleware = require(join(__libdir, "classes", "EventMiddleware.js"));

class GuildInitialization extends EventMiddleware
{
	constructor(client)
	{
		super(client);
	}

	defaultConfig(guild)
	{
		return {
			id: guild.id,
			subscriptions: []
		};
	}

	trigger(guild)
	{
		const config = this.defaultConfig(guild);

		/**
		 * @type {GuildManager}
		 */
		const db = this.client.data.guilds;

		return promiseRetry((retry) =>
		{
			return db.update(config)
				.catch(retry);
		}).catch(console.error);
	}
}

module.exports = GuildInitialization;
