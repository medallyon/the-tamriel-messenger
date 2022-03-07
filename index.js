require("./globals.js");

require("dotenv").config({
	path: (process.argv[3] || process.env.NODE_ENV || "").toLowerCase().includes("prod")
		? join(__dirname, ".env")
		: join(__dirname, ".env.dev")
});

const DiscordClient = require(join(__libdir, "classes", "DiscordClient.js"));
const client = new DiscordClient();

client.login(process.env.DISCORD_TOKEN)
	.catch(console.error);

const Sentry = require("@sentry/node")
	, Tracing = require("@sentry/tracing")
	, { CaptureConsole: CaptureConsoleIntegration } = require("@sentry/integrations");

const web = require(__webdir);

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app: web }),
		new CaptureConsoleIntegration({ levels: [ "warn", "error" ] })
	]
});

module.exports = { client, web };
