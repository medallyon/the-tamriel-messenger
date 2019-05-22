const Discord = require("discord.js")
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"));

const outputTemplate = `\n[ %s %s ]
%s%s: "%s"
{ %s } - #%s`;

function log(msg)
{
    const dateSent = `${msg.createdAt.getUTCDate().toString().padStart(2, "0")}/${(msg.createdAt.getUTCMonth() + 1).toString().padStart(2, "0")}/${msg.createdAt.getUTCFullYear()}`;
    const timeSent = `${msg.createdAt.getUTCHours().toString().padStart(2, "0")}:${msg.createdAt.getUTCMinutes().toString().padStart(2, "0")}:${msg.createdAt.getUTCSeconds().toString().padStart(2, "0")}`;

    console.log(outputTemplate, dateSent, timeSent, ((msg.author.bot) ? "BOT " : ""), msg.author.tag, msg.cleanContent, msg.guild.name, msg.channel.name);
}

function getCommandArgs(msg)
{
    let splitMsg = msg.content.split(" ");
    // check whether user is using command prefix or mention to execute a command, and assign them to 'msg' accordingly
    if (msg.mentions.users.has(msg.client.user.id) && splitMsg[0].includes(msg.client.user.id) && splitMsg.length > 1)
    {
        msg.command = splitMsg[1].toLowerCase();
        msg.args = splitMsg.slice(2);
    } else

    if (splitMsg[0].startsWith(client.Client.DEFAULT_PREFIX))
    {
        msg.command = splitMsg[0].slice(client.Client.DEFAULT_PREFIX.length).toLowerCase();
        msg.args = splitMsg.slice(1);
    }

    return msg;
}

function executeCommand(msg)
{
    // iterate through all commands
    for (const cmd in client.modules)
    {
        const command = client.modules[cmd];

        // for every alias of the current command
        for (const alias of command.alias)
        {
            // check if some alias matches the filtered command string
            if (msg.command !== alias.toLowerCase())
                continue;

            // skip if the command is a system module (should not be executed by users)
            if (command.system)
                continue;

            // check if command is enabled for this guild
            /*let guildCommands = msg.guild.config.commands;
            if (!guildCommands[cmd].enabled)
                return;*/

            // verify that the member has permission to execute this command
            if (!client.utils.hasPermission(msg.member, command))
                return;

            let responseEmbed;
            client.modules[cmd].run(msg).then(function(value)
            {
                if (!value || value instanceof Discord.Message)
                    return;

                if (!(value instanceof Discord.RichEmbed))
                    responseEmbed = client.utils.createCommandResponseEmbed("success", value, msg);
                else
                    responseEmbed = value;
            }).catch(function(error)
            {
                if (!error)
                    return;

                if (error instanceof Error)
                    console.error(error);

                responseEmbed = client.utils.createCommandResponseEmbed("error", error, msg);
            }).finally(function()
            {
                if (!responseEmbed)
                    return;

                msg.channel.send({ embed: responseEmbed }).catch(console.error);
            });
        }
    }
}

function message(msg)
{
    log(msg);

    if (msg.author.bot)
        return;

    // check if a command is present and retrieve any args
    msg = getCommandArgs(msg);
    if (msg.command)
        executeCommand(msg);
}

module.exports = message;
