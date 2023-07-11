const { Clothe, Category, Image, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const clotheController = {
  getClothes: async(req, res, next) => {
    try{
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const [clothes, categories] = await Promise.all([
        Clothe.findAndCountAll({
          include: Category,
          where: { ...categoryId ? { categoryId } : {} },
          include: { model: Image, where: { isCover: true }},
          limit,
          offset,
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])
  
      const favoritedClothesId = req.user && req.user.FavoritedClothes.map(fi => fi.id)
      const data = clothes.rows.map(i => ({
        ...i,
        isFavorited: favoritedClothesId.includes(i.id)
      }))

      res.render('clothes', {
        clothes: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, clothes.count)
      })
    } catch (err) {
      next(err)
    }
  }, 
  getClothe: async(req, res, next) => {
    try{
      const clothe = await Clothe.findByPk(req.params.id, {
        include: [
          Category,
          Image,
          { model: User, as: 'FavoritedUsers' }],
      })
      if (!clothe) throw new Error("Item didn't exist!")
      const isFavorited = clothe.FavoritedUsers.some(f => f.id === req.user.id)
      res.render('clothe', {
        clothe: clothe.toJSON(),
        isFavorited
      })
    } catch (err) {
      next(err)
    }
  },
  getSearch: async(req, res, next) => {
    try{
      const keyword = req.query.keyword
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const clothes = await Clothe.findAndCountAll({
        include: Category,
        include: { model: Image, where: { isCover: true }},
        limit,
        offset,
        nest: true,
        raw: true
      })

      const searchClothes = clothes.rows.filter(clothe => {
        return clothe.name.toLowerCase().includes(keyword.trim().toLowerCase())
      })
      const count = searchClothes.length

      res.render('search', {
        clothes: searchClothes,
        pagination: getPagination(limit, page, count),
        keyword
      })
    } catch (err) {
      next(err)
    }
  }

}

module.exports = clotheController