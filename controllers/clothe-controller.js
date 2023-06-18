const { Clothe, Category, Image } = require('../models')

const clotheController = {
  getClothes: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Clothe.findAll({
        include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
        },
        include: {
          model: Image,
          where: { isCover: true },
        },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([clothes,categories]) => {
        res.render('clothes', {
          clothes,
          categories,
          categoryId
        })
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