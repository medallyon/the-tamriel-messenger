function esoNews(articleURL)
{
    /*for (const guild of this.guilds.values())
    {
        const newsSettings = (guild.config.server && guild.config.server.news) || { enabled: false };
        if (!newsSettings.enabled)
            continue;

        if (!newsSettings.channel)
            continue;

        const channel = guild.channels.get(newsSettings.channel);
        if (channel)
            channel.send(articleURL).catch(console.error);
    }*/

    // temporary override for esoi server
    let self = this;
    this.channels.get("171044943744335872").send(articleURL).then(function(msg)
    {
        // wait for 10 seconds for the URL to resolve into an embed
        setTimeout(function()
        {
            if (!msg.embeds.length)
                return;

            const embed = msg.embeds[0];
            self.api.post("/set/news", {
                title: embed.title,
                description: embed.description,
                image_url: (embed.image) ? embed.image.url : ((embed.thumbnail) ? embed.thumbnail.url : ""),
                url: embed.url
            }).catch(console.error);
        }, 1000 * 10);
    }).catch(console.error);
}

module.exports = esoNews;
