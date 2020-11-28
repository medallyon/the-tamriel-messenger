const Discord = require("discord.js")
	, Database = require("./database/Database.js")
	, CronManager = require("../cron/Manager.js");

const DEFAULT_PREFIX = "/";

class Client extends Discord.Client
{
	get prefix()
	{
		return process.env.BOT_PREFIX || DEFAULT_PREFIX;
	}

	constructor(options)
	{
		super(options);

		this.db = new Database(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASS);

		this.utils = require("../utils");
		this.commands = new (require("../commands"))(this);
		this.events = new (require("../events"))(this);

		this.crons = new CronManager(this);
	}
}

module.exports = Client;
