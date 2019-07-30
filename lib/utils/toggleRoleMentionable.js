function toggleRoleMentionable(role, mentionable = true)
{
    return new Promise(function(resolve)
    {
        if (mentionable === role.mentionable)
            return resolve();

        role.setMentionable(mentionable)
            .catch(console.error)
            .finally(resolve);
    });
}

module.exports = toggleRoleMentionable;
