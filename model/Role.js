// models/Role.js
module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("Role", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: Sequelize.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Role',
    });

    return Role;
};
