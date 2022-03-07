const promiseRetry = require("promise-retry");

function guildInitialization(guild)
{
	const config = {
		id: guild.id,
		subscriptions: []
	};

	/**
	 * @type {GuildManager}
	 */
	const db = this.data.guilds;

	return promiseRetry((retry) =>
	{
		return db.update(config)
			.catch(retry);
	}).catch(console.error);
}

module.exports = guildInitialization;
