const path = require("path")
    , Command = require(path.join(process.cwd(), "lib", "classes", "Command.js"));

class ping extends Command
{
    constructor()
    {
        super({
            name: "ping",
            description: "Pong!",
            alias: [ "ping", "pong" ],
            usage: "",
            permissions: 100
        });
    }

    run(msg)
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
}

module.exports = ping;
