const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAutho=require("../middleware/is-Auth");

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAutho, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAutho,adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',isAutho, adminController.postAddProduct);

router.get('/edit-product/:productId',isAutho, adminController.getEditProduct);

router.post('/edit-product',isAutho, adminController.postEditProduct);

router.post('/delete-product',isAutho, adminController.postDeleteProduct);

module.exports = router;
