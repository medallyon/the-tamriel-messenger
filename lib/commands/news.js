const { Constants } = require("discord.js")
	, { DiscordCommand } = require("@medallyon/djs-framework");

class News extends DiscordCommand
{
	static get LANGUAGE_REGEX() { return /^(?:(en)(?:(?:glish)|-(?:us|uk))?|(de)(?:utsch)?|(fr)(?:(?:ench)|(?:an(?:ç|c)ais))?|(ger)(?:man)?)$/i; }
	static get NUMBER_REGEX() { return /^[1-5]$/; }
	static get ESO_NEWS_ICON() { return "http://i.imgur.com/qqvt2UX.png"; }
	static get ESO_NEWS_URL()
	{
		return {
			"en-us": "https://www.elderscrollsonline.com/en-us/news",
			"de": "https://www.elderscrollsonline.com/de/news",
			"fr": "https://www.elderscrollsonline.com/fr/news"
		};
	}
	static get ESO_NEWS_LANGUAGE()
	{
		return {
			"en-us": "English",
			"de": "Deutsch",
			"fr": "Français"
		};
	}

	constructor(client)
	{
		super(client, {
			name: "news",
			description: "Display and choose from the latest news in the ESO Universe.",
			interaction: {
				options: [
					{
						type: Constants.ApplicationCommandOptionTypes.STRING,
						name: "language",
						description: "The language you would like to display the articles in.",
						required: false,
						choices: Array.from(Object.entries(News.ESO_NEWS_LANGUAGE))
							.map(x => ({
								name: x[1],
								value: x[0]
							}))
					}
				]
			}
		});

		this.client.data.news.on("value", article =>
		{
			this._distribute(article);
		});
	}

	async _distribute(article)
	{
		const guilds = Array.from(this.client.data.guilds.cache.values());

		const subscriptions = [];
		for (const guild of guilds)
			for (const sub of guild.subscriptions)
				if (sub.type === "news")
					subscriptions.push(sub);

		const channels = [];
		for (const sub of subscriptions)
			for (const channel of sub.channels)
				if (channel.language === article.language)
					channels.push(channel);

		for (let subscriptionChannel of channels)
		{
			try
			{
				const channel = await this.client.channels.fetch(subscriptionChannel.id);
				if (channel == null)
					continue;

				let role;
				try
				{
					role = await channel.guild.roles.fetch(subscriptionChannel.mention);
				}

				catch (error)
				{
					console.warn(error);
				}

				const msg = await channel.send(`**${article.title}**\n${subscriptionChannel.mention != null && role != null ? role?.toString() : ""} ${article.link}`);
				if (subscriptionChannel.publish && msg.crosspostable)
					await msg.crosspost();
			}

			catch (error)
			{
				console.error(`DistributionError in channel (#${subscriptionChannel.id}): ${error}`);
			}
		}
	}

	_display(interaction)
	{
		const language = interaction.options.getString("language") || "en-us"
			, articles = this.client.data.news[language].cache
			, articleRow = {
				type: Constants.MessageComponentTypes.ACTION_ROW,
				components: [
					{
						"type": 3,
						"custom_id": `${language}_article_select`,
						"placeholder": "Pick an article",
						"options": Array.from(articles.values()).sort((a, b) => b.date - a.date).map(x => ({
							label: x.title,
							description: x.description.length <= 100 ? x.description : `${x.description.slice(0, 99) + "…"}`,
							value: x.id.toString()
						}))
					}
				]
			};

		interaction.reply({ content: "**Please select the article you want to display:**", components: [ articleRow, ] }).catch(console.error);
	}

	/**
	 * @param {CommandInteraction} interaction
	 */
	async _subscribe(interaction)
	{
		let guildData = this.client.data.guilds.cache.get(interaction.guildId);
		if (guildData == null)
		{
			await new (require(join(__libdir, "events", "middleware", "guildCreate", "guildInitialization.js")))(this.client).trigger({ id: interaction.guildId });
			guildData = this.client.data.guilds.cache.get(interaction.guildId);
		}

		const subscriptions = guildData.subscriptions
			, subIndex = subscriptions.some(sub => sub.type === "news")
				? subscriptions.findIndex(sub => sub.type === "news")
				: subscriptions.push({
					guildID: interaction.guildId,
					type: "news",
					channels: []
				}) - 1
			, sub = subscriptions[subIndex];

		const channelIndex = sub.channels.some(c => c.id === interaction.channelId)
			? sub.channels.findIndex(c => c.id === interaction.channelId)
			: sub.channels.push({}) - 1;

		sub.channels[channelIndex] = {
			id: interaction.channelId,
			language: interaction.options.getString("language"),
			mention: interaction.options.getRole("mention")?.id || null
		};

		this.client.data.guilds.update(guildData)
			.then(() =>
			{
				interaction.reply({
					content: `This channel is now subscribed to news articles for \`${interaction.options.getString("language")}\`!`,
					ephemeral: true
				}).catch(console.error);
			}).catch(console.error);
	}

	_unsubscribe(interaction)
	{
		// TODO: Currently deletes the whole guild object from firebase when executed
		this.client.data.guilds.delete(interaction.guildId)
			.then(() =>
			{
				interaction.reply({
					content: "This channel has been unsubscribed from all news articles.",
					ephemeral: true
				}).catch(console.error);
			}).catch(console.error);
	}

	run(interaction)
	{
		this._display(interaction);
	}
}

module.exports = News;
