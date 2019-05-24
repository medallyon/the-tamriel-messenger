const fs = require("fs-extra")
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"));

class updateActivity extends Command
{
    constructor()
    {
        super({
            name: "updateActivity",
            system: true
        });

        this.recentActivities = { "PLAYING": [], "LISTENING": [], "WATCHING": [], "STREAMING": [] };
    }

    run()
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            fs.readJson(path.join(process.cwd(), "persistence", "modules", "updateActivity", "activities.json")).then(function(activities)
            {
                const [ activity, type ] = self.chooseRandomActivity(activities);

                client.user.setActivity(activity, { type })
                    .then(resolve)
                    .catch(reject);
            }).catch(reject);
        });
    }

    chooseRandomActivity(activities)
    {
        const validActivities = { "PLAYING": [], "LISTENING": [], "WATCHING": [], "STREAMING": [] };

        for (let type in activities)
            validActivities[type] = activities[type].filter(x => !this.recentActivities[type].includes(x));

        const type = Object.keys(activities)[Math.floor(Math.random() * Object.keys(activities).length)];
        const activity = validActivities[type][Math.floor(Math.random() * validActivities[type].length)];

        this.recentActivities[type].push(activity);
        if (this.recentActivities[type].length > Math.floor(activities[type].length * 0.15))
            this.recentActivities[type].shift();

        return [ activity, type ];
    }
}

module.exports = updateActivity;
