const client = require("../../client");

function ping(msg)
{
    return new Promise(function(resolve, reject)
    {
        let response = "Pong!";
        if (msg.command === "pong")
            response = "Ping?!";

        msg.channel.send(response).then(function(sent)
        {
            sent.edit(`${response} (${Date.now() - sent.createdTimestamp}ms)`)
                .then(resolve)
                .catch(reject);
        }).catch(reject);
    });
}

ping.meta = {
    name: "ping",
    description: "Pong!",
    alias: [ "ping", "pong" ],
    usage: "",
    permissions: 100
};

module.exports = ping;
