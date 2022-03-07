const { DiscordEvent } = require("@medallyon/djs-framework");

module.exports = function(client)
{
	const events = global.index(__dirname)
		, out = {};

	for (const [ eventName, middleware ] of Object.entries(events))
		out[eventName] = new DiscordEvent(eventName, client, {
			on: [ "ready" ].some(x => x === eventName) ? "once" : "on",
			middleware: Object.values(middleware)
		});

	return out;
};
