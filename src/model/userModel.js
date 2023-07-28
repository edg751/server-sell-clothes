import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  auth: {
    user: 'a22e67f3edfb6923d2c0b6b3d91bc29e',
    pass: 'd9b6bee006bf752a52bb12d5c4bb7cbd',
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
          const [rows, fields]= await pool.execute(`UPDATE khach_hang SET khach_hang.password = '${new_pass}' WHERE khach_hang.user_id='${user_id}' AND khach_hang.password='${old_pass}'`)
          if(rows.changedRows==1){
            return 1;

          } else{
            return 0;
          }
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

      
      static async getNotifyUser(user_id) {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM thong_bao join thong_bao_khach_hang on thong_bao.notification_id=thong_bao_khach_hang.notification_id WHERE thong_bao_khach_hang.user_id=${user_id} AND thong_bao.is_active=1`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }
      
      static async getQuantityNotifyUser(user_id) {
        try {
          const [rows, fields]= await pool.execute(`SELECT COUNT(*) AS quantity_notify FROM thong_bao join thong_bao_khach_hang on thong_bao.notification_id=thong_bao_khach_hang.notification_id WHERE thong_bao_khach_hang.user_id=${user_id} AND thong_bao_khach_hang.is_read=0 AND thong_bao.is_active=1`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async postNotifyRead(user_id) {
        try {
          const [rows, fields]= await pool.execute(`UPDATE thong_bao_khach_hang set thong_bao_khach_hang.is_read=1 WHERE thong_bao_khach_hang.user_id=${user_id}`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async getNotificationList() {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM thong_bao ORDER BY thong_bao.notification_id DESC`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async postAddNotification(content,id) {
        const currentDate = new Date().toISOString().split("T")[0];
        try {
          const [rows, fields]= await pool.execute(`INSERT INTO thong_bao (notification_content, notification_date, is_active, id_employee) VALUES ('${content}', '${currentDate}', '1', '${id}')`)    
          await pool.execute(`INSERT INTO thong_bao_khach_hang (is_read, notification_id, user_id)
          SELECT '0', '${rows.insertId}', user_id
          FROM KHACH_HANG`)
          return rows;
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

      static async getNotificationDetail(notification_id) {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM thong_bao WHERE thong_bao.notification_id=${notification_id}`)    
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async postUpdateNotification(content,is_active,notification_id) {
        try {
          const [rows, fields]= await pool.execute(`UPDATE thong_bao SET notification_content = '${content}', is_active = '${is_active}' WHERE thong_bao.notification_id = ${notification_id}`)    
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
          console.log(rows);
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
          return 1;
          }
          return 0;
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
      static async loginSeniorAdministrator(email,password) {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM admin WHERE user_name='${email}' AND password='${password}'`);
          if(rows.length!==0){
            return {admin:rows}
          }else{
            throw new Error("Sai tên tài khoản hoặc mật khẩu");
          }
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }
      
      static async getEmployeeList() {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM nhan_vien`);
            return rows

        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async addEmployee(fullName,address,phone,email) {
        const verificationCode = Math.random().toString(36).substring(7);
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM nhan_vien where nhan_vien.email='${email}'`);
          if(rows.length==0){
            await pool.execute(`INSERT INTO nhan_vien (full_name, address, phone_number, email, password, is_active) VALUES ('${fullName}', '${address}', '${phone}', '${email}', '${verificationCode}', '1')`);
            
            const mailOptions = {
              from: 'edwardgbao@gmail.com', // Địa chỉ email người gửi
              to: `${email}`, // Địa chỉ email người nhận
              subject: 'Đăng ký nhân viên thành công', // Tiêu đề email
              text: `Xin chào ${fullName},\n\nMật khẩu của bạn là "${verificationCode}",không chia sẻ mật khẩu này với bất kì ai`, // Nội dung email
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
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async getEmployeeDetail(id) {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM nhan_vien where nhan_vien.id_employee=${id}`);
            return rows

        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async updateEmployee(id,name,address,phone,email,status) {
        try {
          const [rows, fields]= await pool.execute(`UPDATE nhan_vien SET full_name = '${name}', address = '${address}', phone_number = '${phone}', email = '${email}', is_active = '${status}' WHERE nhan_vien.id_employee = ${id}`);
            return rows

        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async customerList() {
        try {
          const [rows, fields]= await pool.execute(`SELECT * FROM KHACH_HANG`);
            return rows

        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async customerDisable(id,status) {
        try {
          
          let newStatus=status==0?1:0
          console.log(newStatus);
          const [rows, fields]= await pool.execute(`UPDATE khach_hang SET is_active = '${newStatus}' WHERE khach_hang.user_id = ${id}`);
            return rows

        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }

      static async getStatistical(month,year) {
        try {
          const [rows, fields]= await pool.execute(`SELECT SUM(chi_tiet_don_hang.quantity) AS total_quantity,SUM(chi_tiet_don_hang.promotion_price_order) AS total_price,COUNT(don_hang.order_id) AS total_order,COUNT(don_hang.user_id) AS total_user
          FROM don_hang
          JOIN thong_tin_giao_hang ON thong_tin_giao_hang.delivery_id = don_hang.delivery_id
          JOIN chi_tiet_don_hang ON chi_tiet_don_hang.order_id = don_hang.order_id
          WHERE thong_tin_giao_hang.delevery_status = 2 AND MONTH(don_hang.order_date) = ${month} AND YEAR(don_hang.order_date) = ${year}`);
            return rows

        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }


      static async resetPassEmployee(id,email) {
        const verificationCode = Math.random().toString(36).substring(7);

        try {
          const [rows, fields]= await pool.execute(`UPDATE nhan_vien SET password='${verificationCode}' WHERE nhan_vien.id_employee = ${id}`);

          const mailOptions = {
            from: 'edwardgbao@gmail.com', // Địa chỉ email người gửi
            to: `${email}`, // Địa chỉ email người nhận
            subject: 'Reset mật khẩu', // Tiêu đề email
            text: `Xin chào,\n\nMật khẩu của bạn là "${verificationCode}",không chia sẻ mật khẩu này với bất kì ai` // Nội dung email
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
            return rows

        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách màu');
        }
      }


}
module.exports = UserModel;
