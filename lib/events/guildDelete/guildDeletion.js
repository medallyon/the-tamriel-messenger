const promiseRetry = require("promise-retry");

function guildDeletion(guild)
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

module.exports = guildDeletion;
