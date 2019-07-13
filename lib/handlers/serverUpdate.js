const join = require("path").join
    , client = require(join(process.cwd(), "client"));

function _toggleRoleMentionable(role, mentionable = true)
{
    return new Promise(function(resolve)
    {
        if (mentionable === role.mentionable)
            return resolve();

        role.setMentionable(mentionable, mentionable ? "[ESO News] New Article" : "[ESO News] Article Sent")
            .finally(resolve);
    });
}

function serverUpdate(servers)
{
    console.log("Received new custom event 'serverUpdate'");
    console.log(servers);

    let embed = new client.utils.Embed()
        .setAuthor("ESO Server Status")
        .setDescription("The following servers have been updated:");

    const serverNames = Object.keys(servers);

    // necessary formatting for Server Names & Categories
    const affectedServersPC = serverNames.filter(x => ["EU", "NA", "PTS"].some(name => name === x));
    if (affectedServersPC.length)
        embed.addField("PC", affectedServersPC.map(s => `**${s}** • ${!servers[s] ? "💚" : "💔"} -> ${servers[s] ?  "💚 **Online**" : "💔 **Offline**"}`).join("\n"));

    const affectedServersXBOX = serverNames.filter(x => x.toUpperCase().includes("XBOX"));
    if (affectedServersXBOX.length)
        embed.addField("XBOX", affectedServersXBOX.map(s => `**${s}** • ${!servers[s] ? "💚" : "💔"} -> ${servers[s] ? "💚 **Online**" : "💔 **Offline**"}`).join("\n"));

    const affectedServersPS4 = serverNames.filter(x => x.toUpperCase().includes("PS4"));
    if (affectedServersPS4.length)
        embed.addField("PS4", affectedServersPS4.map(s => `**${s}** • ${!servers[s] ? "💚" : "💔"} -> ${servers[s] ? "💚 **Online**" : "💔 **Offline**"}`).join("\n"));

    // temporary override for esoi server
    const esoiGuild = this.guilds.get("130716876937494528");
    console.log(esoiGuild.name);
    if (!esoiGuild)
        return;

    const statusRole = esoiGuild.roles.get("320931998959009804")
        , originallyMentionable = statusRole.mentionable;

    console.log(statusRole.name, originallyMentionable);

    _toggleRoleMentionable(statusRole, true)
        .catch(console.error)
        .finally(function()
        {
            const statusChannel = esoiGuild.channels.get("319641305388941315");
            console.log(statusChannel.name);
            if (!statusChannel)
                return _toggleRoleMentionable(statusRole, originallyMentionable).catch(console.error);

            statusChannel.send(`${statusRole.toString()}`, { embed })
                .catch(console.error)
                .finally(function()
                {
                    console.log("finally...");
                    _toggleRoleMentionable(statusRole, originallyMentionable).catch(console.error);
                });
        });
}

module.exports = serverUpdate;