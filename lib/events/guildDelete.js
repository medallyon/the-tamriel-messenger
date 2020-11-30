const Event = require(join(__clientdir, "classes", "DiscordEvent.js"));

class GuildDelete extends Event
{
	constructor(client)
	{
		super(client, "guildDelete");
		this.db = this.client.db;
	}

	async trigger(guild)
	{
		super.trigger(guild);
		console.log(`\nLeft guild { ${guild.name} }.`);

		const dbGuild = await this.db.models.Guild.findByPk(guild.id);
		if (!dbGuild)
			return;

		await dbGuild.destroy();
	}
}

module.exports = GuildDelete;
