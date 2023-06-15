const { Clothe, Category, User, Image } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getClothes: (req, res, next) => {
    Clothe.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(clothes => res.render('admin/clothes', { clothes }))
      .catch(err => next(err))
  },
  createClothe: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-clothe', { categories }))
      .catch(err => next(err))
  }, 
  postClothe: async (req, res, next) => {
    try {
      const { name, description, price, categoryId } = req.body;
      if (!name || !description || !price) {
        throw new Error('All fields are required!');
      }

      const { files } = req;
      const { cover, image } = files;

      const coverPath = await imgurFileHandler(cover[0]);
      const imagePaths = await Promise.all(image.map(file => imgurFileHandler(file)));

      const clothe = await Clothe.create({
        name,
        description,
        price,
        categoryId
      });

      await Image.create({
        name: coverPath,
        clotheId: clothe.id,
        isCover: true
      });

      for (let i = 0; i < imagePaths.length; i++) {
        await Image.create({
          name: imagePaths[i],
          clotheId: clothe.id,
          isCover: false 
        });
      }

      req.flash('success_messages', 'Item was successfully created');
      res.redirect('/admin/clothes');
    } catch (err) {
      next(err);
    }
  },
  getClothe: (req, res, next) => {
    Clothe.findByPk(req.params.id, {
      include: [Category, Image]
    })
      .then(clothe => {
        if (!clothe) throw new Error("Item didn't exist!");
        res.render('admin/clothe', { clothe: clothe.toJSON() });
        console.log(clothe.Images)
      })
      .catch(err => next(err));
  },
  editClothe: (req, res, next) => {
    return Promise.all([
      Clothe.findByPk(req.params.id, {include: Image}),
      Category.findAll({ raw: true }),
    ])
    
      .then(([clothe, categories]) => {
        if (!clothe) throw new Error("Item didn't exist!")
        res.render('admin/edit-clothe', { clothe: clothe.toJSON(), categories })
      })
      .catch(err => next(err))
  },
  putClothe: async (req, res, next) => {
    try {
      const { name, description, price, categoryId } = req.body;
      const { files } = req;
      const { cover, image } = files;

      if (!name || !description || !price) {
        throw new Error('All fields are required!');
      }

      const clothe = await Clothe.findByPk(req.params.id);
      if (!clothe) {
        throw new Error("Item doesn't exist!");
      }

      await clothe.update({
        name,
        description,
        price,
        categoryId,
      });

      if (cover) {
        const coverPath = await imgurFileHandler(cover[0]);
        await Image.update(
          {
            name: coverPath,
            isCover: true,
          },
          {
            where: {
              clotheId: clothe.id,
              isCover: true,
            },
          }
        );
      }

      if (image) {
        const existingImages = await Image.findAll({
          where: {
            clotheId: clothe.id,
            isCover: false,
          },
        });

        if (existingImages.length + image.length > 5) {
          throw new Error("Maximum image count reached 5");
        }

        for (const file of image) {
          const imagePath = await imgurFileHandler(file);
          await Image.create({
            name: imagePath,
            clotheId: clothe.id,
            isCover: false,
          });
        }
      }

      req.flash('success_messages', 'Item was successfully updated');
      res.redirect('/admin/clothes');
    } catch (err) {
      next(err);
    }
  },
  deleteClothe: async(req, res, next) => {
    try{
      const clothe = await Clothe.findByPk(req.params.id, { include: Image })
      if (!clothe) throw new Error("Item didn't exist!")
      await Promise.all(clothe.Images.map(image => image.destroy()))
      await clothe.destroy()
      res.redirect('/admin/clothes')
    }catch(err){
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === '123@123') {
          req.flash('error_messages', `Prohibit changing root's permissions`)
          return res.redirect('back')
        }

        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(() => {
        req.flash('success_messages', 'The user permissions have been successfully updated.')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController