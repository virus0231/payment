const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yoc_transaction', {
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
    did: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tid: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    order_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    visit_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    platform_id: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    charge_id: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    card_fee: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    payment_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gift_aid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    employer_match: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'yoc_transaction',
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
