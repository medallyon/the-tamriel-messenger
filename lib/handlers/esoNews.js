function _toggleNewsRoleMentionable(role, mentionable = true)
{
    return new Promise(function(resolve)
    {
        if (mentionable === role.mentionable)
            return resolve();

        role.setMentionable(mentionable, mentionable ? "[ESO News] New Article" : "[ESO News] Article Sent")
            .finally(resolve);
    });
}

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

    console.log("Received new custom event 'esoNews'. Sending article URL to target channel...");
    console.log(article);

    // temporary override for esoi server
    const esoiGuild = this.guilds.get("130716876937494528");
    if (!esoiGuild)
        return;

    const newsRole = this.guilds.roles.get("320932080966172672")
        , originallyMentionable = newsRole.mentionable;

    _toggleNewsRoleMentionable(newsRole, true)
        .catch(console.error)
        .finally(function()
        {
            const newsChannel = this.channels.get("171044943744335872");
            if (!newsChannel)
                return _toggleNewsRoleMentionable(newsRole, originallyMentionable).catch(console.error);

            newsChannel.send(`${newsRole.toString()} ${article.url}`)
                .catch(console.error)
                .finally(function()
                {
                    _toggleNewsRoleMentionable(newsRole, originallyMentionable).catch(console.error);
                });
        });
}

module.exports = esoNews;
