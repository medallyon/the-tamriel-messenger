const fs = require("fs")
	, path = require("path");

class CronManager extends Map
{
	constructor(client)
	{
		super();

		this.client = client;

		let jobFiles = fs.readdirSync(path.join(__dirname, "jobs"));
		for (const file of jobFiles)
			this.set(file.replace(".js", ""), new (require(path.join(__dirname, "jobs", file)))(this));
	}
}

module.exports = CronManager;
