const Model = require("../Model.js");

/**
 * @typedef {Object} GuildData
 * @param {Snowflake} id
 * @param {Array<Snowflake, GuildSubscription>|Array<Snowflake, GuildSubscriptionData>} subscriptions
 */

class Guild extends Model
{
	/**
	 * @param {DiscordClient} client
	 * @param {GuildData} data
	 */
	constructor(data)
	{
		super(data.id, data);

		/**
		 * @type {Array<string, GuildScription>}
		 */
		this.subscriptions = data.subscriptions || [];
	}

	/**
	 * Fetch the guild for this database object.
	 * @return {Promise<Guild>}
	 */
	fetch()
	{
		return this.client.guilds.fetch(this.id);
	}

	/**
	 * @return {GuildData} Json representation of the object.
	 */
	toJSON()
	{
		return {
			id: this.id,
			subscriptions: this.subscriptions
		};
	}
}

module.exports = Guild;
