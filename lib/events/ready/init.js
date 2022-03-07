const { init } = require("@medallyon/djs-framework");

function loggedIn()
{
	console.log(`Successfully logged in as ${this.user.tag}.`);
	init(this, undefined, process.env.BOT_TOKEN);
}

module.exports = loggedIn;
