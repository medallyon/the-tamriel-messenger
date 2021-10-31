require("./globals.js");

require("dotenv").config({
	path: (process.argv[3] || process.env.NODE_ENV || "").toLowerCase().includes("prod")
		? join(__dirname, ".env")
		: join(__dirname, ".env.dev")
});


const DiscordClient = require(join(__libdir, "classes", "DiscordClient.js"));
const client = new DiscordClient();

client.login(process.env.BOT_TOKEN)
	.catch(console.error);

const web = require(__webdir);

});

module.exports = { client, web };
