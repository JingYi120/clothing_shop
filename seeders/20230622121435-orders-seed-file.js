'use strict'
const faker = require('faker');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Orders', [
      ...Array.from({ length: 3 }, (_, i) => ({
        user_id: users[i % users.length].id,
        is_done: false,
        is_order: false,
        created_at: new Date(),
        updated_at: new Date()
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        user_id: users[i % users.length].id,
        note: faker.lorem.text(),
        is_done: false,
        is_order: true,
        created_at: new Date(),
        updated_at: new Date()
      })),
      ...Array.from({ length: 9 }, (_, i) => ({
        user_id: users[i % users.length].id,
        note: faker.lorem.text(),
        is_done: true,
        is_order: true,
        created_at: new Date(),
        updated_at: new Date()
      }))
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', {})
  }
}