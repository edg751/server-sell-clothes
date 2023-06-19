import express from "express";
import APIController from "../controller/APIController";
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
let router = express.Router(); //Gọi để nó biết đây là router

const initAPIRoute = (app) => {
  router.get("/api/all_item", APIController.getAllItems);
  router.get("/api/detail_product", APIController.getDetailPage);
  router.get("/api/rate",APIController.getRate)

  
  router.get("/api/category",APIController.getCategory);
  router.get("/api/color",APIController.getColor);
  router.get("/api/material",APIController.getMaterial);
  router.get("/api/style",APIController.getStyle);


  
  router.post("/auth/login",APIController.userLogin);
  router.post("/auth/register",APIController.userRegister);

  app.post('/upload', upload.single('image'),APIController.postUploadImage );

  app.get('/add-to-cart', (req, res) => {
    // Lấy thông tin sản phẩm được thêm vào giỏ hàng
    const product = { id: 1, name: 'Product 1', price: 10 };
  
    // Gửi thông tin sản phẩm dưới dạng JSON
    res.json({ product });
  });
  


  return app.use("", router);
};

export default initAPIRoute;
