const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yoc_appeal', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ishome_v: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    goal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isfooter: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isdonate: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isother: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isdropdown: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isquantity: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isrecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    recurring_interval: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isassociate: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active','inactive'),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'yoc_appeal',
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
