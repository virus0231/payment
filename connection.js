const { Sequelize } = require("sequelize")

try {
    const sequelize = new Sequelize('dashboard', 'usman', 'CrY*#?!$&3002', {
        host: "34.46.208.55",
        dialect: 'mysql',
    });

    module.exports = sequelize
} catch (error) {
    console.log(json({"error while establishing connectiong with database:": error}));
}