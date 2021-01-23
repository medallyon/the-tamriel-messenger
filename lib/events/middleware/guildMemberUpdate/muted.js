const { DefaultEmbed } = require(join(__clientdir, "utils"));

const ESOI_GUILD_ID = "130716876937494528"
	, ESOI_MUTED_ROLE_ID = "797646329404588102"
	, ESOI_JAIL_CHANNEL_ID = "312317723277262859"
	, ESOI_LOG_CHANNEL_ID = "717755343622504468";

async function esoiMutedHandler(oldMember, newMember)
{
	const guild = newMember.guild;
	if (guild.id !== ESOI_GUILD_ID)
		return;

	const MEMBER_MUTED = !oldMember.roles.cache.has(ESOI_MUTED_ROLE_ID) && newMember.roles.cache.has(ESOI_MUTED_ROLE_ID)
		, MEMBER_UNMUTED = oldMember.roles.cache.has(ESOI_MUTED_ROLE_ID) && !newMember.roles.cache.has(ESOI_MUTED_ROLE_ID);

	if (!MEMBER_MUTED || !MEMBER_UNMUTED)
		return;

	const logChannel = await newMember.client.channels.fetch(ESOI_LOG_CHANNEL_ID)
		, embed = new DefaultEmbed()
			.setDescription(`<:torchbug:756923561632989245> ${newMember.toString()}`);

	try
	{
		// Member just received 'Muted'
		if (MEMBER_MUTED)
		{
			for (const channel of guild.channels.cache.filter(x => x.id !== ESOI_JAIL_CHANNEL_ID).values())
				channel.updateOverwrite(newMember, {
					VIEW_CHANNEL: false
				}).catch(console.error);

			const jailChannel = await newMember.client.channels.fetch(ESOI_JAIL_CHANNEL_ID);
			await jailChannel.updateOverwrite(newMember, {
				VIEW_CHANNEL: true
			});

			logChannel.send(embed
				.setColor("#000000")
				.setAuthor("A member was muted", newMember.user.displayAvatarURL())
			).catch(console.error);
		}

		// Member just lost 'Muted'
		else if (MEMBER_UNMUTED)
		{
			for (const channel of guild.channels.cache.values())
				channel.updateOverwrite(newMember, null).catch(console.error);

			logChannel.send(embed
				.setColor("#FFFFFF")
				.setAuthor("A member was unmuted", newMember.user.displayAvatarURL())
			).catch(console.error);
		}
	}

	catch (err)
	{
		console.error(err);
		await logChannel.send(`Something went wrong while applying the \`MUTED\` status to ${newMember.toString()}. \`\`\`js\n${err}\`\`\``);
	}
}

module.exports = esoiMutedHandler;
