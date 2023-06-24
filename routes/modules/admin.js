const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const imageController = require('../../controllers/​​image-controller')
const upload = require('../../middleware/multer')

router.get('/clothes/create', adminController.createClothe)
router.get('/clothes/:id/edit', adminController.editClothe)
router.get('/clothes/:id', adminController.getClothe)
router.put('/clothes/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'image', maxCount: 5 }]), adminController.putClothe)
router.delete('/clothes/:id', adminController.deleteClothe)
router.get('/clothes', adminController.getClothes)
router.post('/clothes', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'image', maxCount: 5 }]), adminController.postClothe)

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.patch('/images/:id', imageController.patchImage)
router.delete('/images/:id', imageController.deleteImage)

router.get('/orders', adminController.getOrders)
router.get('/orders/:id', adminController.getOrder)
router.patch('/orders/:id', adminController.patchOrder)
router.delete('/orders/:id', adminController.deleteOrder)

router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.use('/', (req, res) => res.redirect('/admin/clothes'))

module.exports = router