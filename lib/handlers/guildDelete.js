const join = require("path").join
    , client = require(join(process.cwd(), "client"));

function guildDelete(guild)
{
    client.socketEventHandler.emitRemoveServer(guild);
}

module.exports = guildDelete;