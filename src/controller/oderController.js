import OderModel from "../model/oderModel";
class OrderController {
    static async order(req, res) {
        try {
        const address=req.body.address;
        const numberphone=req.body.numberphone;
        const totalprice=req.body.totalprice;
        const cartdata=req.body.cartdata;
        const userId=req.body.userId;
        const name=req.body.name;


          const result = await OderModel.order(address,numberphone,totalprice,cartdata,userId,name);
          if (result.status === 201) {
            return res.status(201).json({ message: "Đăng ký thành công" });
          }
          else {
            return res.status(500).json({ message: "Lỗi server" });
          }
        } catch (error) {
          return res.status(500).json({ message: "Lỗi server" });
        }
    }

    static async order_list_wait(req, res) {
        try {
          const list = await OderModel.order_list_wait();
          return res.status(200).json(list);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async order_detail(req, res) {
        try {
          const list = await OderModel.order_detail(req.query.orderid);
          return res.status(200).json(list);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async order_info(req, res) {
        try {
          const list = await OderModel.order_info(req.query.orderid);
          return res.status(200).json(list);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async update_order(req, res) {
        try {
          const list = await OderModel.update_order(req.body.orderid);
          return res.status(200).json(list);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      static async update_order_2(req, res) {
        try {
          const list = await OderModel.update_order_2(req.body.orderid);
          return res.status(200).json(list);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
      }

      
}
module.exports = OrderController;
