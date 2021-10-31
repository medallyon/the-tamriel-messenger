const DiscordEvent = require(join(__libdir, "classes", "DiscordEvent.js"));

class GuildCreate extends DiscordEvent
{
	constructor(client)
	{
		super(client, "guildCreate");
	}

	trigger(guild)
	{
		super.trigger(guild);
	}
}

module.exports = GuildCreate;
