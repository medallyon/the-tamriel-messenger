const outputTemplate = `\n[ %s %s ]
%s: "%s"
{ %s } - #%s`;

function log(msg)
{
    const dateSent = `${msg.createdAt.getUTCDate().toString().padStart(2, "0")}/${(msg.createdAt.getUTCMonth() + 1).toString().padStart(2, "0")}/${msg.createdAt.getUTCFullYear()}`;
    const timeSent = `${msg.createdAt.getUTCHours().toString().padStart(2, "0")}:${msg.createdAt.getUTCMinutes().toString().padStart(2, "0")}:${msg.createdAt.getUTCSeconds().toString().padStart(2, "0")}`;
    console.log(outputTemplate, dateSent, timeSent, msg.author.tag, msg.cleanContent, msg.guild.name, msg.channel.name);
}

function message(msg)
{
    log(msg);
}

module.exports = message;
