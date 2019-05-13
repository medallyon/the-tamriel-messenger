const client = require("../../client");

function evaluate(msg)
{
    return new Promise(function(resolve, reject)
    {
        if (!msg.args.length)
            return resolve(msg.channel.send("null", { code: "js" }).catch(reject));

        let evaluated;
        try
        {
            evaluated = eval(msg.args.join(" "));
        }
        catch (error)
        {
            evaluated = error;
        }

        msg.channel.send(evaluated, { code: "js" }).then(resolve).catch(reject);
    });
}

evaluate.meta = {
    name: "evaluate",
    alias: [ "evaluate", "eval" ],
    usage: "1 + 1",
    permissions: 900
};

module.exports = evaluate;
