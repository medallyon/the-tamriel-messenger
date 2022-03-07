/**
 * @param {SelectMenuInteraction} interaction
 */
function articleSelect(interaction)
{
	if (!interaction.customId?.endsWith("article_select"))
		return;

	const language = interaction.customId.split("_")[0]
		, articles = this.data.news[language].cache
		, selectedID = interaction.values[0];

	interaction.update({ content: articles.get(selectedID).link, components: [] })
		.catch(console.error);
}

module.exports = articleSelect;
