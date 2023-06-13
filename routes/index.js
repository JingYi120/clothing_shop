const express = require('express')
const router = express.Router()
const clotheController = require('../controllers/clothe-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/clothes', clotheController.getClothes)
router.use('/', (req, res) => res.redirect('/clothes'))
router.use('/', generalErrorHandler)

module.exports = router