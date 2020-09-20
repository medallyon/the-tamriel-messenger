const Command = require("../classes/Command.js")
	, { DefaultEmbed } = require("../utils");

class Help extends Command
{
	static hasPermissionForCommand(member, command, client)
	{
		const userPerm = client.utils.determinePermissions(member);
		return (userPerm >= command.permission);
	}

	constructor(client)
	{
		super(client, {
			name: "help",
			alias: [ "help" ],
			description: "Displays a help panel.",
			permission: 100,
		});
	}

	buildEmbed(msg)
	{
		const embed = new DefaultEmbed()
			.setAuthor("Command Overview", this.client.user.displayAvatarURL())
			.setDescription("TTM is back! We're slowly rewriting the bot and more functionality will roll out as time goes on. Make sure to check back regularly!\n\nThis panel shows some basic help about the commands that are available to you.");

		for (const command of Object.values(this.client.commands))
		{
			if (Help.hasPermissionForCommand(msg.member, command, this.client))
				embed.addField(`${this.client.prefix}${command.name}`, `*${command.description}*`, true);
		}

		return embed;
	}

	run(msg)
	{
		return Promise.resolve(this.buildEmbed(msg));
	}
}

module.exports = Help;
