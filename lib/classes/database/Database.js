const { Sequelize } = require("sequelize")
	, models = require("./models");

class Database extends Sequelize
{
	_createAssociations()
	{
		const { NewsTable, NewsArticle } = this.models;

		NewsTable.hasMany(NewsArticle);
		NewsArticle.belongsTo(NewsTable);
	}

	async _validateExistingTables()
	{
		const { NewsTable } = this.models;

		NewsTable.bulkCreate([
			{ language: "en-us" },
			{ language: "de" },
			{ language: "fr" }
		], {
			ignoreDuplicates: true
		}).catch(console.error);
	}

	constructor(name, user, password, options)
	{
		super(name, user, password, Object.assign(options || {}, {
			dialect: "postgres",
			logging: false
		}));

		for (const model of Object.values(models))
			model(this);

		this.sync();

		this._createAssociations();
		this._validateExistingTables();
	}
}

module.exports = Database;
