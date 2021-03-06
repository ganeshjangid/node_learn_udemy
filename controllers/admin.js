const Product = require('../models/product');

const {
  validationResult
} = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMsg:[],
    errorotp:{title:'',imageUrl:''},
    hasError:false,
    validationError:[]  

  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.array());
  
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMsg:error.array()[0].msg,
      errorotp: {
        title: title,
        imageUrl: imageUrl
      },
      hasError:true,
      product:{
        title: title,
          price: price,
          imageUrl: imageUrl,
          description: description
      }
    });
  }

  req.user
    .createProduct({
      //id:1, // Check Error handing using dublicate id
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
       //console.log(err);
        //res.redirect('/500');      

        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);

    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMsg:[],
        validationError: []
      });
    })
    .catch(err => {
      //console.log(err);
      //res.redirect('/500');      

      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    //console.log(error.array());

    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      errorMsg: error.array()[0].msg,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDesc,
        id: prodId
      },
      validationError: error.array()
    });
  }
  Product.findByPk(prodId)
    .then(product => {
      
      if (product.id.toString() !== prodId.toString()) {
        return res.redirect("/");
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save()
        .then(result => {
          console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        });
    })
    
    .catch(err => {
      //console.log(err);
      //res.redirect('/500');      

      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

    });
};

exports.getProducts = (req, res, next) => {

  req.user
    .getProducts()
    .then(products => {
      console.log(products);
      
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      //console.log(err);
      //res.redirect('/500');      

      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      //console.log(product.id);
      //console.log(prodId);

      ///return false;
      
      if (product.id.toString() !== prodId.toString()) {
        return res.redirect("/");
      }
      return product.destroy()
        .then(result => {
          console.log('DESTROYED PRODUCT');
          res.redirect('/admin/products');
        });
    })
    .catch(err => {
      //console.log(err);
      //res.redirect('/500');      

      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

    });
};
