class Command
{
	constructor(client, meta)
	{
		this.client = client;

		this.name = meta.name;
		this.alias = meta.alias;
		this.description = meta.description;
		this.permission = meta.permission;
	}
}

module.exports = Command;
