const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/index')// your Sequelize instance

const EmailLog = sequelize.define('EmailLog', {
    to_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'email_logs',
    timestamps: false
});

module.exports = {
    EmailLog,
}
