import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  auth: {
    user: 'a22e67f3edfb6923d2c0b6b3d91bc29e',
    pass: 'c96e373b5a770c7045d13da6667bf242',
  },
});

class UserModel {
    static async userRegister(email, password, fullname) {
      console.log(email,password,fullname)
      const verificationCode = Math.random().toString(36).substring(7);
        try {
          const [rows, fields] = await pool.execute(`SELECT * FROM khach_hang WHERE email = ?`, [email]);
            if (rows.length === 0) {
              await pool.execute(`INSERT INTO khach_hang (email, password, full_name, is_active,token) VALUES (?, ?, ?, 0, ?)`, [email, password, fullname, verificationCode]);
              
              const mailOptions = {
                from: 'edwardgbao@gmail.com', // Địa chỉ email người gửi
                to: `${email}`, // Địa chỉ email người nhận
                subject: 'Xác nhận đăng ký', // Tiêu đề email
                text: `Xin chào,\n\nCảm ơn bạn đã đăng ký. Vui lòng nhấp vào đường link sau để xác nhận tài khoản:\n\nhttp://localhost:3500/api/auth/verify/${verificationCode}`, // Nội dung email
              };

              try{
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log('Lỗi khi gửi email xác nhận',error);
                  } else {
                    console.log('Email xác nhận đã được gửi: ' + info.response);
                    console.log ('Vui lòng kiểm tra email để xác nhận đăng ký') ;
                  }
                });
              }catch(e){
                console.log(e)
              }
              return { status: 201, message: "Vui lòng kiểm tra email để xác nhận đăng ký" };
            } else {
              return { status: 401, message: "Email đã tồn tại" };
            }
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi đăng ký');
        }
      }

      static async verifyEmail(code) {
        try {
          const [rows, fields]= await pool.execute(`UPDATE khach_hang SET is_active = '1' WHERE khach_hang.token = '${code}'`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async getInfomation(user_id) {
        try {
          const [rows, fields]= await pool.execute(`SELECT khach_hang.user_id,khach_hang.email,khach_hang.full_name FROM khach_hang WHERE khach_hang.user_id=${user_id}`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async postInfomation(user_id,name) {
        try {
          const [rows, fields]= await pool.execute(`UPDATE khach_hang SET full_name = '${name}' WHERE khach_hang.user_id = ${user_id}`)    
          return 1;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async postChangePassword(user_id,old_pass,new_pass) {
        try {
          const [rows, fields]= await pool.execute(`UPDATE khach_hang SET khach_hang.password = '${new_pass}' WHERE khach_hang.user_id='${user_id}' AND khach_hang.password='${old_pass}';
          `)    
          return 1;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async postAddAddress(city,district,ward,address,name,phone,userId) {
        try {
          const [rows, fields]= await pool.execute(`INSERT INTO thong_tin_lien_lac (name_info, city, district, ward, address, phone_number, user_id) VALUES ('${name}', '${city}', '${district}', '${ward}', '${address}', '${phone}', '${userId}')`)    
          return 1;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async postDeleteAddress(address_id) {
        try {
          const [rows, fields]= await pool.execute(`DELETE FROM thong_tin_lien_lac WHERE thong_tin_lien_lac.contact_info_id = ${address_id}`)    
          return 1;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async getListOrder(user_id) {
        try {
          const [rows, fields]= await pool.execute(`SELECT don_hang.order_id,thong_tin_giao_hang.name,thong_tin_giao_hang.address,thong_tin_giao_hang.phone_number,don_hang.order_date,order_status,don_hang.payment_status,don_hang.payment_method_id,don_hang.total_price,thong_tin_giao_hang.delevery_status FROM thong_tin_giao_hang join don_hang on thong_tin_giao_hang.delivery_id=don_hang.delivery_id WHERE don_hang.user_id=${user_id}`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }


      static async userLogin(email, password) {
        try {
          const array = await pool.execute(
            `SELECT * FROM khach_hang WHERE email = '${email}' AND password = '${password}'`
          );
    
          if (array[0].length !== 0) {

            const user = array[0][0];
            if (user.is_active === 0) {
              throw new Error("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt.");
            }

            const token = jwt.sign({ id: array[0].id }, "mysecret", {
              expiresIn: "1h",
            });
            return { jwt: token, user: array[0][0] };
          } else {
            throw new Error("Sai tên tài khoản hoặc mật khẩu");
          }
        } catch (error) {
          throw new Error(`Có lỗi ${error}`);
        }
      }      
      
      static async getAddress(userId) {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM thong_tin_lien_lac WHERE user_id=${userId}`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async resetPass(token,password) {
        try {
          const [rows, fields]= await pool.execute(`UPDATE khach_hang SET password = '${password}' WHERE khach_hang.token = '${token}'`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async resetPassLink(email) {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM khach_hang where email='${email}'`)
          if (rows.length !== 0) {

            const mailOptions = {
              from: 'edwardgbao@gmail.com', // Địa chỉ email người gửi
              to: `${email}`, // Địa chỉ email người nhận
              subject: 'Reset mật khẩu', // Tiêu đề email
              text: `Xin chào,\n\nĐể cập nhật mật khẩu bạn vui lòng vào link sau:\n\nhttp://localhost:3000/resetPassword/${rows[0].token}`, // Nội dung email
            };

            try{
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log('Lỗi khi gửi email xác nhận',error);
                } else {
                  console.log('Email xác nhận đã được gửi: ' + info.response);
                  console.log ('Vui lòng kiểm tra email để xác nhận đăng ký') ;
                }
              });
            }catch(e){
              console.log(e)
            }
          }
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async getFavoriteList(userId) {
        try {
          const [rows, fields]= await pool.execute(`SELECT san_pham.id_product, MIN(product_name) AS product_name, MIN(price) AS price, MIN(hinh_anh.pic_link) AS pic_link
          FROM san_pham
          JOIN ds_yeu_thich ON ds_yeu_thich.id_product = san_pham.id_product
          JOIN hinh_anh ON hinh_anh.id_product = san_pham.id_product
          WHERE ds_yeu_thich.user_id=${userId} AND hinh_anh.is_represent = 1
          GROUP BY san_pham.id_product;
          `)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      
      static async loginAdministrator(email,password) {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM nhan_vien WHERE email='${email}' AND password='${password}'`);
          console.log(email);
          console.log(password);
          console.log(rows);

          if(rows.length!==0){
            if(rows.is_active==0){
              throw new Error("Tài khoản chưa được kích hoạt.");
            }
            return {admin:rows}
          }else{
            throw new Error("Sai tên tài khoản hoặc mật khẩu");
          }
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      



}
module.exports = UserModel;
