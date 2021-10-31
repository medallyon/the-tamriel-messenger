const EventMiddleware = require(join(__libdir, "classes", "EventMiddleware.js"));

class CommandProcess extends EventMiddleware
{
	constructor(client)
	{
		super(client);
	}

	trigger(interaction)
	{
		if (interaction.isCommand())
		{
			for (const cmd in this.client.commands)
			{
				if (interaction.commandName !== cmd.toLowerCase())
					continue;

				this.client.commands[cmd].run(interaction);
			}
		}
	}
}

module.exports = CommandProcess;
