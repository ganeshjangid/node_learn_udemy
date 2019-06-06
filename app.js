const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
//const csrf = require('csurf');
const flash=require('connect-flash');


const errorController = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
const myStore = new SequelizeStore({
  db: sequelize
});


//const csrfProtection = csrf();
//const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: myStore
  })
);
//app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    //throw new Error("dummy");
  User.findByPk(req.session.user.id)
    .then(user => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch(err =>{  
    //console.log(err);

    //throw new error(err);
    next(new error(err));

    } );
});


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  //res.locals.csrfToken = req.csrfToken();
  //res.locals.__csf = req.csrfToken();
  next();
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error,req,res,next)=>{
  //res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error Found',
    path: '/500',
    isAuthenticated: false
  });
})

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
//.sync({ force: true })
.sync()
  .then(result => {
    User.findByPk(1);
    // console.log(result);
    app.listen(3061);
  })
/*   .then(user => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' ,password:'123456'});
    }
    return user;
  })
  .then(user => {
    // console.log(user);
    return user.createCart();
  }) */
 /*  .then(cart => {
    app.listen(3055);
  }) */
  .catch(err => {
    console.log(err);
  });
