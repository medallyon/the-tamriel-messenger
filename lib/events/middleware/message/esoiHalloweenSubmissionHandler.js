const ESOI_PARTICIPANT_ROLE_ID = "766059594924687430"
	, ESOI_EVENT_CHANNEL_ID = "763834501407047720";

function esoiHalloweenSubmissionHandler(msg)
{
	if (msg.channel.id !== ESOI_EVENT_CHANNEL_ID)
		return;

	// Member already has Event Role
	if (msg.member.roles.cache.has(ESOI_PARTICIPANT_ROLE_ID))
		return;

	const image = msg.attachments.first();
	if (!image)
		return;

	console.log(image.name);
	if (![ "png", "webp", "jpg", "jpeg", "gif" ].some(x => image.name.toLowerCase().endsWith(x)))
		return;

	msg.member.roles.add(ESOI_PARTICIPANT_ROLE_ID)
		.catch(console.error);
}

module.exports = esoiHalloweenSubmissionHandler;
