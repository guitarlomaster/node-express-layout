module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("accounts", "about", {
            type: Sequelize.STRING
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("accounts", "about")
    }
};
