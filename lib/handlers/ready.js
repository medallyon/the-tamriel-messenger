const path = require("path")
    , ClientEventHandler = require(path.join(process.cwd(), "lib", "classes", "ClientEventHandler.js"));

function ready()
{
    console.log(`Logged in as ${this.user.username} on ${this.guilds.size} server${this.guilds.size !== 1 ? "s" : ""}`);

    this.utils = require(path.join(__base, "lib", "utils"));
    this.modules = require(path.join(__base, "lib","modules"));
    this.eventHandler = new ClientEventHandler(this);
}

module.exports = ready;
