require("./globals.js");

require("dotenv").config({
	path: (process.argv[3] || process.env.NODE_ENV || "").toLowerCase().includes("prod")
		? join(__dirname, ".env")
		: join(__dirname, ".env.dev")
});

const Sentry = require("@sentry/node")
	, Tracing = require("@sentry/tracing");

const DiscordClient = require(join(__libdir, "classes", "DiscordClient.js"));
const client = new DiscordClient();

client.login(process.env.BOT_TOKEN)
	.catch(console.error);

const web = require(__webdir);

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app: web })
	]
});

module.exports = { client, web };
