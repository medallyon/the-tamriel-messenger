const join = require("path").join
	, fs = require("fs");

class Commands
{
	constructor(client)
	{
		const files = fs.readdirSync(__dirname);

		for (const file of files)
		{
			if (file === "index.js")
				continue;

			const filePath = join(__dirname, file);
			this[file.replace(".js", "")] = new (require(filePath))(client);
		}
	}
}

module.exports = Commands;
