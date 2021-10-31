function articleSelect(interaction)
{
	
}

module.exports = articleSelect;

const EventMiddleware = require(join(__libdir, "classes", "EventMiddleware.js"));

class ArticleSelect extends EventMiddleware
{
	constructor(client)
	{
		super(client);
	}

	/**
	 * @param {SelectMenuInteraction} interaction
	 */
	trigger(interaction)
	{
		if (!interaction.customId?.endsWith("article_select"))
			return;

		const language = interaction.customId.split("_")[0]
			, articles = this.client.data.news[language].cache
			, selectedID = interaction.values[0];

		interaction.update({ content: articles.get(selectedID).link, components: [] })
			.catch(console.error);
	}
}

module.exports = ArticleSelect;

