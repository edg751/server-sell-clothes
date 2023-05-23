import express from "express";
import APIController from "../controller/APIController";
let router = express.Router(); //Gọi để nó biết đây là router

const initAPIRoute = (app) => {
  router.get("/all", APIController.getAllItems);
  router.post("/auth/login",APIController.userLogin);
  router.post("/auth/register",APIController.userRegister);

  app.get('/add-to-cart', (req, res) => {
    // Lấy thông tin sản phẩm được thêm vào giỏ hàng
    const product = { id: 1, name: 'Product 1', price: 10 };
  
    // Gửi thông tin sản phẩm dưới dạng JSON
    res.json({ product });
  });
  
  
  return app.use("", router);
};

export default initAPIRoute;
