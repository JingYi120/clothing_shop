const { Clothe, Category, User, Image, Order, OrderDetail } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const dayjs = require('dayjs')

const adminController = {
  getClothes: async(req, res, next) => {
    try{
      const categoryId = Number(req.query.categoryId) || ''
      const [clothes, categories] = await Promise.all([Clothe.findAll({
        raw: true,
        nest: true,
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        order: [
          ['createdAt', 'desc']
        ]
      }),
        Category.findAll({ raw: true })
    ])
      res.render('admin/clothes', { clothes, categories })
    }catch(err){
      next(err)
    }
  },
  createClothe: async(req, res, next) => {
    try{
      const categories = await Category.findAll({ raw: true })
      res.render('admin/create-clothe', { categories })
    }catch(err){
      next(err)
    }
  }, 
  postClothe: async(req, res, next) => {
    try {
      const { name, description, price, categoryId } = req.body;
      if (!name || !description || !price) throw new Error('All fields are required!');

      const { files } = req;
      const { cover, image } = files;
      const MAX_IMAGE_COUNT = 5

      const coverPath = cover && cover.length > 0 ? await imgurFileHandler(cover[0]) : null
      const imagePaths = image && image.length > 0 ?await Promise.all(image.map(file => imgurFileHandler(file))) : []

      const clothe = await Clothe.create({
        name,
        description,
        price,
        categoryId
      });
      if(coverPath){
        await Image.create({
          name: coverPath,
          clotheId: clothe.id,
          isCover: true
        });
      }
      
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
  getClothe: async(req, res, next) => {
    try{
      const clothe = await Clothe.findByPk(req.params.id, {
        include: [Category, Image]
      })
      if (!clothe) throw new Error("Item didn't exist!");
      res.render('admin/clothe', { clothe: clothe.toJSON() });
    }catch(err){
      next(err)
    }
  },
  editClothe: async(req, res, next) => {
    try{
      const [clothe, categories] = await Promise.all([
        Clothe.findByPk(req.params.id, { include: Image }),
        Category.findAll({ raw: true }),
      ])

      if (!clothe) throw new Error("Item didn't exist!")
      res.render('admin/edit-clothe', { clothe: clothe.toJSON(), categories })
    } catch (err) {
      next(err)
    }
  },
  putClothe: async (req, res, next) => {
    try {
      const { name, description, price, categoryId } = req.body;
      const { files } = req;
      const { cover, image } = files;

      if (!name || !description || !price) throw new Error('All fields are required!');

      const clothe = await Clothe.findByPk(req.params.id);
      if (!clothe) throw new Error("Item doesn't exist!");

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

        if (existingImages.length + image.length > 5) throw new Error("Maximum image count reached 5");

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
  getUsers: async(req, res, next) => {
    try{
      const users = await User.findAll({
        raw: true,
        nest: true
      })
      res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async(req, res, next) => {
    try{
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      if (user.email === 'root@example.com') {
        req.flash('error_messages', `Prohibit changing root's permissions`)
        return res.redirect('back')
      }
      await user.update({ isAdmin: !user.isAdmin })

      req.flash('success_messages', 'The user permissions have been successfully updated.')
      res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  },
  getOrders: async(req, res, next) => {
    try{
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        include: [User],
        where: { isOrder: true },
        order: [
          ['isDone', 'asc'],
          ['createdAt', 'desc']
        ]
      })

      const result = orders.map ( order => ({
        ...order,
        createdAt: dayjs(order.createdAt).format('YYYY-MM-DD') + '__' + dayjs(order.createdAt).format('HH:mm:ss')
      }))

      res.render('admin/orders', { orders: result })
    } catch (err) {
      next(err)
    }
  },
  getOrder: async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [{ model: OrderDetail, include: Clothe }]
      })
      if (!order) throw new Error("Order didn't exist!");
      let total = 0;
      order.OrderDetails.forEach((orderDetail) => {
        const price = Number(orderDetail.Clothe.price);
        const quantity = Number(orderDetail.quantity);
        total += price * quantity;
      });

      res.render('admin/order', {
        order: order.toJSON(),
        total
      });
    } catch (err) {
      next(err);
    }
  },
  patchOrder: async(req, res, next) => {
    try{
      const orderId = req.params.id
      const order = await Order.findByPk(orderId)

      if (!order) throw new Error("Order didn't exist!")

      await order.update({ isDone: !order.isDone })

      req.flash('success_messages', 'The order status is successfully update.')
      res.redirect(`/admin/orders/${orderId}`)
    } catch (err) {
      next(err)
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      const orderId = req.params.id
      const order = await Order.findByPk(orderId, { include: OrderDetail })
      if (!order) throw new Error("Order didn't exist!")
      await Promise.all(order.OrderDetails.map(od => od.destroy()))
      await order.destroy()
      res.redirect('/admin/orders')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController