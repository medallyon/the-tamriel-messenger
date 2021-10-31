const DiscordEvent = require(join(__libdir, "classes", "DiscordEvent.js"));

class GuildDelete extends DiscordEvent
{
	constructor(client)
	{
		super(client, "guildDelete");
	}

	trigger(guild)
	{
		super.trigger(guild);
	}
}

module.exports = GuildDelete;
