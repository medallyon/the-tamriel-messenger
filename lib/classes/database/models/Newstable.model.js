const { DataTypes } = require("sequelize");

function esoNewsTable(db)
{
	db.define("NewsTable", {
		language: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		}
	});
}

module.exports = esoNewsTable;
