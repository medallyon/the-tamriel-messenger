require("dotenv").config();

global.join = require("path").join;
global.__basedir = __dirname;
global.__clientdir = join(__dirname, "lib");
global.__webdir = join(__dirname, "web");

const Client = require("./lib/classes/Client.js");
let client = new Client();

client.login(process.env.BOT_TOKEN)
	.catch(console.error);

const web = require("./web");

module.exports = { client, web };
