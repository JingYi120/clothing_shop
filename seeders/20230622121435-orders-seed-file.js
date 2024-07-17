"use strict"
const faker = require("faker")
const dayjs = require("dayjs")

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users;", {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })

    await queryInterface.bulkInsert("Orders", [
      ...Array.from({ length: 3 }, (_, i) => ({
        user_id: users[i % users.length].id,
        is_done: false,
        is_order: false,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        user_id: users[i % users.length].id,
        note: faker.lorem.text(),
        is_done: false,
        is_order: true,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      ...Array.from({ length: 24 }, (_, i) => {
        const currentYear = new Date().getFullYear()
        const randomMonth = Math.floor(Math.random() * 12)
        const randomDay = Math.floor(Math.random() * 28) + 1

        const createdAt = dayjs()
          .year(currentYear)
          .month(randomMonth)
          .date(randomDay)
          .hour(Math.floor(Math.random() * 24))
          .minute(Math.floor(Math.random() * 60))
          .second(Math.floor(Math.random() * 60))
          .toDate()

        const updatedAt = dayjs(createdAt).add(1, "day").toDate()

        return {
          user_id: users[i % users.length].id,
          note: faker.lorem.text(),
          is_done: true,
          is_order: true,
          created_at: createdAt,
          updated_at: updatedAt,
        }
      }),
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Orders", {})
  },
}
