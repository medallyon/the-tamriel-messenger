const join = require("path").join
    , client = require(join(process.cwd(), "client"));

function createTweetEmbed(details)
{
    const retweeted = (details.retweeted_status && true) || false
        , realTweet = details.retweeted_status || details;

    let embed = new client.utils.Embed()
        .setAuthor(`${details.user.name} (@${details.user.screen_name})${(retweeted) ? " retweeted" : ""}`, details.user.profile_image_url_https, `https://twitter.com/${details.user.screen_name}`)
        .setDescription(realTweet.text)
        .addField("Retweets", realTweet.retweet_count, true)
        .addField("Likes", realTweet.favorite_count, true)
        .setFooter((retweeted) ? `Original tweet by @${details.retweeted_status.user.screen_name}` : "Twitter", (retweeted) ? details.retweeted_status.user.profile_image_url_https : "https://abs.twimg.com/icons/apple-touch-icon-192x192.png");

    if (details.entities.media)
        embed.setImage(details.entities.media[0].media_url_https);

    return embed;
}

async function tweet(tweetObject)
{
    console.log("\nReceived new custom event 'tweet'. Distributing tweet to target channels...");

    let embed = createTweetEmbed(tweetObject)
        , webhookRegExp = /https:\/\/(?:www\.)?(?:canary\.)?discordapp\.com\/api\/webhooks\/(\d+)\/(.+)/;

    for (const guild of this.guilds.values())
    {
        client.api.get(`/get/servers/${guild.id}?portions=subscriptions`)
            .then(async function(subs)
            {
                const setting = subs.subscriptions.tweets;
                if (!setting)
                    return;

                if (!setting.enabled || (!setting.channels.length && !setting.webhooks.length))
                    return;

                if (setting.mode === "bot")
                {
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
                    const finallyFunc = function()
                    {
                        if (++count < channels.length)
                            return;

                        for (let i = 0; i < mentions.length; i++)
                            client.utils.toggleRoleMentionable(roles[i], mentions[i])
                                .catch(console.error);
                    };

                    for (const channel of channels)
                    {
                        if (setting.embed)
                            channel.send({ embed })
                                .catch(console.error)
                                .finally(finallyFunc);
                        else
                            channel.send(`https://twitter.com/${tweetObject.user.screen_name}/status/${tweetObject.id_str}`)
                                .catch(console.error)
                                .finally(finallyFunc);
                    }
                }

                else if (setting.mode === "webhooks")
                {
                    guild.fetchWebhooks()
                        .then(function(webhooks)
                        {
                            const webhookIds = setting.webhooks.map(url => url.match(webhookRegExp)[1]);
                            webhooks = webhooks.filter(w => webhookIds.includes(w.id));

                            for (const webhook of webhooks.values())
                            {
                                if (setting.embed)
                                    webhook.send({ embed }).catch(console.error);
                                else
                                    webhook.send(`https://twitter.com/${tweetObject.user.screen_name}/status/${tweetObject.id_str}`, {
                                        username: tweetObject.user.name,
                                        avatarURL: tweetObject.user.profile_image_url_https
                                    }).catch(console.error);
                            }
                        }).catch(console.error);
                }
            }).catch(console.error);
    }
}

module.exports = tweet;
