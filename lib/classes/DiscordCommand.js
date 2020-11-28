class Command
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

	constructor(client, meta)
	{
		this.client = client;

		this.system = meta.system;
		this.permission = meta.permission;
		this.name = meta.name;
		this.alias = meta.alias;
		this.description = meta.description;
		this.example = meta.example;
	}
}

module.exports = Command;
