const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const isAutho=require('../middleware/is-Auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAutho, shopController.getCart);

router.post('/cart', isAutho, shopController.postCart);

router.post('/cart-delete-item', isAutho, shopController.postCartDeleteProduct);

router.post('/create-order', isAutho, shopController.postOrder);

router.get('/orders', isAutho, shopController.getOrders);

module.exports = router;
