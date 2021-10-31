const join = require("path").join
	, fs = require("fs");

class Managers
{
	/**
	 * @param {Firebase} db
	 */
	constructor(db)
	{
		const files = fs.readdirSync(__dirname)
			.filter(x => x.toLowerCase().endsWith(".js") && x !== "index.js");

		for (const file of files)
		{
			const filePath = join(__dirname, file)
				, manager = new (require(filePath))(db);

			this[manager.config.name || file.replace(".js", "")] = manager;
		}
	}
}

module.exports = Managers;
