const Event = require(join(__clientdir, "classes", "Event.js"));

class GuildMemberUpdate extends Event
{
    constructor(client)
    {
        super(client, "guildMemberUpdate");
    }

    trigger(oldMember, newMember)
    {
        super.trigger(oldMember, newMember);
    }
}

module.exports = GuildMemberUpdate;
