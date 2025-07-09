const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yoc_attribution_journey', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'yoc_client',
        key: 'id'
      }
    },
    master_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    visitor_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ga_client_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ga_session_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    refer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    utm_source: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    utm_medium: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    utm_campaign: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    utm_term: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    utm_content: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    landing_page: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    browser_detail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cart: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billing_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'yoc_attribution_journey',
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
      {
        name: "client_id",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
    ]
  });
};
