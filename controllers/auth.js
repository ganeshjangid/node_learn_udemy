const crypto=require('crypto');

const bcrypt=require('bcryptjs');

const { validationResult }=require('express-validator/check');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMsg:req.flash('error'),
    outputError: {
      email: ''
    },
    validationError:[]
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMsg: req.flash('error'),
    outputError:{email:''},
    validationError:[]
  });
};

exports.postLogin = (req, res, next) => {
  const email= req.body.email;
  const password=req.body.password;

  const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMsg: error.array()[0].msg,
        outputError: {
          email: email
        },
        validationError:error.array()
      });
    }

  User.findAll({where:{email:email}})
  .then((user) => {
    //console.log(user);
      if (user.length <= 0) {

        req.flash('error',"invalid Email id or password!");
        return res.redirect("/login");
      }

      ///console.log(user[0].password);
      return bcrypt.compare(password, user[0].password)
      .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user[0];
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
            //return res.redirect("/");
          }

          req.flash('error','Email Id or Password is invalid!');
          return res.redirect("/login");


      }).catch((err) => {
        console.log(err);
      });


  }).catch(err => console.log(err));

  /* User.findByPk('1')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err)); */
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  const cPw = req.body.confirmPassword;

  const error = validationResult(req);

  console.log(error.array());
  
  if (!error.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMsg: error.array()[0].msg,
      outputError: {
        email: email
      },
      validationError:error.array()
    });
  }

  //console.log(`${email} and ${pw} and ${cpw}`);
 User.findAll({
    where: {
      email: email
    }
  }) 
/*   User.count({
    where: {
      email: email
    }
  }) */
  .then((exist_user) => {
   //console.log(exist_user); return false;
    if (exist_user.length >0) {
        req.flash('error','Email id is already exist');
        return res.redirect("/signup");
    }

    return bcrypt.hash(cPw,12)
      .then(hasedPassword => {
        return User.create({
          email: email,
          password: hasedPassword
        });
        //return exist_user;
      });
  
  })
  .then((user)=>{
    //console.log(user);
    //return false;
    user.createCart();
    res.redirect("/login"); 

  }) 
  .catch((err) => {
    console.log(err);
  });  
  
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset=(req,res,next)=>{
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMsg: req.flash('error')
  });
};

exports.postReset=(req,res,next)=>{

  const email=req.body.email;
  crypto.randomBytes(32,(err,buffer)=>{
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }

    const token=buffer.toString('hex');

      User.findAll({
            where: {
              email: email
            }
          })
          .then((user) => {
             if (user.length <= 0) {
               req.flash('error', 'Email id does not exist!');
               return res.redirect("/reset");
             }

           /*  return  User.create({
                resetToken: token,
                resetTokenExp:Date.now()+3600000
             }); */

              //console.log(user);return false;
             return User.update({
              resetToken : token,
              resetTokenExp : Date.now() + 3600000
             },{where:{email: email}});
          })
          .then((result)=>{

              const tokenUrl = "http://172.29.64.51:3058/newResetPassword/" + token;
              console.log(tokenUrl);
              //http://172.29.64.51:3058/newResetPassword/b5f0ddd1940bd041e822e85f52c3bb50b4c72d48fce7b438604eb22a8b7d4eb8
              //http://localhost:3058/newResetPassword/d51618cf6b0ba72429056478a51120e03eb49990d8172d0e1d6264a457f1c6ad
              res.redirect("/login");
          })
          .catch((err) => {
          console.log(err);

          });


  });

};

exports.getResetPw= (req, res, next) => {

   const token = req.params.token;

  User.findAll({  
     where: {
       resetToken: token/* ,
       resetTokenExp:{
          gte: Date.now()
       } */
     }
   })
   .then((user) => {
     console.log(user);
     if (user.length > 0) {
        res.render('auth/new-reset-password', {
          path: '/new-reset-password',
          pageTitle: 'New Reset Password',
          errorMsg: req.flash('error'),
          userId: user[0].id,
          resetToken: token
        });
     }

     res.redirect("/login");
    
   }).catch((err) => {
     console.log(err);
   });


  
};


exports.postResetPw=(req,res,next)=>{

  const token = req.body.resetToken;
  const pw=req.body.password;
  const userId = req.body.userId;

  let resetUser;
  //console.log(`${token} and ${userId} and ${pw}`);
    User.findAll({
      where: {
        resetToken: token,
        id: userId
    }})
    .then((user) => {

    resetUser=user;
     return bcrypt.hash(pw,12);
    })
    .then(hashedPassword=>{


      return User.update({
        resetToken: null,
        resetTokenExp: undefined,
        password: hashedPassword
      }, { where: { id: resetUser[0].id } });
    })
    .then(result=>{
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};