const { REST } = require("@discordjs/rest")
	, { Routes } = require("discord-api-types/v9");

class InteractionManager
{
	/**
	 * @param {DiscordClient} client
	 */
	constructor(client)
	{
		this.client = client;
		this.rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

		this._installGlobalCommands();
	}

	_installGlobalCommands()
	{
		this.data = [];
		for (const cmd of Object.values(this.client.commands))
		{
			if (!cmd.meta.disableCommandUpdate)
				this.data.push(cmd.meta);
		}

		this.rest.put(Routes.applicationCommands(process.env.BOT_CMD_APP_ID), { body: this.data })
			.catch(console.error);
	}
}

module.exports = InteractionManager;
