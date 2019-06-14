const Cron = require("cron").CronJob
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"));

class CronManager
{
    [Symbol.iterator]()
    {
        return this.jobs.values();
    }

    constructor()
    {
        this.intervals = {
            "0 */15 * * * *": function()
            {
                client.modules.updateActivity.run().catch(console.error);
            },
            "0 0 6 * * *": function()
            {
                client.modules.pledges.run().then(function(embed)
                {
                    for (const guild of client.guilds)
                    {
                        client.api.get(`/get/servers/${guild.id}`).then(function(config)
                        {
                            const setting = config.subscriptions.pledgeUpdates;
                            if (!setting.enabled)
                                return;

                            let pledgeChannels = [];
                            for (const id of setting.channels)
                                pledgeChannels.push(client.channels.get(id));

                            pledgeChannels = pledgeChannels.filter(c => c);
                            for (const channel of pledgeChannels)
                                channel.send(setting.customMessage || "A new day has arrived. Here are today's pledges:", { embed }).catch(console.error);
                        }).catch(console.error);
                    }
                }).catch(console.error);
            }
        };

        this.jobs = [];
        for (const entry in this.intervals)
            this.jobs.push(new Cron(entry, this.intervals[entry]));
    }

    startAllJobs()
    {
        for (const job of this.jobs)
            job.start();
    }

    stopAllJobs()
    {
        for (const job of this.jobs)
            job.stop();
    }
}

module.exports = CronManager;
