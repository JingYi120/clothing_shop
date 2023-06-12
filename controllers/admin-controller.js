const adminController = {
  getClothes: (req, res) => {
    return res.render('admin/clothes')
  }
}
module.exports = adminController