module.exports = guild =>
{
	return {
		id: guild.id,
		news: {
			enabled: false,
			language: "en-us",
			prefix: "",
			channel: null
		},
		notes: {
			enabled: false,
			platform: "pc",
			channel: null
		},
		status: {
			enabled: false,
			channel: null
		}
	};
};
