const DiscordEvent = require(join(__libdir, "classes", "DiscordEvent.js"));

class Ready extends DiscordEvent
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
	}
}

module.exports = Ready;
