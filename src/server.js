import express from 'express'; //Import thư viện express;

import initAPIRoute from './route/api';

const cookieParser = require('cookie-parser')

// import connection from "./configs/connectDB";
require('dotenv').config(); //Gọi mới sd đc biến môi trường

const app = express(); //Để sd thì phải gọi đến hàm express
const port = process.env.PORT; // Lấy port bên biến môi trường

//MIDDLEWARE  (Config như này hỗ trợ gửi DATA từ CLIENT lên SERVER)

var cors = require('cors')

app.use(cors()) // Use this after the variable declaration


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("SERVER ON");
});

//Init api routee
initAPIRoute(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
