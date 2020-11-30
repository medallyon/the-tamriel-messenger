const { DataTypes } = require("sequelize");

function guild(db)
{
	db.define("Guild", {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		news: {
			type: DataTypes.JSONB,
			allowNull: false
		},
		notes: {
			type: DataTypes.JSONB,
			allowNull: false
		},
		status: {
			type: DataTypes.JSONB,
			allowNull: false
		}
	});
}

module.exports = guild;
