const fs = require("fs-extra");

class Event
{
	_installMiddleware()
	{
		return new Promise((resolve, reject) =>
		{
			const middlewareDirectory = join(__clientdir, "events", "middleware", this.name);
			fs.readdir(middlewareDirectory, (err, files = []) =>
			{
				if (err && err.code !== "ENOENT")
					return reject(err);

				for (const file of files)
					this.middleware.push(require(join(middlewareDirectory, file)));

				resolve(this.middleware);
			});
		});
	}

	constructor(client, eventName)
	{
		this.ready = false;
		this.on = "on";

		this.client = client;
		this.name = eventName;

		this.middleware = [];
		this._installMiddleware()
			.catch(console.error)
			.finally(() =>
			{
				this.ready = true;
			});
	}

	trigger(...args)
	{
		if (!this.ready)
			return;

		for (const middle of this.middleware)
			middle(...args);
	}
}

module.exports = Event;
