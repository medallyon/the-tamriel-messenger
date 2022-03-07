const { Client, Intents } = require("discord.js")
	, Firebase = require(join(__dirname, "database", "Firebase.js"))
	, CronManager = require(join("..", "cron", "Manager.js"));

/**
 * @class DiscordClient
 * @extends Client
 */
class DiscordClient extends Client
{
	/**
	 * @param {ClientOptions} options
	 */
	constructor(options)
	{
		super(Object.assign({
			intents: [ Intents.FLAGS.GUILDS ]
		}, options));

		/**
		 * @type {Firebase}
		 */
		this.data = new Firebase(this, require(join(__basedir, "firebase.config.json")));

		this.utils = require("../utils");
		this.commands = new (require("../commands"))(this);
		this.events = new (require("../events"))(this);

		this.crons = new CronManager(this);
	}
}

module.exports = DiscordClient;
