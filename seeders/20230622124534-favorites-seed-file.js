'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const clothes = await queryInterface.sequelize.query(
      'SELECT id FROM Clothes;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Favorites', 
      Array.from({ length: 25 }, () => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        clothe_id: clothes[Math.floor(Math.random() * clothes.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      })))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Favorites', {})
  }
}
