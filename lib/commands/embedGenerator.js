const { MessageEmbed } = require("discord.js")
	, Command = require("../classes/DiscordCommand.js");

class EmbedGenerator extends Command
{
	constructor(client)
	{
		super(client, {
			name: "embedgenerator",
			alias: [ "embed", "generateembed" ],
			description: "Create a custom embed!",
			permission: 200,
		});
	}

	fetchParameters(args)
	{
		if (args.join(" ").startsWith("```"))
		{
			const codeContentRegex = /^```(?:json)?(.+)?```$/gs.exec(args.join(" "))
				, json = JSON.parse(codeContentRegex[1].trim());

			return json;
		}

		let currentKey = "";
		const params = {
			color: "",
			author: {
				name: "",
				url: "",
				icon_url: ""
			},
			title: "",
			url: "",
			description: "",
			image: {
				url: ""
			},
			thumbnail: {
				url: ""
			},
			fields: [],
			timestamp: "",
			footer: {
				icon_url: "",
				text: ""
			}
		};

		args = args.map(a => a.replace(/\\=/g, "{equal}"));

		// split input by '='
		// i.e. 'title=foo author.name=bar' will yield ["title", "foo author.name", "bar"]
		const splitParams = args.join(" ").split("=");
		// initialise 'currentKey' to very first parameter key
		currentKey = splitParams[0];

		// start from 1 because first key is already initialised
		for (let i = 1; i < splitParams.length; i++)
		{
			const split = splitParams[i].split(" ")
				// adjust the value so it doesn't include the next key, which is included because of the way 'splitParams' works
				, value = ((i < splitParams.length - 1) ? split.slice(0, split.length - 1) : split.slice(0, split.length)).join(" ").trim()
				, nextKey = split[split.length - 1];

			const fieldRegex = /field\.(\d+?)\.(name|value|inline)/g
				, fieldMatches = fieldRegex.exec(currentKey);
			if (fieldMatches)
			{
				let fieldID = fieldMatches[1];
				if (fieldID !== i)
					fieldID--;

				const fieldObj = params.fields[fieldID] ? params.fields[fieldID] : {};

				fieldObj[fieldMatches[2]] = value;

				if (params.fields[fieldID])
					params.fields[fieldID] = fieldObj;
				else
					params.fields.push(fieldObj);
			}

			else
			{
				// translate 'something1.something2' into 'params[something1][something2]'
				const keys = currentKey.match(/^(.+?)(?:\.(.+))?$/);
				if (keys[2])
					params[keys[1]][keys[2]] = value;
				else if (keys[1])
					params[keys[1]] = value;
			}

			currentKey = nextKey;
		}

		return params;
	}

	formatParams(params, msg)
	{
		for (let [ key, val ] of Object.entries(params))
		{
			// recursion rules!!
			if ((typeof val) === "object" && val != null)
				params[key] = this.formatParams(val, msg);

			else if ((typeof val) === "string")
			{
				if (key === "image")
				{
					params.image.url = val;
					delete params.image;
					continue;
				}

				else if (key === "icon")
				{
					key = "icon_url";
					params[key] = val;
					delete params.icon;
				}

				if (val === "true")
					params[key] = true;

				// get every instance of {something1.something2}
				const globalRegex = /\{\D+?\}/g
					, globalMatches = globalRegex.exec(val);

				if (!globalMatches)
					continue;

				// for every instance of {something1.something2}
				for (const match of globalMatches)
				{
					// get the individual parts: [something1, something2]
					const regex = /^\{(\D+?)(?:\.(\D+?))(?:\(\))?\}$/g
						, matches = regex.exec(match);

					if (!matches)
						continue;

					// if `msg.something1` exists
					if (matches && msg[matches[1]] && (typeof msg[matches[1]]) !== "function")
					{
						// if `msg.something1.something2` exists
						if (matches[2] && msg[matches[1]][matches[2]] !== undefined && (typeof msg[matches[1]][matches[2]]) !== "function")
						{
							// special case for guild icon url
							if (matches[0].includes("guild.icon"))
							{
								val = val.replace(matches[0], msg.guild.iconURL() || "");
								continue;
							}

							// special case for author avatar url
							else if (matches[0].includes("author.icon") || matches[0].includes("author.avatar"))
							{
								val = val.replace(matches[0], msg.author.displayAvatarURL() || "");
								continue;
							}

							// replace `{something1.something2}` with `msg.something1.something2`
							val = val.replace(matches[0], msg[matches[1]][matches[2]]);
							continue;
						}

						// replace `{something1}` with `msg.something1`
						val = val.replace(matches[0], msg[matches[1]]);
						continue;
					}
				}

				val = val.replace(/\{now\}/gi, new Date());
				val = val.replace(/\{equal\}/gi, "=");

				params[key] = val;
			}
		}

		return params;
	}

	run(msg)
	{
		let embed;
		try
		{
			const settings = this.formatParams(this.fetchParameters(msg.args), msg);
			embed = new MessageEmbed(settings);
		}

		catch (err)
		{
			console.error(err);
			return Promise.resolve(err.message);
		}

		msg.channel.send(embed)
			.catch(err =>
			{
				// err here will likely be a result of an invalid embed body (caused by bad user input)
				msg.channel.send(err.message, { code: true })
					.catch(console.error);
			});
	}
}

module.exports = EmbedGenerator;
