const { Clothe, Category, Image } = require('../models')

const clotheController = {
  getClothes: (req, res, next) => {
    return Clothe.findAll({
      include: [Category, Image],
      nest: true,
      raw: true
    }).then(clothes => {
      const data = clothes.map(clothe => ({
        ...clothe,
        description: clothe.description.substring(0, 50)
      }))
      return res.render('clothes', {
        clothes: data
      })
    }).catch(err => next(err))
  }
}

module.exports = clotheController