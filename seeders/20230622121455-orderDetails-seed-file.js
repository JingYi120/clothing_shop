'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = await queryInterface.sequelize.query(
      'SELECT id FROM Orders;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const clothes = await queryInterface.sequelize.query(
      'SELECT id FROM Clothes;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const orderDetails = orders.map((order) => ({
      order_id: order.id,
      clothe_id: clothes[Math.floor(Math.random() * clothes.length)].id,
      quantity: Math.floor(Math.random() * 3) + 1,
      is_order: true,
      created_at: new Date(),
      updated_at: new Date(),
    }))

    await queryInterface.bulkInsert("OrderDetails", [
      ...orderDetails,
      ...Array.from({ length: 10 }, () => ({
        order_id: orders[Math.floor(Math.random() * orders.length)].id,
        clothe_id: clothes[Math.floor(Math.random() * clothes.length)].id,
        quantity: Math.floor(Math.random() * 2) + 1,
        is_order: true,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      ...Array.from({ length: 7 }, () => ({
        order_id: orders[Math.floor(Math.random() * orders.length)].id,
        clothe_id: clothes[Math.floor(Math.random() * clothes.length)].id,
        quantity: 1,
        is_order: false,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderDetails', {})
  }
}
