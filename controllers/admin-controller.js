const { Clothe } = require('../models')

const adminController = {
  getClothes: (req, res, next) => {
    Clothe.findAll({
      raw: true
    })
      .then(clothes => res.render('admin/clothes', { clothes }))
      .catch(err => next(err))
  },
  createClothe: (req, res) => {
    return res.render('admin/create-clothe')
  },
  postClothe: (req, res, next) => {
    const { name, description, price } = req.body
    if (!name || !description || !price) throw new Error('All fields are required!')
    Clothe.create({ 
      name,
      description,
      price
    })
      .then(() => {
        req.flash('success_messages', 'Item was successfully created')
        res.redirect('/admin/clothes')
      })
      .catch(err => next(err))
  },
  getClothe: (req, res, next) => {
    Clothe.findByPk(req.params.id, {
      raw: true
    })
      .then(clothe => {
        if (!clothe) throw new Error("Item didn't exist!")
        res.render('admin/clothe', { clothe })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController