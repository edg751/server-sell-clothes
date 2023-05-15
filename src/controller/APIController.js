import pool from "../configs/connectDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let userLogin = async (req, res) => {
  const email=req.body.email;
  const password=req.body.password;

try { 
  const array = await pool.execute(`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`);

  if(array[0].length!=0){
    const token = jwt.sign({ id: array[0].id }, "mysecret", {
      expiresIn: "1h",
    });
    return res.status(200).json({ jwt:token, user: array[0][0],  });

  }else{
    return res
    .status(401)
    .json({ message: "Sai tên tài khoản hoặc mật khẩu" });
  }
  
} catch (error) {
  return res
  .status(500)
  .json({ message: `Có lỗi ${error}` });
};
}

let userRegister = async (req, res) => {
  const moment = require('moment');
  const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const email = req.body.email;
  const password = req.body.password;
  const fullname = req.body.fullname;
  try {
    const array = await pool.execute(`SELECT * FROM users WHERE email = '${email}'`);
    if (array[0].length === 0) {
      await pool.execute(`INSERT INTO users (email, password,full_name,date_created) VALUES ('${email}', '${password}', '${fullname}','${currentDate}')`);
      return res.status(201).json({ message: "Đăng ký thành công" });
    } else {
      return res.status(401).json({ message: "Email đã tồn tại" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Có lỗi ${error}` });
  }
};


let getAllItems = async (req, res) => {
  const array = await pool.execute("SELECT * FROM Products");
  
  return res.status(200).json({
    data: array[0],
  });
};



module.exports = {
  userLogin,
  userRegister,
  getAllItems,
};
