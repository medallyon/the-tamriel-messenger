const path = require("path")
    , ClientEventHandler = require(path.join(process.cwd(), "lib", "classes", "ClientEventHandler.js"))
    , CronManager = require(path.join(process.cwd(), "lib", "classes", "CronManager.js"));

function ready()
{
    console.log(`Logged in as ${this.user.username} on ${this.guilds.size} server${this.guilds.size !== 1 ? "s" : ""}`);

    this.utils = require(this.Client.__paths.utils);
    this.modules = require(this.Client.__paths.modules);
    this.eventHandler = new ClientEventHandler(this);

    this.crons = new CronManager();
    this.crons.startAllJobs();

    this.modules.updateActivity.run().catch(console.error);
}

module.exports = ready;
