'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const clothes = await queryInterface.sequelize.query(
      'SELECT id FROM Clothes;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Images',[
      ...Array.from({ length: 200 }, (_,i) => ({
        name: `https://loremflickr.com/320/240/clothe/?lock=${Math.random() * 100}`,
        is_cover: false,
        clothe_id: clothes[i % clothes.length].id,
        created_at: new Date(),
        updated_at: new Date()
      })),
      ...Array.from({ length: 50 }, (_, i) => ({
        name: `https://loremflickr.com/320/240/clothe/?lock=${Math.random() * 100}`,
        is_cover: true,
        clothe_id: clothes[i % clothes.length].id,
        created_at: new Date(),
        updated_at: new Date()
      }))]
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Images', {})
  }
}
