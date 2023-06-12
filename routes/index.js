const express = require('express')
const router = express.Router()
const clotheController = require('../controllers/clothe-controller')

router.get('/clothes', clotheController.getClothes)
router.use('/', (req, res) => res.redirect('/clothes'))

module.exports = router