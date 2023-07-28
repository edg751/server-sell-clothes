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

      static async getInfomation(req, res) {
        try { 
          const products = await UserModel.getInfomation(req.query.user_id);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async postInfomation(req, res) {
        try { 
          const products = await UserModel.postInfomation(req.body.user_id,req.body.name);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async postChangePassword(req, res) {
        try { 
          const products = await UserModel.postChangePassword(req.body.user_id,req.body.old_pass,req.body.new_pass);
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
          return res.status(200).json(products);
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

      static async postAddAddress(req, res) {
        try { 
          const products = await UserModel.postAddAddress(req.body.city,req.body.district,req.body.ward,req.body.address,req.body.name,req.body.phone,req.body.userId);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async getListOrder(req, res) {
        try { 
          const products = await UserModel.getListOrder(req.query.user_id);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async postDeleteAddress(req, res) {
        try { 
          const products = await UserModel.postDeleteAddress(req.body.address_id);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async getNotifyUser(req, res) {
        try { 
          const products = await UserModel.getNotifyUser(req.query.user_id);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async getQuantityNotifyUser(req, res) {
        try { 
          const products = await UserModel.getQuantityNotifyUser(req.query.user_id);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async postNotifyRead(req, res) {
        try { 
          const products = await UserModel.postNotifyRead(req.body.user_id);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async getNotificationList(req, res) {
        try { 
          const products = await UserModel.getNotificationList();
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async getNotificationDetail(req, res) {
        try { 
          const products = await UserModel.getNotificationDetail(req.query.notification_id);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async postAddNotification(req, res) {
        try { 
          const products = await UserModel.postAddNotification(req.body.content,req.body.employee_id);
          return res.status(200).json(products);

        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async postUpdateNotification(req, res) {
        try { 
          const products = await UserModel.postUpdateNotification(req.body.content,req.body.is_active,req.body.notification_id);
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

      static async loginSeniorAdministrator(req, res) {
        try { 
          const products = await UserModel.loginSeniorAdministrator(req.body.email,req.body.password);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }

      static async getEmployeeList(req, res) {
        try { 
          const products = await UserModel.getEmployeeList();
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }

      static async addEmployee(req, res) {
        try { 
          const products = await UserModel.addEmployee(req.body.fullName,req.body.address,req.body.phone,req.body.email);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }

      static async getEmployeeDetail(req, res) {
        try { 
          const products = await UserModel.getEmployeeDetail(req.query.id);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }

      static async updateEmployee(req, res) {
        try { 
          const products = await UserModel.updateEmployee(req.body.id,req.body.fullName,req.body.address,req.body.phone,req.body.email,req.body.status);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }

      static async resetPassEmployee(req, res) {
        try { 
          const products = await UserModel.resetPassEmployee(req.query.id,req.query.email);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }

      static async customerList(req, res) {
        try { 
          const products = await UserModel.customerList();
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }

      static async customerDisable(req, res) {
        try { 
          const products = await UserModel.customerDisable(req.query.id,req.query.status);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }

      static async getStatistical(req, res) {
        try { 
          const products = await UserModel.getStatistical(req.query.month,req.query.year);
          return res.status(200).json(products);
        } catch (error) {
          console.error(error);
          return res.status(401).json({ message: "Tài khoản, mật khẩu sai hoặc chưa kích hoạt tài khoản" });
        }
      }



}
module.exports = UserController;