require("dotenv").config();

global.join = require("path").join;
global.__basedir = __dirname;
global.__clientdir = join(__dirname, "lib");

const Client = require("./lib/classes/Client.js");
let client = new Client();

client.login(process.env.BOT_TOKEN)
	.catch(console.error);

module.exports = client;
