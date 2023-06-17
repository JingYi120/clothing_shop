const { Image } = require('../models');

const imageController = {
  patchImage: async(req, res, next) => {
    try{
      const image = await Image.findByPk(req.params.id)
      if (!image) throw new Error("Image didn't exist!")
      const clotheId = image.clotheId;
      const images = await Image.findAll({ where: { clotheId } })
      const coverPhoto = images.find(img => img.isCover);

      if (image.isCover) {
        throw new Error ('This Image already the Cover Photo.');
      } else {
        await image.update({ isCover: true });
        if (coverPhoto) {
          await coverPhoto.update({ isCover: false });
        }
        req.flash('success_messages', 'successfully updated')
      }
      
      res.redirect(`/admin/clothes/${image.clotheId}`)
    }catch(err){
      next(err)
    }
  },
  deleteImage: (req, res, next) => {
    return Image.findByPk(req.params.id)
      .then(image => {
        if (!image) throw new Error("Image didn't exist!")
        return image.destroy()
      })
      .then(deletedImage => res.redirect(`/admin/clothes/${deletedImage.clotheId}`))
      .catch(err => next(err))
  }
};

module.exports = imageController;
