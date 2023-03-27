import express from 'express';
import APIController from '../controller/APIController';
let router = express.Router(); //Gọi để nó biết đây là router

const initAPIRoute = (app) => {
  router.get('/all', APIController.getAllItems);
  return app.use('/api-swe/', router);
};

export default initAPIRoute;
