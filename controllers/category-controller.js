const { Category } = require('../models')

const categoryController = {
  getCategories: async(req, res, next) => {
    try{
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
      res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  }, 
  postCategory: async(req, res, next) => {
    try{
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      const categories = await Category.findAll({ raw: true })
      const isCategoryExists = categories.some(cat => cat.name === name);
      if (isCategoryExists) {
        throw new Error('This category has already been created.');
      }
      await Category.create({ name })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async(req, res, next) => {
    try{
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')

      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category doesn't exist!")

      const categories = await Category.findAll({ raw: true })
      const isCategoryExists = categories.some(cat => cat.name === name && cat.id.toString() !== req.params.id);
      if (isCategoryExists) {
        throw new Error('This category has already been created.');
      }

      await category.update({ name })

      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async(req, res, next) => {
    try{
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category didn't exist!")

      await category.destroy()
      
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController