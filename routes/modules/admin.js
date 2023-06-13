const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.get('/clothes', adminController.getClothes)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.use('/', (req, res) => res.redirect('/admin/clothes'))

module.exports = router