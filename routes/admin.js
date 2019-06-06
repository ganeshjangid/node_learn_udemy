const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAutho=require("../middleware/is-Auth");

const {
    check,
    body
} = require('express-validator/check');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAutho, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAutho,adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',isAutho, [
    check('title')
    .not().isEmpty().withMessage("Please Enter Title")
    .trim(),
    body('imageUrl')
    .not().isEmpty().withMessage("Please Enter Image Url")
    .trim().isURL().withMessage("Please Enter Valid Image Url"),
    body('price')
    .not().isEmpty().withMessage("Please Enter Price")
    .trim(),
    body('description')
    .not().isEmpty().withMessage("Please Enter Description")
    .trim()
],adminController.postAddProduct);

router.get('/edit-product/:productId',isAutho, adminController.getEditProduct);

router.post('/edit-product', isAutho, [
    check('title')
    .not().isEmpty().withMessage("Please Enter Title")
    .trim(),
    body('imageUrl')
    .not().isEmpty().withMessage("Please Enter Image Url")
    .trim().isURL().withMessage("Please Enter Valid Image Url"),
    body('price')
    .not().isEmpty().withMessage("Please Enter Price")
    .trim(),
    body('description')
    .not().isEmpty().withMessage("Please Enter Description")
    .trim()
], adminController.postEditProduct);

router.post('/delete-product',isAutho, adminController.postDeleteProduct);

module.exports = router;
