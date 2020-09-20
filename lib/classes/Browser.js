const Discord = require("discord.js")
	, generateRandomColor = require("../utils/generateRandomColor.js");

const EMOJI = {
	nav: {
		first: "⏮",
		skipPrevious: "⏪",
		previous: "◀",
		next: "▶",
		skipNext: "⏩",
		last: "⏭"
	},
	numbers: [
		"1⃣",
		"2⃣",
		"3⃣",
		"4⃣",
		"5⃣",
	]
};

class Page extends Discord.MessageEmbed
{
	constructor(browser, items, embedData = {})
	{
		super(embedData);

		this.browser = browser;
		this.items = items;

		this.setColor(generateRandomColor());

		for (let i = 0; i < this.items.length; i++)
		{
			const item = this.items[i];
			this.addField(`${EMOJI.numbers[i]} ${item.name}`, item.description.length > 255 ? `${item.description.slice(0, 255)}...` : item.description);
		}
	}
}

class Browser extends Array
{
	static get COLLECTOR_FILTER()
	{
		return (reaction, user) => [ "⏮", "⏪", "◀", "▶", "⏩", "⏭", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣" ].some(x => x === reaction.emoji.name && user.id !== reaction.client.user.id);
	}

	static get COLLECTOR_OPTIONS()
	{
		return {
			time: 45000,
			max: 1
		};
	}

	get lastIndex()
	{
		return this.length - 1;
	}

	get first()
	{
		return this[0];
	}

	get last()
	{
		return this[this.lastIndex];
	}

	get currentPage()
	{
		return this[this.pointer];
	}

	/* USAGE
	  new Browser(msg || channel, [{ name, description, content(browserMsg, index) }, ...], Embed() = {})
	  The `content` function, which passes args (msg, index), in each `item` object is the content that is displayed when the user selects this item
	 */
	constructor(existingMessageOrChannel, items, defaultPageEmbed = {})
	{
		super();

		this.pointer = 0;
		this.message = null;
		this.channel = null;
		this.collector = null;
		this.doneReacting = false;

		if (!existingMessageOrChannel)
			throw new Error("Browser requires at least an existing message or a channel.");

		if (existingMessageOrChannel instanceof Discord.Message)
		{
			this.message = existingMessageOrChannel;
			this.channel = this.message.channel;
		}

		else if (existingMessageOrChannel instanceof Discord.TextChannel || existingMessageOrChannel instanceof Discord.DMChannel)
			this.channel = existingMessageOrChannel;

		else 
			throw new Error("Browser requires at least an existing message or a channel.");

		if (!items || (items && !items.length))
			throw new Error("Browser requires the 'items' argument.");

		let count = 0;
		for (let page = 0; page < Math.ceil(items.length / 5); page++)
			this.push(new Page(this, items.slice(count, count += 5), defaultPageEmbed));

		this._resolveMessage()
			.then(() =>
			{
				this._setupReactionCollector();
				this._addReactions()
					.catch(console.error);
			}).catch(console.error);
	}

	_resolveMessage()
	{
		return new Promise((resolve, reject) =>
		{
			if (this.message)
			{
				this.channel = this.message.channel;
				return this.updateMessage()
					.then(resolve)
					.catch(reject);
			}

			if (!this.currentPage.footer)
				this.currentPage.footer = {};
			this.currentPage.footer.text = `Viewing page ${this.pointer + 1}/${this.length} | Use the emojis for navigation.`;

			this.channel.send(this.currentPage)
				.then(msg =>
				{
					this.message = msg;
					resolve(this.message);
				}).catch(reject);
		});
	}

	_addReactions()
	{
		return new Promise(async (resolve, reject) =>
		{
			try
			{
				// add previous navigation reactions
				if (this.length > 1)
				{
					if (this.length > 5)
					{
						if (!this.doneReacting)
							await this.message.react(EMOJI.nav.first);
						if (!this.doneReacting)
							await this.message.react(EMOJI.nav.skipPrevious);
					}

					if (!this.doneReacting)
						await this.message.react(EMOJI.nav.previous);
				}

				// add reactions for current page's items
				for (let i = 0; i < this.currentPage.items.length; i++)
				{
					if (!this.doneReacting && this.currentPage.items[i].content)
						await this.message.react(EMOJI.numbers[i]);
				}

				// add next navigation reactions
				if (this.length > 1)
				{
					if (!this.doneReacting)
						await this.message.react(EMOJI.nav.next);

					if (this.length > 5)
					{
						if (!this.doneReacting)
							await this.message.react(EMOJI.nav.skipNext);
						if (!this.doneReacting)
							await this.message.react(EMOJI.nav.last);
					}
				}
			}

			catch (err)
			{
				reject(err);
			}

			resolve();
		});
	}

	_setupReactionCollector()
	{
		if (this.collector && this.collector instanceof Discord.ReactionCollector)
		{
			this.collector.stop();
			this.collector = null;
		}

		this.collector = new Discord.ReactionCollector(this.message, Browser.COLLECTOR_FILTER, Browser.COLLECTOR_OPTIONS);

		this.collector.on("collect", reaction =>
		{
			if (EMOJI.numbers.some(x => x === reaction.emoji.name))
			{
				this.doneReacting = true;

				let index = EMOJI.numbers.indexOf(reaction.emoji.name)
					, item = this.currentPage.items[index];

				if ((typeof item.content) === "function")
					item.content = item.content(this.message, index);

				if (item.content instanceof Promise)
				{
					item.content
						.then(embed =>
						{
							this.message.edit(embed)
								.catch(console.error);
						})
						.catch(err =>
						{
							console.error(err);

							this.message.edit(`Something went wrong while resolving **${item.name}**. If this keeps happening, contact Medallyon.`, { embed: null })
								.catch(console.error);
						});
				}

				else if ((typeof item.content) === "string" || item.content instanceof Discord.MessageEmbed)
					this.message.edit(item.content, { embed: (!(item.content instanceof Discord.MessageEmbed) ? null : item.content)})
						.catch(console.error);

				this.message.reactions.removeAll()
					.catch(console.error);
			}

			else
			{
				if (reaction.emoji.name === EMOJI.nav.first)
					this.set(0)
						.catch(console.error);

				else if (reaction.emoji.name === EMOJI.nav.skipPrevious)
					this.previous(Math.max(5, this.length * .1))
						.catch(console.error);

				else if (reaction.emoji.name === EMOJI.nav.previous)
					this.previous()
						.catch(console.error);

				else if (reaction.emoji.name === EMOJI.nav.next)
					this.next()
						.catch(console.error);

				else if (reaction.emoji.name === EMOJI.nav.skipNext)
					this.next(Math.max(5, this.length * .1))
						.catch(console.error);

				else if (reaction.emoji.name === EMOJI.nav.last)
					this.set(this.lastIndex)
						.catch(console.error);

				this._setupReactionCollector();
			}
		});

		this.collector.on("end", (collected, reason) =>
		{
			this.collector = null;

			if (reason === "limit")
				this._clearUserReactions();

			else if (reason === "time")
				this.message.reactions.removeAll()
					.catch(console.error);
		});
	}

	_clearUserReactions()
	{
		for (const reaction of this.message.reactions.cache.values())
		{
			// snowflake: who knows
			// reaction: .emoji, .users
			// reaction.emoji: .id (snowflake, nullable), .identifier, .name, .toString()
			// reaction.users: .cache, .fetch({limit}), remove(user)

			reaction.users.fetch()
				.then(users =>
				{
					if (users.size === 1)
						return;

					for (const user of users.values())
					{
						if (user.id === this.message.client.user.id)
							continue;

						if (reaction.users.cache.has(user.id))
							reaction.users.remove(user.id)
								.catch(console.error);
					}
				}).catch(console.error);
		}
	}

	set(index)
	{
		return new Promise((resolve, reject) =>
		{
			if (!index && typeof index !== "number")
				return reject("Browser.set requires the 'index' argument.");

			if (index < 0)
				index = 0;
			else if (index > this.lastIndex)
				index = this.lastIndex;

			this.pointer = index;

			this.updateMessage()
				.then(resolve)
				.catch(reject);
		});
	}

	previous(pages = 1)
	{
		return new Promise((resolve, reject) =>
		{
			if ((this.pointer -= pages) < 0)
				this.pointer = this.length + this.pointer;

			this.updateMessage()
				.then(resolve)
				.catch(reject);
		});
	}

	next(pages = 1)
	{
		return new Promise((resolve, reject) =>
		{
			if ((this.pointer += pages) > this.lastIndex)
				this.pointer = this.pointer - this.length;

			this.updateMessage()
				.then(resolve)
				.catch(reject);
		});
	}

	updateMessage()
	{
		return new Promise((resolve, reject) =>
		{
			this.message.edit(this.currentPage.setFooter(`Viewing page ${this.pointer + 1}/${this.length} | Use the emojis for navigation.`))
				.then(newMsg =>
				{
					this.message = newMsg;
					this._clearUserReactions(true);
					resolve();
				}).catch(reject);
		});
	}
}

module.exports = Browser;
