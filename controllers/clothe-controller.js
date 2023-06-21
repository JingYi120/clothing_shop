const { Clothe, Category, Image } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const clotheController = {
  getClothes: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Clothe.findAndCountAll({
        include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
        },
        include: {
          model: Image,
          where: { isCover: true },
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([clothes,categories]) => {
        res.render('clothes', {
          clothes: clothes.rows,
          categories,
          categoryId,
          pagination: getPagination(limit, page, clothes.count)
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
  },
  getSearch: (req, res, next) => {
    const keyword = req.query.keyword 
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Clothe.findAndCountAll({
      include: Category,
      include: {
        model: Image,
        where: { isCover: true },
      },
      limit,
      offset,
      nest: true,
      raw: true
    })
    .then(clothes => {
      const searchClothes = clothes.rows.filter(clothe => {
        return clothe.name.toLowerCase().includes(keyword.trim().toLowerCase())
      })
      const count = searchClothes.length
      console.log('count',count)

      res.render('search', {
        clothes: searchClothes,
        pagination: getPagination(limit, page, count),
        keyword
      })
    })
    .catch(err => next(err))
  }

}

module.exports = clotheController