const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yoc_client', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    client_logo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    api_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    secret_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    live_stripe_key: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    test_stripe_key: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    isproduction: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    isremote: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    website_url: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'yoc_client',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
