const join = require("path").join
    , client = require(join(process.cwd(), "client"));

function guildCreate(guild)
{
    client.socketEventHandler.emitNewServer(guild);
}

module.exports = guildCreate;
