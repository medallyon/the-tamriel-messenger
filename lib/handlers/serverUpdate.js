const join = require("path").join
    , client = require(join(process.cwd(), "client"));

function createStatusEmbed(servers)
{
    let embed = new client.utils.Embed()
        .setAuthor("ESO Server Status")
        .setDescription("The following servers have been updated:");

    const serverNames = Object.keys(servers);

    // necessary formatting for Server Names & Categories
    const affectedServersPC = serverNames.filter(x => ["EU", "NA", "PTS"].some(name => name === x));
    if (affectedServersPC.length)
        embed.addField("PC", affectedServersPC.map(s => `The **${s}** MegaServer is now -> ${servers[s] ?  "💚 ***Online***" : "💔 ***Offline***"}`).join("\n"));

    const affectedServersXBOX = serverNames.filter(x => x.toUpperCase().includes("XBOX"));
    if (affectedServersXBOX.length)
        embed.addField("XBOX", affectedServersXBOX.map(s => `The **${s}** MegaServer is now -> ${servers[s] ? "💚 ***Online***" : "💔 ***Offline***"}`).join("\n"));

    const affectedServersPS4 = serverNames.filter(x => x.toUpperCase().includes("PS4"));
    if (affectedServersPS4.length)
        embed.addField("PS4", affectedServersPS4.map(s => `The **${s}** MegaServer is now -> ${servers[s] ? "💚 ***Online***" : "💔 ***Offline***"}`).join("\n"));

    return embed;
}

function serverUpdate(servers)
{
    console.log("Received new custom event 'serverUpdate'. Distributing update to target channels...");

    const embed = createStatusEmbed(servers);
    for (const guild of this.guilds.values())
    {
        client.api.get(`/get/servers/${guild.id}?portions=subscriptions`)
            .then(async function(subs)
            {
                const setting = subs.subscriptions.serverUpdate;
                if (!setting)
                    return;

                if (!setting.enabled || !setting.channels.length)
                    return;

                let channels = [];
                for (const id of setting.channels)
                    channels.push(guild.channels.get(id));
                
                // filter out any undefined channels
                channels = channels.filter(c => c);

                let roles = [];
                for (const id of setting.mentionRoles)
                    roles.push(guild.roles.get(id));

                // filter out any undefined roles
                roles = roles.filter(r => r);

                // store the original values of 'role.mentionable' for each role
                const mentions = [];
                for (const role of roles)
                {
                    const originallyMentionable = role.mentionable;
                    mentions.push(originallyMentionable);

                    await client.utils.toggleRoleMentionable(role, true);
                }

                let count = 0;
                for (const channel of channels)
                {
                    channel.send(roles.map(r => r.toString()).join(" "), { embed })
                        .catch(console.error)
                        .finally(function()
                        {
                            if (++count < channels.length)
                                return;

                            for (let i = 0; i < mentions.length; i++)
                                client.utils.toggleRoleMentionable(roles[i], mentions[i])
                                    .catch(console.error);
                        });
                }
            }).catch(console.error);
    }
}

module.exports = serverUpdate;