const GuildSubscription = require(join(__libdir, "classes", "GuildSubscription.js"));

/**
 * @typedef {GuildSubscriptionData} NewsSubscriptionData
 */

class NewsSubscription extends GuildSubscription
{
	/**
	 * @param {DiscordClient} client
	 * @param {NewsSubscriptionData} config
	 */
	constructor(client, config)
	{
		super(client, Object.assign(config, { type: "news" }));
	}
}

module.exports = NewsSubscription;
