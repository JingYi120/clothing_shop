const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

router.get('/clothes', adminController.getClothes)
router.get('/categories', categoryController.getCategories)
router.use('/', (req, res) => res.redirect('/admin/clothes'))

module.exports = router