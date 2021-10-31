const EventMiddleware = require(join(__libdir, "classes", "EventMiddleware.js"))
	, { DefaultEmbed } = require(join(__libdir, "utils"));

const ESOI_GUILD_ID = "130716876937494528"
	, ESOI_BOOSTER_ROLE_ID = "585864196785176588"
	, ESOI_LOG_CHANNEL_ID = "717755343622504468";

class ESOIBoosterHandler extends EventMiddleware
{
	constructor(client)
	{
		super(client);
	}

	trigger(oldMember, newMember)
	{
		const guild = newMember.guild;
		if (guild.id !== ESOI_GUILD_ID)
			return;

		// Member already has Nitro Booster or Member attained a different role
		if (oldMember.roles.cache.has(ESOI_BOOSTER_ROLE_ID) || (!oldMember.roles.cache.has(ESOI_BOOSTER_ROLE_ID) && !newMember.roles.cache.has(ESOI_BOOSTER_ROLE_ID)))
			return;

		// get #log
		const logChannel = guild.channels.cache.get(ESOI_LOG_CHANNEL_ID);
		logChannel.send(new DefaultEmbed()
			.setColor("#da9adf")
			.setAuthor("A new Booster hath graced us!", newMember.user.displayAvatarURL())
			.setDescription(`<:torchbug:756923561632989245> ${newMember.toString()} just boosted the server!`)
		).catch(console.error);
	}
}

module.exports = ESOIBoosterHandler;
