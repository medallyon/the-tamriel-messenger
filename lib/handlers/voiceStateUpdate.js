const ESO_GUILD_ID = process.env.ESO_GUILD_ID
    , join = require("path").join
    , client = require(join(process.cwd(), "client"));

// just gonna hardcode these ids for now
const esoVoiceTextTable = {
    "130716876937494529": "601085405412065320",
    "304317976834867200": "601092983546445829",
    "433783360289243138": "601093037455573054",
    "429079793984733245": "601093065217933333",
    "429080091495104515": "601093089951481907",
    "433783522520465408": "601093133710655489",
    "429080210080661505": "601093156162895883",
    "429080243048022048": "601093175792107531"
};

function voiceStateUpdate(oldMember, newMember)
{
    const esoGuild = client.guilds.get(ESO_GUILD_ID);
    if (!esoGuild)
        return;

    // state update is irrelevant
    if (!oldMember.voiceChannel && !newMember.voiceChannel)
        return;

    // either voiceChannel is not part of `esoGuild`
    if ((oldMember.voiceChannel && !esoGuild.channels.has(oldMember.voiceChannel.id)) || (newMember.voiceChannel && !esoGuild.channels.has(newMember.voiceChannel.id)))
        return;

    // member just joined a voice channel
    if (newMember.voiceChannel)
    {
        // fetch the text channel corresponding to the associated voice channel
        const textChannel = esoGuild.channels.get(esoVoiceTextTable[newMember.voiceChannel.id]);
        if (!textChannel)
            return;

        textChannel.overwritePermissions(newMember, { "VIEW_CHANNEL": true }, "Member joined associated Voice Channel.").catch(console.error);
    }

    // member just left a voice channel or switched active voice channels
    if ((oldMember.voiceChannel && !newMember.voiceChannel)
        || (oldMember.voiceChannel && newMember.voiceChannel && oldMember.voiceChannel.id !== newMember.voiceChannel.id))
    {
        // fetch the text channel corresponding to the associated voice channel
        const textChannel = esoGuild.channels.get(esoVoiceTextTable[oldMember.voiceChannel.id]);
        if (!textChannel)
            return;

        const memberOverwrites = textChannel.permissionOverwrites.get(oldMember.id);
        if (!memberOverwrites)
            return;

        memberOverwrites.delete("Member left associated Voice Channel.").catch(console.error);

        // check if voiceChannel is empty, delete all cached messages if so
        // update 22-07-19: leave messages untouched, disable 'read message history' permission
        /*if (!oldMember.voiceChannel.members.size)
            textChannel.bulkDelete(textChannel.messages).catch(console.error);*/
    }
}

module.exports = voiceStateUpdate;
