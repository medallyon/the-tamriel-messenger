const Discord = require("discord.js")
    , Client = require("../classes/Client.js");

function getMemberPermissions(member)
{
    // invalid; return 'normal user' perms
    if (!member)
        return 100;

    if (member.id === Client.OWNER_ID)
        return 1000;

    // developer
    if (member.id && Client.DEVELOPERS.some(devId => devId === member.id))
        return 900;

    // private message
    if (member instanceof Discord.User)
        return 100;

    if (member instanceof Discord.GuildMember)
    {
        let serverPerms = member.permissions;

        // server owner
        if (member.guild.owner.id === member.id)
            return 400;
        // admin
        if (serverPerms.has("ADMINISTRATOR"))
            return 300;
        // moderator
        if (serverPerms.has("MANAGE_MESSAGES"))
            return 200;
    }

    // normal user
    return 100;
}

module.exports = getMemberPermissions;
