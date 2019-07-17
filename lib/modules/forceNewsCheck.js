const path = require("path")
    , Command = require(path.join(process.cwd(), "lib", "classes", "Command.js"))
    , client = require(path.join(process.cwd(), "client"));

class forcenewscheck extends Command
{
    constructor()
    {
        super({
            name: "forcenewscheck",
            description: "Force check the latest news.",
            alias: [ "forcenewscheck", "fnc" ],
            usage: "",
            permissions: 900
        });
    }

    run(msg)
    {
        console.log("Forcing News Check...");
        return new Promise(function(resolve, reject)
        {
            client.socketEventHandler.socket.emit("forcenewscheck", function(res)
            {
                console.log(res);
                resolve(res);
            });
        });
    }
}

module.exports = forcenewscheck;
