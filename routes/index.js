const express = require('express')
const router = express.Router()
const clotheController = require('../controllers/clothe-controller')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/clothes', clotheController.getClothes)
router.use('/', (req, res) => res.redirect('/clothes'))
router.use('/', generalErrorHandler)

module.exports = router