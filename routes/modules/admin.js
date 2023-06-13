const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/clothes', adminController.getClothes)
router.use('/', (req, res) => res.redirect('/admin/clothes'))

module.exports = router