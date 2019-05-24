const path = require("path")
    , ClientEventHandler = require(path.join(process.cwd(), "lib", "classes", "ClientEventHandler.js"))
    , CronManager = require(path.join(process.cwd(), "lib", "classes", "CronManager.js"));

function ready()
{
    console.log(`Logged in as ${this.user.username} on ${this.guilds.size} server${this.guilds.size !== 1 ? "s" : ""}`);

    this.utils = require(path.join(process.cwd(), "lib", "utils"));
    this.modules = require(path.join(process.cwd(), "lib","modules"));
    this.eventHandler = new ClientEventHandler(this);

    this.crons = new CronManager();
    this.crons.startAllJobs();
}

module.exports = ready;
