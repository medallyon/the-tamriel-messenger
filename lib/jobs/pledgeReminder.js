const join = require("path").join
    , client = require(join(process.cwd(), "client"));

function pledgeReminder(currentInterval)
{
    client.modules.pledges.run().then(function(embed)
    {
        for (const guild of client.guilds.values())
        {
            client.api.get(`/get/servers/${guild.id}?portions=subscriptions`).then(async function(subs)
            {
                const setting = subs.subscriptions.pledgeUpdates;
                if (!setting)
                    return;

                if (!setting.enabled || !setting.channels.length)
                    return;

                if (setting.interval !== currentInterval)
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
                    channel.send(setting.customMessage, { embed })
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
    }).catch(console.error);
}

module.exports = pledgeReminder;
