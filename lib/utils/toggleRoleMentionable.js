function toggleRoleMentionable(role, mentionable = true)
{
    return new Promise(function(resolve)
    {
        if (mentionable === role.mentionable)
            return resolve();

        role.setMentionable(mentionable)
            .finally(resolve);
    });
}

module.exports = toggleRoleMentionable;
