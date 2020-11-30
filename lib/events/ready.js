const Event = require(join(__clientdir, "classes", "DiscordEvent.js"))
	, GuildCreate = require("./guildCreate.js");

class Ready extends Event
{
	constructor(client)
	{
		super(client, "ready");
		this.on = "once";
	}

	// catch up on any missing data that may have been processed while offline
	async _catchUpDatabase()
	{
		// delete configs for every redundant guild
		const guildInstances = await this.client.db.models.Guild.findAll();
		for (const instance of guildInstances)
		{
			try
			{
				if (!this.client.guilds.cache.has(instance.id))
					await instance.destroy();
			}

			catch (err)
			{
				console.error(err);
				continue;
			}
		}

		// create config for every new guild
		for (const guild of this.client.guilds.cache.values())
		{
			try
			{
				if (!(await this.client.db.models.Guild.findByPk(guild.id)))
					GuildCreate.create(this.client.db, guild);
			}

			catch (err)
			{
				console.error(err);
				continue;
			}
		}
	}

	trigger()
	{
		super.trigger();

		console.log(`Logged in as ${this.client.user.username} and serving approx. ${this.client.users.cache.size} users.`);

		this._catchUpDatabase();

		// run `randomStatus` cron once client is ready
		// this.crons.get("randomStatus").job();
	}
}

module.exports = Ready;
