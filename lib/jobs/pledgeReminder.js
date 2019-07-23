const join = require("path").join
    , client = require(join(process.cwd(), "client"));

function pledgeReminder()
{
    client.modules.pledges.run().then(function(embed)
    {
        for (const guild of client.guilds)
        {
            client.api.get(`/get/servers/${guild.id}`).then(function(config)
            {
                const setting = config.subscriptions.pledgeUpdates;
                if (!setting.enabled)
                    return;

                let pledgeChannels = [];
                for (const id of setting.channels)
                    pledgeChannels.push(client.channels.get(id));

                pledgeChannels = pledgeChannels.filter(c => c);
                for (const channel of pledgeChannels)
                    channel.send(setting.customMessage || "Here is a friendly reminder for today's pledges!", { embed }).catch(console.error);
            }).catch(console.error);
        }
    }).catch(console.error);
}

module.exports = pledgeReminder;
