const GenericDataManager = require(join(__libdir, "classes", "database", "GenericDataManager.js"))
	, Guild = require(join(__libdir, "classes", "database", "models", "Guild.js"));

class GuildsManager extends GenericDataManager
{
	/**
	 * @param {Firebase} db
	 * @param {GenericDataManagerConfig} config
	 */
	constructor(db)
	{
		super(db, {
			name: "guilds",
			path: "guilds",
			Model: Guild,
			onValue: {
				onlyOnce: true
			}
		});
	}
}

module.exports = GuildsManager;
