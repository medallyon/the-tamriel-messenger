const join = require("path").join
	, fs = require("fs");

class Events
{
	constructor(client)
	{
		const files = fs.readdirSync(__dirname);

		for (const file of files)
		{
			if (file === "index.js" || !file.toLowerCase().endsWith(".js"))
				continue;

			const filePath = join(__dirname, file);
			this[file.replace(".js", "")] = new (require(filePath))(client);
		}

		for (const event in this)
			client[this[event].on](event, this[event].trigger.bind(this[event]));
	}
}

module.exports = Events;
