module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        idUser: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        password: {
            type: Sequelize.STRING(300),
            allowNull: true,
            defaultValue: null
        },
        name: {
            type: Sequelize.STRING(200),
            allowNull: true,
            defaultValue: null
        }
    }, {
        tableName: 'User',
    });

    return User;
};
