const fs = require("fs-extra");

const ESOI_GUILD_ID = "130716876937494528"
	, ESOI_GUARD_ROLE_ID = "598409804465045534"
	, METRIC_FILE_PATH = join(__datadir, "metrics", "metrics.json");

function guardMetrics(msg)
{
	const guild = msg.guild;
	if (guild?.id !== ESOI_GUILD_ID)
		return;

	if (!msg.member?.roles.cache.has(ESOI_GUARD_ROLE_ID))
		return;

	fs.ensureFile(METRIC_FILE_PATH)
		.then(() =>
		{
			let attempts = 0;
			(function saveMetric()
			{
				fs.readJSON(METRIC_FILE_PATH)
					.then(data =>
					{
						if (!data[msg.author.id])
							data[msg.author.id] = {};

						const today = (new Date()).toDateString();
						if (!data[msg.author.id][today])
							data[msg.author.id][today] = [];

						data[msg.author.id][today].push(msg.id);

						fs.outputJSON(METRIC_FILE_PATH, data)
							.catch(console.error);
					}).catch(err =>
					{
						if (++attempts === 5)
							return;
						
						fs.outputJSON(METRIC_FILE_PATH, {})
							.then(saveMetric)
							.catch(console.error);
					});
			})();
		}).catch(console.error);
}

module.exports = guardMetrics;
