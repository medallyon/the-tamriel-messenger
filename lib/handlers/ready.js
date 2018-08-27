const fs = require("fs")
    , join = require("path").join;

function loadEventListeners(client)
{
    for (const file of fs.readdirSync(join(__base, "lib", "handlers")))
    {
        const fileName = file.replace(".js", "").toLowerCase();
        client.handlers[fileName] = require(join(__base, "lib", "handlers", file));
        client.on(fileName, client.handlers[fileName]);
    }
}

function ready()
{
    console.log(`Logged in as ${this.user.username} on ${this.guilds.size} server${this.guilds.size !== 1 ? "s" : ""}`);

    loadEventListeners(this);
}

module.exports = ready;
