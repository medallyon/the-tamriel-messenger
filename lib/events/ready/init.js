const { init } = require("@medallyon/djs-framework");

function loggedIn()
{
	console.log(`Successfully logged in as ${this.user.tag}.`);
	init(this, undefined, process.env.DISCORD_TOKEN);
}

module.exports = loggedIn;
