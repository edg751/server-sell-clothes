//Cấu hình
import express from 'express';
const configViewEngine = (app) => {
  app.use(express.static('./src/public')); //Public
  app.set('view engine', 'ejs');
  app.set('views', './src/views'); //Các file EJS phải viết trong thư muc views
};

export default configViewEngine;
