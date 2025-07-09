const { Sequelize } = require("sequelize")

try {
    const sequelize = new Sequelize('dashboard', 'usman', 'CrY*#?!$&3002', {
        host: "34.46.208.55",
        // host: "localhost",
        dialect: 'mysql',
        // logging: (sql, timing) => {
        //     console.log('Generated SQL:', sql);
        //     console.log('Bound Values:', timing);
        // }
    });

    module.exports = sequelize
} catch (error) {
    console.log(json({"error while establishing connectiong with database:": error}));
}

// npx sequelize-auto -h 35.194.26.55 -d dashboard -u root -x -p 3306 --dialect mysql -o "./models"