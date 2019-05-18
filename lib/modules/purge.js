const path = require("path")
    , Command = require(path.join(process.cwd(), "lib", "classes", "Command.js"));

class purge extends Command
{
    constructor()
    {
        super({
            name: "purge",
            description: "Purge X amount of numbers. Filter messages with user mentions.",
            alias: [ "purge" ],
            usage: "1-250 [ @mention, ... ]",
            permissions: 300
        });
    }

    run(msg)
    {
        return new Promise(function(resolve, reject)
        {
            const numOfMessages = parseInt(msg.args[0]);
            if (!numOfMessages)
                return reject("You must supply a number of messages to delete.");
            if (numOfMessages < 1 || numOfMessages > 100)
                return reject("You must supply a number between **`1`** and **`100`**");

            const userFilter = msg.mentions.users;
            msg.channel.fetchMessages({ before: msg.id, limit: 100 }).then(function(messages)
            {
                let filteredMessages;
                if (userFilter.size)
                    filteredMessages = messages.filterArray(m => userFilter.map(u => u.id).includes(m.author.id)).slice(0, numOfMessages);
                else
                    filteredMessages = messages.array().slice(0, numOfMessages);

                msg.channel.bulkDelete(filteredMessages).then(function(deleted)
                {
                    resolve(`Deleted \`${deleted.size}\` message${(deleted.size === 1) ? "" : "s"}${(userFilter.size && userFilter.array().some(u => deleted.map(m => m.author.id).includes(u.id))) ? (` by the following users:\n\n${userFilter.array().join("\n")}`) : "."}`);
                }).catch(reject);
            }).catch(reject);
        });
    }
}

module.exports = purge;
