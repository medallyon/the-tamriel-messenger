const { DataTypes } = require("sequelize");

function esoNewsArticle(db)
{
	db.define("NewsArticle", {
		url: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		image: {
			type: DataTypes.TEXT, // url
			allowNull: true
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		}
	});
}

module.exports = esoNewsArticle;
