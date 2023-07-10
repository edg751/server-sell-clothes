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
          return res.status(401).json({ message: error.message });
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
}
module.exports = UserController;