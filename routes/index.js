const express = require('express')
const router = express.Router()
const clotheController = require('../controllers/clothe-controller')
const userController = require('../controllers/user-controller')
const orderDetailController = require('../controllers/order-detail-controller')
const orderController = require('../controllers/order-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/orderDetails', authenticated, orderDetailController.getOrderDetails)
router.post('/orderDetails', authenticated, orderDetailController.postOrderDetail)

router.get('/search', authenticated, clotheController.getSearch)

router.post('/orders', authenticated, orderController.postOrder)
router.get('/orders/:id/edit', authenticated, orderController.editOrder)
router.put('/orders/:id', authenticated, orderController.putOrder)

router.get('/users/order/:id', authenticated, userController.getOrder)
router.get('/users/:id/orders', authenticated, userController.getOrders)
router.get('/users/:id', authenticated, userController.getUser)



router.get('/clothes/:id', authenticated, clotheController.getClothe)
router.get('/clothes', authenticated, clotheController.getClothes)
router.use('/', (req, res) => res.redirect('/clothes'))
router.use('/', generalErrorHandler)

module.exports = router