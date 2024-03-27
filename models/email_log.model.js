const { DataTypes } = require("sequelize");
const db = require("../configs/db.config");

const EmailLog = db.sequelize.define(
  "email_log",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    recipient: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    template_name: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    message_id: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      required: true,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "email_log",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = EmailLog;
