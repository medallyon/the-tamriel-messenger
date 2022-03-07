const { Constants } = require("discord.js")
	, { SlashCommand, SelectMenuHandler } = require("@medallyon/djs-framework")
	, { readJSON } = require("fs-extra")
	, { compareTwoStrings: compare } = require("string-similarity")
	, { DefaultEmbed } = require("../utils");

const COLORS_QUALITY = [
	"#FFF",
	"#2DC50E",
	"#3A92FF",
	"#A02EF7",
	"#EECA2A",
	"#FF8200"
];

class EsoItem extends SlashCommand
{
	#items = null;
	#itemKeys = null;

	get items()
	{
		return this.#items;
	}

	async #fetchItems()
	{
		const items = await readJSON(join(__datadir, "items.json"));
		this.#items = new Map();

		for (const item of items)
			this.#items.set(item.name.toLowerCase(), item);

		this.#itemKeys = Array.from(this.#items.keys());
	}

	#generateEmbed(item)
	{
		return new DefaultEmbed()
			.setColor(COLORS_QUALITY[item.quality - 1])
			.setImage(`https://esoitem.uesp.net/itemLinkImage.php?summary&itemid=${item.id}&level=${item.level}&quality=${item.quality}`)
			.setAuthor({
				name: item.name,
				url: `https://esoitem.uesp.net/itemLink.php?summary&itemid=${item.id}`
			});
	}

	/**
	 * @param {DiscordClient} client
	 */
	constructor(client)
	{
		super(client, {
			name: "item",
			description: "Find an Item in the game.",
			example: "name:Cured Kwama Leggings",
			interaction: {
				options: [
					{
						type: Constants.ApplicationCommandOptionTypes.STRING,
						name: "name",
						description: "The name of the Item.",
						required: true
					},
					{
						type: Constants.ApplicationCommandOptionTypes.STRING,
						name: "level",
						description: "The Level of the Item. If veteran, prepend with CP.",
						required: false
					},
					{
						type: Constants.ApplicationCommandOptionTypes.INTEGER,
						name: "quality",
						description: "The Quality of the Item.",
						required: false,
						choices: [
							{
								name: "Normal (White)",
								value: 1
							},
							{
								name: "Fine (Green)",
								value: 2
							},
							{
								name: "Superior (Blue)",
								value: 3
							},
							{
								name: "Epic (Purple)",
								value: 4
							},
							{
								name: "Legendary (Gold)",
								value: 5
							},
							{
								name: "Mythic (Orange)",
								value: 6
							}
						]
					},
					{
						type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
						name: "ephemeral",
						description: "Whether the Item should be shown only to you.",
						required: false
					}
				]
			}
		});

		this.SELECT_MENU_ID = "SELECT_ITEM";
		this.selectHandler = new SelectMenuHandler(this.SELECT_MENU_ID, interaction =>
		{
			const [ name, level, quality ] = interaction.values[0].split("_")
				, item = this.#items.get(name);

			interaction.update({
				content: null, components: [],
				embeds: [ this.#generateEmbed(Object.assign({}, item, { level, quality })) ]
			}).catch(console.error);
		});

		this.#fetchItems();
	}

	getMatches(name, amount = 5)
	{
		name = name.toLowerCase();

		let matches = [];
		for (const n of this.#itemKeys)
		{
			const rating = compare(name, n);

			if (rating === 1)
				return [{ item: this.#items.get(n), rating }];

			if (rating >= .35 || n.split(" ").includes(name))
				matches.push({ item: this.#items.get(n), rating });

			if (matches.length > amount)
				matches.splice(matches.reduce((acc, cur, i, arr) => arr[acc].rating < arr[i].rating ? acc : i, 1), 1);
		}

		return matches.sort((a, b) => b.rating - a.rating);
	}

	/**
	 * @param {CommandInteraction} interaction
	 */
	async run(interaction)
	{
		const opts = interaction.options
			, item = {
				name: opts.get("name").value,
				level: opts.get("level")?.value || "CP160",
				quality: opts.get("quality")?.value || 5
			};

		// @TODO: Run 'deferReply' at the same time as 'getMatches' since both methods may be lengthy
		await interaction.deferReply({ ephemeral: opts.getBoolean("ephemeral")?.value || false });

		const matches = this.getMatches(item.name);
		if (!matches.length)
		{
			return await interaction.followUp({
				content: `No matches could be found for \`${item.name}\`.`
			});
		}
		
		if (matches.length === 1)
			return await interaction.followUp({
				embeds: [ this.#generateEmbed(Object.assign({}, item, matches[0].item)) ]
			});

		const itemSelect = {
			type: Constants.MessageComponentTypes.ACTION_ROW,
			components: [
				{
					"type": 3,
					"custom_id": this.SELECT_MENU_ID,
					"placeholder": "Pick an Item",
					"options": matches.map(x => ({
						label: x.item.name,
						value: `${x.item.name.toLowerCase()}_${item.level}_${item.quality}`
					}))
				}
			]
		};

		if (matches.length > 1)
		{
			return await interaction.followUp({
				content: "Please choose the item that you want to display:",
				components: [ itemSelect ]
			});
		}
	}
}

module.exports = EsoItem;
