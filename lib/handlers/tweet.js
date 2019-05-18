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

        let newsChannel = this.channels.get(guild.config.subscriptions.esoNews.channel);
        if (!newsChannel)
        {
            guild.config.subscriptions.esoNews.enabled = false;
            guild.config.subscriptions.esoNews.channel = "";
            return await this.saveGuildConfig(guild.id, guild.config);
        }

        const retweeted = (tweetObject.retweeted_status && true) || false
            , realTweet = tweetObject.retweeted_status || tweetObject;

        if (guild.config.subscriptions.esoNews.embed)
        {
            let embed = new this.utils.Embed()
                .setAuthor(`${tweetObject.user.name} (@${tweetObject.user.screen_name})${(retweeted) ? " retweeted" : ""}`, tweetObject.user.profile_image_url_https, `https://twitter.com/${tweetObject.user.screen_name}`)
                .setDescription(realTweet.text)
                .addField("Retweets", realTweet.retweet_count, true)
                .addField("Likes", realTweet.favorite_count, true)
                .setFooter((retweeted) ? `Original tweet by @${tweetObject.retweeted_status.user.screen_name}` : "Twitter", (retweeted) ? tweetObject.retweeted_status.user.profile_image_url_https : "https://abs.twimg.com/icons/apple-touch-icon-192x192.png");

            if (tweetObject.entities.media)
                embed.setImage(tweetObject.entities.media[0].media_url_https);

            newsChannel.send({ embed }).catch(console.error);
        }

        else
            newsChannel.send(`New ${(retweeted) ? "re" : ""}tweet from **${tweetObject.user.name}**:\nhttps://twitter.com/${tweetObject.user.screen_name}/status/${tweetObject.id_str}`).catch(console.error);
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
