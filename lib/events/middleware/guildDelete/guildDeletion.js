const promiseRetry = require("promise-retry")
	, EventMiddleware = require(join(__libdir, "classes", "EventMiddleware.js"));

class GuildDeletion extends EventMiddleware
{
	constructor(client)
	{
		super(client);
	}

	trigger(guild)
	{
		/**
		 * @type {GuildManager}
		 */
		const db = this.client.data.guilds;

		return promiseRetry((retry) =>
		{
			return db.delete(guild.id)
				.catch(retry);
		}).catch(console.error);
	}
}

module.exports = GuildDeletion;
