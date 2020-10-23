const CronJob = require("cron").CronJob;

class MegReminder
{
	constructor(manager)
	{
		this.manager = manager;

		this.adminChatID = "589320860901572608";
		this.megID = "319632407181524992";

		this.cron = new CronJob({
			// run every Friday @ 10AM EST
			cronTime: "0 0 9 * * 5",
			onTick: this.job,
			context: this,
			start: true,
			runOnInit: false,
			timeZone: "America/New_York"
		});
	}

	job()
	{
		this.manager.client.channels.fetch(this.adminChatID)
			.then(channel =>
			{
				channel.send(`<@${this.megID}>, it's Friday!`).catch(console.error);
			}).catch(console.error);
	}
}

module.exports = MegReminder;
