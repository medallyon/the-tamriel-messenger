const Cron = require("cron").CronJob
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"));

class CronJobs
{
    *[Symbol.iterator]()
    {
        yield this.esoNews;
    }

    constructor()
    {
        this.esoNews = new Cron("0 */15 * * * *", function()
        {
            client.modules["fetchLatestNews"]().catch(console.error);
        });
    }

    startJob(name)
    {
        if (!name)
            throw new ReferenceError("'name' cannot be null or undefined");

        this[name].start();
    }

    stopJob(name)
    {
        if (!name)
            throw new ReferenceError("'name' cannot be null or undefined");

        this[name].stop();
    }

    startAllJobs()
    {
        for (const job of this)
            job.start();
    }

    stopAllJobs()
    {
        for (const job of this)
            job.stop();
    }
}

module.exports = CronJobs;
