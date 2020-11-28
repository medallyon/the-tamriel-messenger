const Discord = require("discord.js")
	, Event = require(join(__clientdir, "classes", "DiscordEvent.js"));

class Message extends Event
{
	static siphonCommand(msg, client)
	{
		const split = msg.content.split(" ");
		if (!split.length)
			return null;

		let commandName = split[0].startsWith(client.prefix) && split[0].slice(client.prefix.length).toLowerCase();
		if (msg.mentions.users.size
			&& msg.mentions.users.has(client.user.id)
			&& split[0].includes(client.user.id)
			&& split.length > 1)
			commandName = split[1].toLowerCase();

		else if (!commandName)
			commandName = !msg.guild && !split[0].startsWith(client.prefix) && split[0].toLowerCase();

		for (const c in client.commands)
		{
			const command = client.commands[c];
			if (command.alias.includes(commandName))
			{
				msg.commandName = commandName.toLowerCase();
				msg.command = command;

				msg.args = split.slice(1);
				return command;
			}
		}

		return null;
	}

	static hasPermissionForCommand(member, command, client)
	{
		const userPerm = client.utils.determinePermissions(member);
		return (userPerm >= command.permission);
	}

	constructor(client)
	{
		super(client, "message");
	}

	trigger(msg)
	{
		super.trigger(msg);

		const time = msg.createdAt.toUTCString()
			, content = `${msg.bot ? "[BOT] " : ""}${msg.author.tag}: "${msg.content.length ? msg.cleanContent : (msg.attachments.size ? "[IMAGE]" : "[EMBED]")}"`
			, location = `${"#" + (msg.channel.name || msg.channel.recipient.id)}${msg.guild ? (` - {${msg.guild.name}}`) : ""}`;

		console.log(`\n${time}\n${content}\n${location}`);

		Message.siphonCommand(msg, this.client);
		if (!msg.command)
			return;

		if (!Message.hasPermissionForCommand(msg.member || msg.author, msg.command, this.client))
			return;

		let result = msg.command.run(msg);
		if (result instanceof Promise)
		{
			result
				.then(function(data)
				{
					if (data instanceof Discord.MessageEmbed || typeof data === "string")
						msg.channel.send(data)
							.catch(console.error);
				})
				.catch(function(error)
				{
					console.error(error);
					msg.channel.send(error)
						.catch(console.error);
				});
		}

		else if (result instanceof Discord.MessageEmbed || typeof result === "string")
			msg.channel.send(result)
				.catch(console.error);

		else if (result instanceof Error)
			msg.channel.send(new Discord.MessagEmbed()
				.setColor([ 255, 0, 0 ])
				.setAuthor("Error")
				.setDescription(result.message)
				.setTimestamp(new Date())
			).catch(console.error);
	}
}

module.exports = Message;
