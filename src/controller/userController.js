import UserModel from "../model/userModel";
class UserController {
    static async userRegister(req, res) {
        try {
        const email = req.body.email;
        const password = req.body.password;
        const fullname = req.body.fullname;
          const result = await UserModel.userRegister(email, password, fullname);
          if (result.status === 201) {
            return res.status(201).json({ message: "Đăng ký thành công" });
          } else if (result.status === 401) {
            return res.status(401).json({ message: "Email đã tồn tại" });
          } else {
            return res.status(500).json({ message: "Lỗi server" });
          }
        } catch (error) {
          return res.status(500).json({ message: "Lỗi server" });
        }
    }
    
    static userLogin = async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
      
        try {
          const result = await UserModel.userLogin(email, password);
      
          return res.status(200).json(result);
        } catch (error) {
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      };

      static async getAddress(req, res) {
        try { 
          const products = await UserModel.getAddress(req.query.user_id);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async verifyEmail(req, res) {
        console.log(req.params.code)
        try { 
          const products = await UserModel.verifyEmail(req.params.code);
          return res.redirect('http://localhost:3000/');

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async resetPassLink(req, res) {
        try { 
          const products = await UserModel.resetPassLink(req.body.email.email);
          return res.status(200).json({success:'Đã gửi email'});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      
      static async resetPass(req, res) {
        try { 
          const products = await UserModel.resetPass(req.body.token,req.body.password);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }


      static async getFavoriteList(req, res) {
        try { 
          const products = await UserModel.getFavoriteList(req.query.user_id);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }


      static async loginAdministrator(req, res) {
        try { 
          const products = await UserModel.loginAdministrator(req.body.email,req.body.password);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }


}
module.exports = UserController;