const DiscordEvent = require(join(__libdir, "classes", "DiscordEvent.js"));

class InteractionCreate extends DiscordEvent
{
	constructor(client)
	{
		super(client, "interactionCreate");
	}

	/**
	 * @param {Interaction} interaction
	 */
	trigger(interaction)
	{
		console.log(interaction);
		super.trigger(interaction);
	}
}

module.exports = InteractionCreate;
