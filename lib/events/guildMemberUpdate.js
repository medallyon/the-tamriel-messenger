const DiscordEvent = require(join(__libdir, "classes", "DiscordEvent.js"));

class GuildMemberUpdate extends DiscordEvent
{
	constructor(client)
	{
		super(client, "guildMemberUpdate");
	}

	trigger(oldMember, newMember)
	{
		super.trigger(oldMember, newMember);
	}
}

module.exports = GuildMemberUpdate;
