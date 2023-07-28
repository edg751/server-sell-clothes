import express from "express";
import ProductController from "../controller/productController";
import UserController from "../controller/userController";
import orderController from "../controller/oderController";
import VnpayController from "../controller/vnpayController";
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'dsopmggtb', 
  api_key: '128841183738398', 
  api_secret: 'iOR18H_0gFw-iIdOYZLJpzhkFuw' 
});

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

  router.get('/api/notify_user', UserController.getNotifyUser);
  router.post('/api/notify_read', UserController.postNotifyRead);
  router.get('/api/quantity_notify_user', UserController.getQuantityNotifyUser);

  router.get('/api/notificationList', UserController.getNotificationList);
  router.get('/api/notificationDetail', UserController.getNotificationDetail);
  router.post('/api/updateNotification', UserController.postUpdateNotification);


  router.post('/api/addNotification', UserController.postAddNotification);





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
  router.post('/api/auth/admin_senior_login',UserController.loginSeniorAdministrator);

  router.get('/api/employee_list',UserController.getEmployeeList);
  router.get('/api/employee_detail',UserController.getEmployeeDetail);

  
  router.post('/api/add_employee',UserController.addEmployee);
  router.post('/api/update_employee',UserController.updateEmployee);
  router.get('/api/resetPass_employee',UserController.resetPassEmployee);
  router.get('/api/customer_list',UserController.customerList);
  router.get('/api/customer_disable',UserController.customerDisable);

  router.get('/api/getstatistical',UserController.getStatistical);












  router.post('/api/auth/login',UserController.userLogin);
  router.get('/api/user/address',UserController.getAddress);
  router.get('/api/user/favorite',UserController.getFavoriteList);
  router.get('/api/user_infomation',UserController.getInfomation);
  
  router.get('/api/list_order',UserController.getListOrder);

  router.post('/api/user_infomation',UserController.postInfomation);
  router.post('/api/user_password',UserController.postChangePassword);
  router.post('/api/add_address',UserController.postAddAddress);
  router.post('/api/delete_address',UserController.postDeleteAddress);








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


  router.get('/api/senior-admin/list-promotion', ProductController.getPromotionList);
  router.get('/api/senior-admin/list-product-promotion', ProductController.getPromotionListPromotion);
  router.get('/api/senior-admin/list-product', ProductController.getListProduct);
  router.get('/api/senior-admin/detail-promotion', ProductController.getDetailPromotion);

  router.post('/api/senior-admin/Update-detail-promotion', ProductController.postUpdateDetailPromotion);


  

  router.post('/api/senior-admin/add-promotion', ProductController.postAddPromotion);
  router.post('/api/senior-admin/add-product-promotion', ProductController.postAddProductPromotion);
  router.post('/api/senior-admin/remove-product-promotion', ProductController.postRemoveProductPromotion);


  router.get('/api/admin/statistical', ProductController.getStatistical);


  // app.post('/upload', upload.single('image'),ProductController.postUploadImage );

  app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }
  
      // Xử lý upload ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      const imageUrl = result.secure_url;
      console.log(imageUrl)
      res.send({ imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send({ error: error.message });
    }
  });

  


  return app.use("", router);
};

export default initAPIRoute;
