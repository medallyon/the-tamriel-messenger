const fs = require("fs-extra");

class DiscordEvent
{
	_installMiddleware()
	{
		const path = join(__libdir, "events", "middleware", this.name);

		let files = [];
		try
		{
			files = fs.readdirSync(path);
		}

		catch (err)
		{
			if (err.code === "ENOENT")
				return;
			console.error(err);
		}

		for (const file of files)
			this.middleware.push(new (require(join(path, file)))(this.client));
	}

	constructor(client, eventName)
	{
		this.ready = false;
		this.on = "on";

		this.client = client;
		this.name = eventName;

		this.middleware = [];
		this._installMiddleware();
	}

	trigger(...args)
	{
		for (const middle of this.middleware)
		{
			try
			{
				middle.trigger(...args);
			}

			catch (err)
			{
				console.warn(err);
			}
		}
	}
}

module.exports = DiscordEvent;
