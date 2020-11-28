const Event = require(join(__clientdir, "classes", "DiscordEvent.js"));

class Ready extends Event
{
	constructor(client)
	{
		super(client, "ready");
		this.on = "once";
	}

	trigger()
	{
		super.trigger();

		console.log(`Logged in as ${this.client.user.username} and serving approx. ${this.client.users.cache.size} users.`);

		// run `randomStatus` cron once client is ready
		// this.crons.get("randomStatus").job();
	}
}

module.exports = Ready;
