const EventEmitter = require("events")
	, { AbstractError } = require(join(__libdir, "classes", "errors"));

/**
 * @typedef {Object} GuildSubscriptionData
 * @param {string} guildID
 * @param {string} type
 * @param {bool} publish
 * @param {Array<GuildTextChannelResolvable>} channels
 * @param {Array<RoleResolvable>} mentions
 */

/**
 * The base class for any type of subscriptable.
 */
class GuildSubscription extends EventEmitter
{
	/**
	 * @type {Snowflake}
	 */
	get guildID()
	{
		return this.config.guildID;
	}

	/**
	 * @type {Guild?}
	 */
	get guild()
	{
		return this.client.guilds.resolve(this.guildID);
	}

	/**
	 * @param {DiscordClient} client
	 * @param {GuildSubscriptionData} config
	 */
	constructor(client, config)
	{
		super();
		if (new.target === GuildSubscription)
			throw new AbstractError();

		this.client = client;

		/**
		 * @type {string}
		 */
		this.type = config.type;

		/**
		 * @type {bool}
		 */
		this.publish = config.publish;

		/**
		 * @type {Array<GuildTextChannelResolvable>}
		 */
		this.channels = config.channels;

		/**
		 * @type {Array<RoleResolvable>}
		 */
		this.mentions = config.mentions;
	}

	/**
	 * @return {GuildSubscriptionData}
	 */
	toJSON()
	{
		return {
			guildID: this.guildID,
			type: this.type,
			publish: this.publish,
			channels: this.channels,
			mentions: this.mentions
		};
	}
}

module.exports = GuildSubscription;
