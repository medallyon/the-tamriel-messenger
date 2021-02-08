const { GuildMember } = require("discord.js")
	, moment = require("moment")
	, Command = require("../classes/DiscordCommand.js");

moment.updateLocale("en", {
	calendar: {
		sameElse: "DD MMMM YYYY"
	}
});

class WhoIs extends Command
{
	constructor(client)
	{
		super(client, {
			name: "whois",
			alias: [ "whois", "who", "me", "user", "info" ],
			description: "Displays info about you or a mentioned user.",
			permission: 100,
		});
	}

	buildEmbed(member)
	{
		const color = {
				"online": "#43b581",
				"idle": "#faa61a",
				"dnd": "#f04747",
				"offline": "#747f8d"
			}[member.presence.status]
			, embed = new this.client.utils.DefaultEmbed()
				.setColor(color)
				.setAuthor(member.tag || member.user.tag, (member.user || member).displayAvatarURL({ dynamic: true }))
				.setImage((member.user || member).displayAvatarURL({
					dynamic: true,
					size: 512
				}));

		if (member instanceof GuildMember)
		{
			const roles = member.roles;
			embed.setDescription(`**${member.toString()}** has been part of this server since ${moment(member.joinedAt).format("MMMM YYYY")}.`)
				.addField("Highest Role", roles.highest.toString(), true);

			if (roles.color && roles.color !== roles.highest)
				embed.addField("Color Role", member.roles.color.toString(), true);

			embed.addField("# of Roles", member.roles.cache.size, true)
				.addField("Joined Date", moment(member.joinedAt).calendar(), true);
		}

		embed.addField("Creation Date", moment(member.createdAt || member.user.createdAt).calendar(), member instanceof GuildMember);

		return embed;
	}

	run(msg, target = null)
	{
		let user = target || (msg.guild ? (msg.mentions.users.size ? msg.guild.member(msg.mentions.users.first()) : msg.member) : msg.author);
		return this.buildEmbed(user);
	}
}

module.exports = WhoIs;
