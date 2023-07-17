import express from "express";
import ProductController from "../controller/productController";
import UserController from "../controller/userController";
import orderController from "../controller/oderController";
import VnpayController from "../controller/vnpayController";


const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
let router = express.Router(); //Gọi để nó biết đây là router

const initAPIRoute = (app) => {
  // router.get("/api/all_item", APIController.getAllItems);
  // router.get("/api/detail_product", APIController.getDetailPage);
  // router.get("/api/rate",APIController.getRate)

  // TEST MVC
  router.get("/create_payment_url",VnpayController.createPayment);  
  router.get("/vnpay_return",VnpayController.vnpayReturn);

  router.get('/api/product/color_item', ProductController.getCorlorListOnItem);
  router.get('/api/product/size_item', ProductController.getSizeListOnItem);
  router.get('/api/product/quantity', ProductController.getQuantityItem);



  
  

  router.get('/api/list/products', ProductController.getProducts);
  router.get('/api/list/categories', ProductController.getCategories);
  router.get('/api/list/colors', ProductController.getColors);
  router.get('/api/list/styles', ProductController.getStyles);
  router.get('/api/list/materials', ProductController.getMaterials);
  router.get('/api/list/size', ProductController.getSize);

  router.get('/api/detailt/product', ProductController.getProductDetail);

  router.get('/api/getFavorite', ProductController.getFavorite);
  router.post('/api/removeFavorite', ProductController.postRemoveFavorite);
  router.post('/api/addFavorite', ProductController.postAddFavorite);

  router.get('/api/getReview', ProductController.getReview);
  router.post('/api/postReview', ProductController.postReview);
  router.get('/api/getComment', ProductController.getComment);



  router.post('/api/auth/register',UserController.userRegister);
  router.get('/api/auth/verify/:code',UserController.verifyEmail);
  router.post('/api/auth/reset',UserController.resetPassLink);
  router.post('/api/auth/resetpassword',UserController.resetPass);


  router.post('/api/auth/admin_login',UserController.loginAdministrator);



  router.post('/api/auth/login',UserController.userLogin);
  router.get('/api/user/address',UserController.getAddress);
  router.get('/api/user/favorite',UserController.getFavoriteList);



  router.get('/api/feedback',orderController.feedBack);
  router.get('/api/feedback_address',orderController.feedBackAddress);


  router.post('/api/order',orderController.order);
  router.post('/api/order_vnpay',orderController.order_VNPAY);

  router.post('/api/admin/update_order',orderController.update_order);
  router.post('/api/admin/update_order_2',orderController.update_order_2);

  

  router.get('/api/admin/order_wait',orderController.order_list_wait);
  router.get('/api/admin/order_detail',orderController.order_detail);
  router.get('/api/admin/order_info',orderController.order_info);
  
  router.get('/api/admin/delivery_list',orderController.delivery_list);
  router.get('/api/admin/delivery_status',orderController.delivery_status);
  router.post('/api/admin/delivery_update',orderController.postDeliveryUpdate);

  router.post('/api/admin/add_product',ProductController.postAddProduct);
  router.post('/api/admin/update_quantity_product', ProductController.postUpdateQuantityProduct);

  router.post('/api/admin/add_category',ProductController.postAddCategory);
  router.get('/api/admin/detail_category',ProductController.getDetailCategory);
  router.get('/api/admin/get_all_category',ProductController.getAllCategory);
  router.post('/api/admin/update_category',ProductController.postUpdateCategory);

  router.post('/api/admin/add_material',ProductController.postAddMaterial);
  router.get('/api/admin/detail_material',ProductController.getDetailMaterial);
  router.get('/api/admin/get_all_material',ProductController.getAllMaterial);
  router.post('/api/admin/update_material',ProductController.postUpdateMaterial);

  router.post('/api/admin/add_color',ProductController.postAddColor);
  router.get('/api/admin/detail_color',ProductController.getDetailColor);
  router.get('/api/admin/get_all_color',ProductController.getAllColor);
  router.post('/api/admin/update_color',ProductController.postUpdateColor);

  router.post('/api/admin/add_style',ProductController.postAddStyle);
  router.get('/api/admin/detail_style',ProductController.getDetailStyle);
  router.get('/api/admin/get_all_style',ProductController.getAllStyle);
  router.post('/api/admin/update_style',ProductController.postUpdateStyle);

  
  router.get('/api/admin/products', ProductController.getProductListAdmin);
  router.get('/api/admin/product_detail', ProductController.getProductDetailAdmin);
  router.get('/api/admin/product_link_image',ProductController.getListLinkImage);

  router.get('/api/admin/detail_update', ProductController.getUpdateProduct);
  router.post('/api/admin/product_update', ProductController.postProductUpdate);





  

  // TEST MVC

  // router.get("/api/category",APIController.getCategory);
  // router.get("/api/color",APIController.getColor);
  // router.get("/api/material",APIController.getMaterial);
  // router.get("/api/style",APIController.getStyle);


  
  // router.post("/auth/login",APIController.userLogin);
  // router.post("/auth/register",APIController.userRegister);

  // app.post('/upload', upload.single('image'),APIController.postUploadImage );

  app.get('/add-to-cart', (req, res) => {
    // Lấy thông tin sản phẩm được thêm vào giỏ hàng
    const product = { id: 1, name: 'Product 1', price: 10 };
  
    // Gửi thông tin sản phẩm dưới dạng JSON
    res.json({ product });
  });
  


  return app.use("", router);
};

export default initAPIRoute;
