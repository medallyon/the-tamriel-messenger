async function tweet(tweetObject)
{
    /*for (const guild of this.guilds.values())
    {
        if (!guild.config)
            guild.config = await this.fetchGuildConfig(guild.id);

        if (!guild.config.subscriptions.esoNews.enabled)
            return;

        if (!guild.config.subscriptions.esoNews.channel)
            return;

        let newsChannel = this.channels.get(guild.config.subscriptions.esonews.channel);
        if (!newsChannel)
        {
            guild.config.subscriptions.esonews.enabled = false;
            guild.config.subscriptions.esonews.channel = "";
            await this.saveGuildConfig(guild.id, guild.config);
        }

        newsChannel.send(`New tweet from **${tweetObject.user.name}**:\nhttps://twitter.com/${tweetObject.user.screen_name}/status/${tweetObject.id_str}`).catch(console.error);
    }*/

    // override for ESOI Server for the time being
    this.fetchWebhook(process.env.TWEETER_WEBHOOK_ID, process.env.TWEETER_WEBHOOK_TOKEN).then(function(webhook)
    {
        webhook.send(`https://twitter.com/${tweetObject.user.screen_name}/status/${tweetObject.id_str}`, {
            username: tweetObject.user.name,
            avatarURL: tweetObject.user.profile_image_url_https
        }).then(function()
        {
            console.log(`\nSuccessfully sent ${tweetObject.user.name}'s tweet to WEBHOOK.`);
        }).catch(function(err)
        {
            console.error(err);
        });
    });
}

module.exports = tweet;
