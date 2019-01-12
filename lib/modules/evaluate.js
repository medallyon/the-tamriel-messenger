function evaluate(msg)
{
    if (!msg.args.length)
        return msg.channel.send("null", { code: "js" }).catch(console.error);

    let evaluated;
    try
    {
        evaluated = eval(msg.args.join(" "));
    }
    catch (error)
    {
        evaluated = error;
    }

    msg.channel.send(evaluated, { code: "js" }).catch(console.error);
}

evaluate.meta = {
    name: "evaluate",
    alias: [ "evaluate", "eval" ],
    permissions: 900
};

module.exports = evaluate;
