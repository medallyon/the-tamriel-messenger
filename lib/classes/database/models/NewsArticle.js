const Model = require("../Model.js");

/**
 * @typedef {Object} NewsArticleData
 * @param {string} link
 * @param {string} language
 * @param {Date} date
 * @param {string} title
 * @param {string} [description=""]
 * @param {string} [imageURL=""]
 */

class NewsArticle extends Model
{
	/**
	 * The regular expression to retrieve an article's post ID.
	 * @returns {RegExp}
	 */
	static get POST_ID_REGEX() { return /(?:https?:\/\/)?(?:w{3}\.)?elderscrollsonline\.com\/(?:en-us|de|fr)\/news\/post\/(\d+)/; }

	/**
	 * Generates a link for the provided NewsArticle.
	 * @param {NewsArticle} article
	 */
	static getLinkFromArticle(article)
	{
		return `https://elderscrollsonline.com/${article.language}/news/post/${article.id}`;
	}

	/**
	 * @param {NewsArticleData} data
	 */
	constructor(data)
	{
		const id = data.link.match(NewsArticle.POST_ID_REGEX)[1];
		super(id, data);

		/**
		 * @type {string}
		 */
		this.link = data.link;

		/**
		 * @type {string}
		 */
		this.language = data.language;

		/**
		 * @type {Date}
		 */
		this.date = new Date(data.date);

		/**
		 * @type {string}
		 */
		this.title = data.title;

		/**
		 * @type {string}
		 */
		this.description = data.description || "";

		/**
		 * @type {string}
		 */
		this.imageURL = data.imageURL || "";
	}

	toJSON()
	{
		return {
			id: this.id,
			link: this.link,
			language: this.language,
			date: this.date.toUTCString(),
			title: this.title,
			description: this.description,
			imageURL: this.imageURL
		};
	}
}

module.exports = NewsArticle;
