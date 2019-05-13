// populate the `process.env` object from local `.env` file
require("dotenv").load();

const client = require("./client");
client.once("ready", require(`${client.Client.__paths.handlers}/ready.js`));

client.login(process.env.BOT_TOKEN)
    .catch(console.error);
