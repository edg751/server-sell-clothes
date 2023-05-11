import express from "express";
import APIController from "../controller/APIController";
let router = express.Router(); //Gọi để nó biết đây là router

const initAPIRoute = (app) => {
  router.get("/all", APIController.getAllItems);
  router.post("/auth/login",APIController.userLogin)
  return app.use("", router);
};

export default initAPIRoute;
