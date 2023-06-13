'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Images', 'clothe_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Clothes',
        key: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Images', 'clothe_id')
  }
}
