const EventMiddleware = require(join(__libdir, "classes", "EventMiddleware.js"))
	, { DefaultEmbed } = require(join(__libdir, "utils"));

const ESOI_GUILD_ID = "130716876937494528"
	, ESOI_GUARD_ROLE_ID = "598409804465045534"
	, ESOI_LOG_CHANNEL_ID = "717755343622504468";

class Olomir extends EventMiddleware
{
	constructor(client)
	{
		super(client);
	}

	trigger(msg)
	{
		const guild = msg.guild;
		if (guild?.id !== ESOI_GUILD_ID)
			return;

		if (msg.member?.roles.cache.has(ESOI_GUARD_ROLE_ID))
			return;

		if (!msg.content.toLowerCase().includes("olomir"))
			return;

		// get #log
		const logChannel = guild.channels.cache.get(ESOI_LOG_CHANNEL_ID);
		logChannel.send(new DefaultEmbed()
			.setColor("#faa81a")
			.setAuthor("Olomir Detected", msg.author.displayAvatarURL())
			.setDescription(msg.url)
		).catch(console.error);
	}
}

module.exports = Olomir;
