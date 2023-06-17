const { Clothe, Category, Image } = require('../models')

const clotheController = {
  getClothes: (req, res, next) => {
    return Clothe.findAll({
      include: [Category, Image],
      nest: true,
      raw: true
    })
    .then(clothes => {
        res.render('clothes', {clothes})
    })
    .catch(err => next(err))
  }, 
  getClothe: (req, res, next) => {
    return Clothe.findByPk(req.params.id, {
      include: [Category, Image],
    })
    .then(clothe => {
      if (!clothe) throw new Error("Item didn't exist!")
      res.render('clothe', { clothe: clothe.toJSON() })
    })
    .catch(err => next(err))
  }

}

module.exports = clotheController