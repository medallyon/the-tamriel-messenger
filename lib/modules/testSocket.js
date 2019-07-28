const path = require("path")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"));

class testSocket extends Command
{
    constructor()
    {
        super({
            name: "testSocket",
            description: "Sends a 'test' event to the server.",
            alias: [ "testSocket", "test" ],
            usage: "test message",
            permissions: 900
        });

        this.timeout = 1000 * 30;
    }

    run(msg)
    {
        return new Promise(function(resolve, reject)
        {
            client.socketEventHandler.socket.emit("test", msg.content, function(res)
            {
                msg.reply(res)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
}

module.exports = testSocket;
