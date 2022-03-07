const promiseRetry = require("promise-retry");

function guildDeletion(guild)
{
	/**
	 * @type {GuildManager}
	 */
	const db = this.data.guilds;

	return promiseRetry((retry) =>
	{
		return db.delete(guild.id)
			.catch(retry);
	}).catch(console.error);
}

module.exports = guildDeletion;
