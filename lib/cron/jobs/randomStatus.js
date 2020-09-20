const CronJob = require("cron").CronJob;

class RandomStatus
{
	constructor(manager)
	{
		this.manager = manager;

		this.stati = (process.env.DISCORD_STATI || "").split(",");
		this.recent = [];

		this.cron = new CronJob({
			// run every 10 mins
			cronTime: "0 */10 * * * *",
			onTick: this.job,
			context: this,
			start: true,
			// don't run on init because client might not be ready yet
			runOnInit: false
		});
	}

	pickRandomStatus()
	{
		const notRecent = this.stati.filter(x => !this.recent.includes(x))
			, random = notRecent[Math.floor(Math.random() * notRecent.length)];

		this.recent.push(random);
		if (this.recent.length >= this.stati.length * .75)
			this.recent.shift();

		return random;
	}

	job()
	{
		if (!this.stati.length)
		{
			this.cron.stop();
			this.cron = null;

			const path = require("path");
			return this.manager.delete(path.basename(__filename).replace(".js", ""));
		}

		this.manager.client.user.setPresence({ activity: { name: this.pickRandomStatus() }})
			.catch(console.error);
	}
}

module.exports = RandomStatus;
