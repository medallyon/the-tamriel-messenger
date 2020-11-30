require("dotenv").config();

global.join = require("path").join;
global.__basedir = __dirname;
global.__clientdir = join(__dirname, "lib");
global.__webdir = join(__dirname, "web");

const Client = require("./lib/classes/DiscordClient.js");
let client = new Client();

client.login((process.env.NODE_ENV || "").toLowerCase() === "production" ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_DEV)
	.catch(console.error);

const web = require("./web");

module.exports = { client, web };
