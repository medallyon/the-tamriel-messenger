const ClientEventHandler = require("../classes/ClientEventHandler.js");

function ready()
{
    console.log(`Logged in as ${this.user.username} on ${this.guilds.size} server${this.guilds.size !== 1 ? "s" : ""}`);

    this.utils = require("../utils");
    this.modules = require("../modules");
    this.eventHandler = new ClientEventHandler(this);
}

module.exports = ready;
