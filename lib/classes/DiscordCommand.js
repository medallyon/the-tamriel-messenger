/**
 * @typedef {ApplicationCommandData} CommandMeta
 * @property {bool} system - Is this command module a system module? Users cannot execute system modules.
 * @property {number} permission - The permission level of this command.
 * @property {string} example - An example of how this command could be used, excluding the prefix & command name.
 */

class DiscordCommand
{
	get embed()
	{
		const embed = new this.client.utils.DefaultEmbed()
			.setAuthor(this.name)
			.setDescription(`${this.description}\n*Also known as: \`${this.alias.join("`, `")}\`*.`)
			.addField("Permission Value", this.permission);

		if (this.example)
			embed.addField("Example Usage", `\`${this.client.prefix}${this.name} ${this.example}\``);

		return embed;
	}

	/**
	 * @param {DiscordClient} client - The client
	 * @param {CommandMeta} meta - The meta
	 */
	constructor(client, meta)
	{
		/**
		 * @type {DiscordClient}
		 */
		this.client = client;
		this.meta = meta;

		/**
		 * @type {bool}
		 * Is this command module a system module? Users cannot execute system modules.
		 */
		this.system = meta.system;

		/**
		 * @deprecated
		 * @type {number}
		 * The permission level of this command.
		 */
		this.permission = meta.permission;

		/**
		 * @type {string}
		 * The name of this command.
		 */
		this.name = meta.name;

		/**
		 * @deprecated
		 * @type {string[]}
		 * A list of alias names for this command.
		 */
		this.alias = meta.alias;

		/**
		 * @type {string}
		 * A brief description of what this command does.
		 */
		this.description = meta.description;

		/**
		 * @type {string}
		 * An example of how this command could be used, excluding the prefix & command name.
		 */
		this.example = meta.example;
	}

	run(interaction)
	{
		throw new Error("NotImplementedError: DiscordCommand must implement a 'run' method.");
	}
}

module.exports = DiscordCommand;
