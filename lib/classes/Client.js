const Discord = require("discord.js")
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

		this.utils = require("../utils");
		this.commands = new (require("../commands"))(this);
		this.events = new (require("../events"))(this);

		this.crons = new CronManager(this);
	}
}

module.exports = Client;
