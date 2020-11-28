const Command = require("../classes/DiscordCommand.js")
	, { DefaultEmbed } = require("../utils");

class Help extends Command
{
	static hasPermissionForCommand(user, command, client)
	{
		const userPerm = client.utils.determinePermissions(user);
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

	run(msg)
	{
		const userCmd = msg.args.join("").toLowerCase()
			, permFilter = (msg.args.length &&
				Number.isInteger(msg.args[0] % 1) &&
				this.client.utils.userIsDeveloper(msg.author)) ? parseInt(msg.args[0]) : null
			, embed = new DefaultEmbed()
				.setAuthor("Command Overview", msg.guild ? msg.guild.iconURL({ dynamic: true }) : msg.author.displayAvatarURL({ dynamic: true }))
				.setDescription("TTM is back! The bot is slowly being rewritten and more functionality will roll out as time goes on. Make sure to check back regularly!\n\nThis panel shows some basic help about the commands that are available to you.");

		for (const command of Object.values(this.client.commands))
		{
			if (permFilter && command.permission > permFilter)
				continue;

			if (!Help.hasPermissionForCommand(msg.member || msg.author, command, this.client) || command.system)
				continue;

			if (command.alias.some(a => a === userCmd))
				return command.embed;

			embed.addField(`${this.client.prefix}${command.name}`, `*${command.description}*`, true);
		}

		return embed;
	}
}

module.exports = Help;
