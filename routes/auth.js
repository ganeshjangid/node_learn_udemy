const express = require('express');

const {check,body}=require('express-validator/check');

const authController = require('../controllers/auth');

const User=require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[
    check('email')
    .not().isEmpty().withMessage('Please Enter Email id').isEmail().withMessage('Please Enter valid Email id')
    .normalizeEmail(),
    body('password')
    .not().isEmpty().withMessage('Please Enter Password')
    .trim()
], authController.postLogin);

router.post('/signup',
 [check('email').not().isEmpty().withMessage('Please Enter Email id').isEmail().withMessage('Please Enter valid Email id')
 .custom((value,{req})=>{
    return User.findAll({
        where: {
            email: value
        }
    })
      .then((exist_user) => {
            //console.log(exist_user); return false;
            if (exist_user.length > 0) {
                return Promise.reject('Email id is already exist Please Check');
            }

        });          

 })
 .normalizeEmail() ,
    body('password')
    .not().isEmpty().withMessage('Please Enter Password!')
    .isLength({min:5}).withMessage('Please Enter Valid Password!')
    .trim(),
    body('confirmPassword')
    .custom((value,{req})=>{

        if (value !== req.body.password){
            throw new Error('Password does not match!');
        } 

        return true;
    })
    .trim()
    ],
 authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/newResetPassword/:token', authController.getResetPw);

router.post('/newResetPassword', authController.postResetPw);

module.exports = router;