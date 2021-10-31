const { Client, Intents } = require("discord.js")
	, Firebase = require(join(__dirname, "database", "Firebase.js"))
	, CronManager = require(join("..", "cron", "Manager.js"))
	, InteractionManager = require(join(__dirname, "InteractionManager.js"));

const DEFAULT_PREFIX = "/";

/**
 * @class DiscordClient
 * @extends Client
 */
class DiscordClient extends Client
{
	get prefix()
	{
		return process.env.BOT_PREFIX || DEFAULT_PREFIX;
	}

	/**
	 * @param {ClientOptions} options
	 */
	constructor(options)
	{
		super(Object.assign({
			intents: new Intents()
				.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS)
		}, options));

		/**
		 * @type {Firebase}
		 */
		this.data = new Firebase(this, require(join(__basedir, "firebase.config.json")));

		this.utils = require("../utils");
		this.commands = new (require("../commands"))(this);
		this.events = new (require("../events"))(this);

		this.crons = new CronManager(this);
		this.interactions = new InteractionManager(this);
	}
}

module.exports = DiscordClient;
