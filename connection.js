const { Sequelize } = require("sequelize")

try {
    const sequelize = new Sequelize('dashboard', 'usman', 'CrY*#?!$&3002', {
        host: "34.46.208.55",
        dialect: 'mysql',
    });

    // const sequelize = new Sequelize('yoc', 'root', '', {
    //     host: "localhost",
    //     dialect: 'mysql',
    //     logging: false
    // });

    module.exports = sequelize
} catch (error) {
    console.log(json({"error while establishing connectiong with database:": error}));
}

// npx sequelize-auto -h 34.46.208.55 -d dashboard -u usman -x CrY*#?!$&3002 -p 3306 --dialect mysql -o "./models"