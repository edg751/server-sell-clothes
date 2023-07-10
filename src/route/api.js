import express from "express";
import ProductController from "../controller/productController";
import UserController from "../controller/userController";
import orderController from "../controller/oderController";



const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
let router = express.Router(); //Gọi để nó biết đây là router

const initAPIRoute = (app) => {
  // router.get("/api/all_item", APIController.getAllItems);
  // router.get("/api/detail_product", APIController.getDetailPage);
  // router.get("/api/rate",APIController.getRate)

  // TEST MVC
  router.get('/api/list/products', ProductController.getProducts);
  router.get('/api/list/categories', ProductController.getCategories);
  router.get('/api/list/colors', ProductController.getColors);
  router.get('/api/list/styles', ProductController.getStyles);
  router.get('/api/list/materials', ProductController.getMaterials);
  router.get('/api/list/size', ProductController.getSize);

  router.get('/api/detailt/product', ProductController.getProductDetail);




  router.post('/api/auth/register',UserController.userRegister);
  router.post('/api/auth/login',UserController.userLogin);

  router.post('/api/order',orderController.order);
  router.get('/api/admin/order_wait',orderController.order_list_wait);
  router.get('/api/admin/order_detail',orderController.order_detail);
  router.get('/api/admin/order_info',orderController.order_info);

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

  router.post('/api/admin/add_style',ProductController.postAddStyle);
  router.get('/api/admin/detail_style',ProductController.getDetailStyle);
  router.get('/api/admin/get_all_style',ProductController.getAllStyle);
  router.post('/api/admin/update_style',ProductController.postUpdateStyle);

  
  router.get('/api/admin/products', ProductController.getProductListAdmin);
  router.get('/api/admin/product_detail', ProductController.getProductDetailAdmin);
  router.get('/api/admin/product_link_image',ProductController.getListLinkImage);



  

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
