import pool from "../configs/connectDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
let userLogin = async (req, res) => {
  const email=req.body.email;
  const password=req.body.password;

try { 
  const array = await pool.execute(`SELECT * FROM khach_hang WHERE email = '${email}' AND password = '${password}'`);

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
    const array = await pool.execute(`SELECT * FROM khach_hang WHERE email = '${email}'`);
    if (array[0].length === 0) {
      await pool.execute(`INSERT INTO khach_hang (email, password,full_name,created_date) VALUES ('${email}', '${password}', '${fullname}','${currentDate}')`);
      return res.status(201).json({ message: "Đăng ký thành công" });
    } else {
      return res.status(401).json({ message: "Email đã tồn tại" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Có lỗi ${error}` });
  }
};



let getAllItems = async (req, res) => {
  const array = await pool.execute(`SELECT san_pham.product_id, san_pham.product_name, san_pham.price FROM san_pham WHERE san_pham.gender = ${req.query.gender}`);
  
  for (const obj of array[0]) {
    const arrayColor = await pool.execute(`SELECT DISTINCT color FROM chi_tiet_sp WHERE product_id = ${obj.product_id}`);
    const arrayImage = await pool.execute(` SELECT DISTINCT image_id,color,image_link from hinh_anh WHERE hinh_anh.is_represent=1 AND product_id = ${obj.product_id}`);
    const colors = arrayColor[0].map((item) => item.color);
    const images =arrayImage[0].map((item) => item);
    obj.color = colors;
    obj.image=images;
  }

  return res.status(200).json({
    data: array[0],
  });
};

let getCategory = async (req, res) => {
  const array = await pool.execute(`SELECT DISTINCT loai_sp.category_id,loai_sp.category_name from loai_sp join san_pham on san_pham.category_id=loai_sp.category_id WHERE san_pham.gender = ${req.query.gender}`);
  return res.status(200).json({
    data: array[0],
  });
};

let getRate = async (req, res) => {
  const array = await pool.execute(`select * from danh_gia WHERE product_id=${req.query.productid}`);
  return res.status(200).json({
    data: array[0],
  });
};

let getDetailPage = async (req, res) => {
  const array = await pool.execute(`SELECT DISTINCT san_pham.product_id,san_pham.product_name,san_pham.sold_quantity,price,product_description from san_pham join chi_tiet_sp on san_pham.product_id=chi_tiet_sp.product_id join danh_gia on danh_gia.product_id=san_pham.product_id WHERE san_pham.product_id = ${req.query.productid}`);
  const arraySLRate=await pool.execute(`SELECT COUNT(rate_id) as so_luong_rate from danh_gia where product_id=${req.query.productid}`);
  const sumRate=await pool.execute(`SELECT SUM(rate_start) as tong_rate from danh_gia where product_id=${req.query.productid}`);
  const arraySizeColor=await pool.execute(`SELECT DISTINCT detail_id,size,color,quantity from chi_tiet_sp WHERE product_id=${req.query.productid}`);
  const arrayImage=await pool.execute(`SELECT * FROM hinh_anh WHERE hinh_anh.product_id=${req.query.productid}`);
  const arrayColor=await pool.execute(`select DISTINCT color from chi_tiet_sp where product_id=${req.query.productid}`)
  const arraySize=await pool.execute(`select DISTINCT size from chi_tiet_sp where product_id=${req.query.productid}`)

  const size_color =arraySizeColor[0].map((item) => item);
  const Images=arrayImage[0].map((item) => item);
  const Colors=arrayColor[0].map((item) => item);
  const Sizes=arraySize[0].map((item) => item);

  array[0][0].size_color=size_color
  array[0][0].image=Images;
  array[0][0].total_rate=arraySLRate[0][0].so_luong_rate;
  array[0][0].rate=sumRate[0][0].tong_rate;
  array[0][0].color=Colors;
  array[0][0].size=Sizes;


  return res.status(200).json({
    data: array[0],
  });
};

let getColor = async(req,res)=>{
  const array = await pool.execute(`SELECT color, MAX(chi_tiet_sp.detail_id) AS detail_id FROM san_pham JOIN chi_tiet_sp ON san_pham.product_id = chi_tiet_sp.product_id WHERE san_pham.gender = ${req.query.gender} GROUP BY color`);
  
  return res.status(200).json({
    data: array[0],
  });
}

let getMaterial = async(req,res)=>{
  const array = await pool.execute(`SELECT DISTINCT loai_vai.material_name, loai_vai.material_id FROM san_pham join loai_vai on san_pham.material_id=loai_vai.material_id WHERE san_pham.gender = ${req.query.gender}`);
  return res.status(200).json({
    data: array[0],
  });
}

let getStyle = async(req,res)=>{
  const array = await pool.execute(`SELECT DISTINCT phong_cach.style_id,phong_cach.style_name FROM san_pham join phong_cach on phong_cach.product_id=san_pham.product_id  WHERE san_pham.gender = ${req.query.gender}`);
  return res.status(200).json({
    data: array[0],
  });
}

const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'dsopmggtb', 
  api_key: '128841183738398', 
  api_secret: 'iOR18H_0gFw-iIdOYZLJpzhkFuw' 
});

let uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    // Lấy đường dẫn
    const imageUrl = result.secure_url;
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

let postUploadImage = async (req, res)=> {
  try {
  const imageUrl = await uploadImage(req.file);
  res.send({ imageUrl });
  } catch (error) {
   res.send({ error });
  }
};


module.exports = {
  userLogin,
  userRegister,
  getAllItems,
  getRate,
  getCategory,
  getDetailPage,
  getMaterial,
  getStyle,
  getColor,
  postUploadImage
};
