const { Clothe, Category } = require('../models')

const adminController = {
  getClothes: (req, res, next) => {
    Clothe.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(clothes => res.render('admin/clothes', { clothes }))
      .catch(err => next(err))
  },
  createClothe: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-clothe', { categories }))
      .catch(err => next(err))
  }, 
  postClothe: (req, res, next) => {
    const { name, description, price, categoryId} = req.body
    if (!name || !description || !price) throw new Error('All fields are required!')
        Clothe.create({
        name,
        description,
        price,
        categoryId
      })
      .then(() => {
        req.flash('success_messages', 'Item was successfully created')
        res.redirect('/admin/clothes')
      })
      .catch(err => next(err))
  },
  getClothe: (req, res, next) => {
    Clothe.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(clothe => {
        if (!clothe) throw new Error("Item didn't exist!")
        res.render('admin/clothe', { clothe })
      })
      .catch(err => next(err))
  }, 
  editClothe: (req, res, next) => {
    return Promise.all([
      Clothe.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true }),
    ])
    
      .then(([clothe, categories]) => {
        if (!clothe) throw new Error("Item didn't exist!")
        res.render('admin/edit-clothe', { clothe, categories })
      })
      .catch(err => next(err))
  },
  putClothe: (req, res, next) => {
    const { name, description, price, categoryId } = req.body
    if (!name || !description || !price) throw new Error('All fields are required!')
    Clothe.findByPk(req.params.id)
      .then(clothe => {
        if (!clothe) throw new Error("Item didn't exist!")
        return clothe.update({
          name,
          description,
          price,
          categoryId
        })
      })
      .then(() => {
        req.flash('success_messages', 'Item was successfully to update')
        res.redirect('/admin/clothes')
      })
      .catch(err => next(err))
  },
  deleteClothe: (req, res, next) => {
    return Clothe.findByPk(req.params.id)
      .then(clothe => {
        if (!clothe) throw new Error("Item didn't exist!")
        return clothe.destroy()
      })
      .then(() => res.redirect('/admin/clothes'))
      .catch(err => next(err))
  }
}

module.exports = adminController