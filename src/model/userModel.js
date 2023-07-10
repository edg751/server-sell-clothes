import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";

class UserModel {
    static async userRegister(email, password, fullname) {
      console.log(email,password,fullname)
      if(!email && !password){
        email=null,
        password=null
      }
        try {
          const [rows, fields] = await pool.execute(`SELECT * FROM khach_hang WHERE email = ?`, [email]);
          if (rows.length === 0) {
            await pool.execute(`INSERT INTO khach_hang (email, password, full_name, is_active) VALUES (?, ?, ?, 0)`, [email, password, fullname]);
            return { status: 201, message: "Đăng ký thành công" };
          } else {
            return { status: 401, message: "Email đã tồn tại" };
          }
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi đăng ký');
        }
      }

      static async userLogin(email, password) {
        try {
          const array = await pool.execute(
            `SELECT * FROM khach_hang WHERE email = '${email}' AND password = '${password}'`
          );
    
          if (array[0].length !== 0) {
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
      
}
module.exports = UserModel;
