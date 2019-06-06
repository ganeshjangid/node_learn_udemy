const express = require('express');

const {check}=require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', check('email').not().isEmpty().withMessage('Please Enter Email id').isEmail().withMessage('Please Enter valid Email id') ,authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/newResetPassword/:token', authController.getResetPw);

router.post('/newResetPassword', authController.postResetPw);

module.exports = router;