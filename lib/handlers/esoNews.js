const join = require("path").join
    , client = require(join(process.cwd(), "client"));

function esoNews(language, article)
{
    console.log(`Received new custom event 'esoNews' for lang ${language}. Distributing article to target channels...`);

    for (const guild of this.guilds.values())
    {
        client.api.get(`/get/servers/${guild.id}?portions=subscriptions`)
            .then(async function(subs)
            {
                const setting = subs.subscriptions.esoNews;
                if (!setting)
                    return;

                if (setting.language && setting.language !== language)
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
                    channel.send(`${roles.map(r => r.toString()).join(" ")} ${article.url}`)
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

module.exports = esoNews;
