function esoNews(article)
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
            channel.send(article.url).catch(console.error);
    }*/

    // temporary override for esoi server
    this.channels.get("171044943744335872").send(article.url).catch(console.error);
}

module.exports = esoNews;
