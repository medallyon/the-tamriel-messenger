const Event = require(join(__clientdir, "classes", "DiscordEvent.js"));

class GuildCreate extends Event
{
	constructor(client)
	{
		super(client, "guildCreate");
	}

	static create(db, guild)
	{
		const defaults = require(join(__clientdir, "classes", "database", "defaults")).guild;
		return db.models.Guild.create(defaults(guild));
	}

	async trigger(guild)
	{
		super.trigger(guild);
		console.log(`\nJoined guild { ${guild.name} }.`);

		GuildCreate.create(this.client.db, guild).catch(console.error);
	}
}

module.exports = GuildCreate;
