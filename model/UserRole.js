// models/UserRole.js

module.exports = (sequelize, Sequelize) => {
    const UserRole = sequelize.define("UserRole", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'User', 
                key: 'idUser' 
            }
        },
        roleId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Role',
                key: 'id' 
            }
        }
    }, {
        tableName: 'UserRole',
        indexes: [
            {
                name: 'fk_UserRole_User_idx',
                fields: ['userId']
            },
            {
                name: 'fk_UserRole_Role_idx',
                fields: ['roleId']
            }
        ]
    });

    return UserRole;
};
