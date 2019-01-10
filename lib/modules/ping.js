async function ping(msg)
{
    let response = "Pong!";
    if (msg.command === "pong")
        response = "Ping?";

    let sent = await msg.channel.send(response);
    await sent.edit(`${response} (${Date.now() - sent.createdTimestamp}ms)`);
}

ping.meta = {
    name: "ping",
    alias: [ "ping", "pong" ],
    permissions: 100
};

module.exports = ping;
