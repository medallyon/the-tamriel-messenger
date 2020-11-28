const moment = require("moment")
	, Command = require("../classes/DiscordCommand.js")
	, { DefaultEmbed, generateRandomColor } = require("../utils");

class Me extends Command
{
	constructor(client)
	{
		super(client, {
			name: "me",
			alias: [ "me", "who", "user", "info" ],
			description: "Displays info about you or a mentioned user.",
			permission: 100,
		});
	}

	buildEmbed(member)
	{
		const avatarURL = (member.user || member).displayAvatarURL()
			, color = member.displayColor || generateRandomColor();
		const embed = new DefaultEmbed()
			.setColor(color)
			.setAuthor(member.tag || member.user.tag, avatarURL)
			.setImage(avatarURL);

		if (member.nickname)
			embed.addField("Nickname", member.nickname, true);

		if (member.guild)
			embed.setDescription(`**${member.user.username}** has been part of this server since ${moment(member.joinedAt).format("MMMM YYYY")}.`)
				.addField("# of Roles", member.roles.cache.size - 1, true)
				.addField("Highest Role", member.roles.highest.toString(), true)
				.addField("Joined Date", member.joinedAt.toUTCString());

		embed.addField("Creation Date", (member.createdAt || member.user.createdAt).toUTCString());

		return embed;
	}

	run(msg)
	{
		let user = msg.guild ? msg.member : (msg.mentions.users.size ? msg.guild.member(msg.mentions.users.first()) : msg.author);
		return Promise.resolve(this.buildEmbed(user));
	}
}

module.exports = Me;
