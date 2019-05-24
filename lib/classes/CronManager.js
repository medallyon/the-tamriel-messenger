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
        this.intervals = {};

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
