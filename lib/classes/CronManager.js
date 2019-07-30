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
        const jobModules = require(path.join(process.cwd(), "lib", "jobs"));

        this.intervals = {
            "0 */15 * * * *": function()
            {
                client.modules.updateActivity.run().catch(console.error);
            },
            "0 0 */3 * * *": function()
            {
                jobModules.pledgeReminder(3);
            },
            "0 0 */6 * * *": function()
            {
                jobModules.pledgeReminder(6);
            },
            "0 0 */8 * * *": function()
            {
                jobModules.pledgeReminder(8);
            },
            "0 0 */12 * * *": function()
            {
                jobModules.pledgeReminder(12);
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
