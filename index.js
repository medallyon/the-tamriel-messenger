// declare a global var that holds the root path
global.__base = __dirname;

// populate the `process.env` object from local `.env` file
require("dotenv").load();
const join = require("path").join
    , Client = require("./lib/classes/Client.js");

const client = new Client();
client.once("ready", require(join(__base, "lib", "handlers", "ready.js")));

client.login(process.env.BOT_TOKEN)
    .catch(console.error);
