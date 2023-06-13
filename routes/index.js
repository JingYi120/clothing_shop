const express = require('express')
const router = express.Router()
const clotheController = require('../controllers/clothe-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/clothes', clotheController.getClothes)
router.use('/', (req, res) => res.redirect('/clothes'))

module.exports = router