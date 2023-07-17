import pool from "../configs/connectDB";
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  auth: {
    user: 'a22e67f3edfb6923d2c0b6b3d91bc29e',
    pass: 'c96e373b5a770c7045d13da6667bf242',
  },
});
class OderModel {
    static async order(address,numberphone,totalprice,cartdata,userId,name) {
          try {
              const currentDate = new Date().toISOString().split("T")[0];
              console.log("Địa chỉ lỗi",address)
              const [deliveryID,fields2]=await pool.execute(`INSERT INTO thong_tin_giao_hang (name, delevery_status, address, phone_number) VALUES ('${name}', '0', '${address}', '${numberphone}')`)
              const deliveryId=deliveryID.insertId;

              const [orderID,fields3]=await pool.execute(`INSERT INTO don_hang (order_date, order_status, total_price, payment_method_id, user_id, delivery_id,payment_status) VALUES ('${currentDate}', '0', '${totalprice}', '1', '${userId}', '${deliveryId}',0);`)
              const orderId=orderID.insertId;
            
              cartdata.map( async (data)=>{
                console.log("cart data",data);
              await pool.execute(`INSERT INTO chi_tiet_don_hang (unit_price, quantity, promotion_price_order, order_id, size_id, id_product, color_id) VALUES ('${data.price}', '${data.quantity}', '${data.price*data.quantity}', '${orderId}', '${data.size_id}', '${data.id}', '${data.color_id}')`)
            })
              const [email,fields4]=await pool.execute(`SELECT DISTINCT khach_hang.email FROM khach_hang join don_hang on don_hang.user_id=khach_hang.user_id WHERE order_id=${orderId}`)

              console.log("email:",email[0].email);
            const mailOptions = {
              from: 'edwardgbao@gmail.com', // Địa chỉ email người gửi
              to: `${email[0].email}`, // Địa chỉ email người nhận
              subject: 'Cảm ơn bạn đã mua hàng', // Tiêu đề email
              text: `Xin chào,\n\nCảm ơn bạn đã mua hàng. Nhấp vào đường link sau để xem lại đơn hàng của bạn:\n\nhttp://localhost:3000/feedback?order_id=${orderId}`, // Nội dung email
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
              return { status: 200, orderid: orderId };
            }
            catch (error) { 
            console.error(error);
            throw new Error('Lỗi khi đăng ký');
        }
    }    
    static async order_VNPAY(address,numberphone,totalprice,cartdata,userId,name) {
      try {
          const currentDate = new Date().toISOString().split("T")[0];
          console.log("Địa chỉ lỗi",address)
          const [deliveryID,fields2]=await pool.execute(`INSERT INTO thong_tin_giao_hang (name, delevery_status, address, phone_number) VALUES ('${name}', '0', '${address}', '${numberphone}')`)
          const deliveryId=deliveryID.insertId;

          const [orderID,fields3]=await pool.execute(`INSERT INTO don_hang (order_date, order_status, total_price, payment_method_id, user_id, delivery_id,payment_status) VALUES ('${currentDate}', '0', '${totalprice}', '2', '${userId}', '${deliveryId}',0);`)
          const orderId=orderID.insertId;
        
          cartdata.map( async (data)=>{
            console.log("cart data",data);
          await pool.execute(`INSERT INTO chi_tiet_don_hang (unit_price, quantity, promotion_price_order, order_id, size_id, id_product, color_id) VALUES ('${data.price}', '${data.quantity}', '${data.price*data.quantity}', '${orderId}', '${data.size_id}', '${data.id}', '${data.color_id}')`)
        })
        // Ko gui email, cap nhat payment status moi gui
          return { status: 200, orderid: orderId };
        }
        catch (error) { 
        console.error(error);
        throw new Error('Lỗi khi đăng ký');
    }
}  
    static async order_list_wait(filter_order){
        try {
            let query=`SELECT DISTINCT order_id, user_id,don_hang.order_date,total_price,payment_method_id FROM don_hang WHERE order_status=0`;
            if(filter_order=="dateHighToLow"){
              query+=` ORDER BY don_hang.order_date DESC`
            }
            if(filter_order=="idHighToLow"){
              query+=` ORDER BY don_hang.order_id DESC`
            }
            const [rows, fields] = await pool.execute(query);
            return rows;
          } catch (error) {
            console.error(error);
            throw new Error('Lỗi khi lấy danh sách');
          }
    }

    static async order_update_payment_status(order_id){
      try {
          const [rows, fields] = await pool.execute(`UPDATE don_hang SET payment_status = '1' WHERE don_hang.order_id = ${order_id}`);
          const [email,fields4]=await pool.execute(`SELECT DISTINCT khach_hang.email FROM khach_hang join don_hang on don_hang.user_id=khach_hang.user_id WHERE order_id=${order_id}`)
          const mailOptions = {
            from: 'edwardgbao@gmail.com', // Địa chỉ email người gửi
            to: `${email[0].email}`, // Địa chỉ email người nhận
            subject: 'Cảm ơn bạn đã mua hàng', // Tiêu đề email
            text: `Xin chào,\n\nCảm ơn bạn đã mua hàng. Nhấp vào đường link sau để xem lại đơn hàng của bạn:\n\nhttp://localhost:3000/feedback?order_id=${order_id}`, // Nội dung email
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
          // Gửi mail đơn hàng
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách');
        }
  }

    static async delivery_list(){
      try {
          const [rows, fields] = await pool.execute(`SELECT DISTINCT * FROM don_hang join thong_tin_giao_hang on don_hang.delivery_id=thong_tin_giao_hang.delivery_id WHERE don_hang.order_status=1`);
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách');
        }
    }

    static async delivery_status(delivery_id){
      try {
          const [rows, fields] = await pool.execute(`SELECT * from thong_tin_giao_hang WHERE thong_tin_giao_hang.delivery_id=${delivery_id}`);
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách');
        }
    }

    static async postDeliveryUpdate(delivery_id,status){
      try {
          const [rows, fields] = await pool.execute(`UPDATE thong_tin_giao_hang SET delevery_status = '${status}' WHERE thong_tin_giao_hang.delivery_id = ${delivery_id}`);
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách');
        }
    }

    static async order_detail(orderid){
        try {
            const [rows, fields] = await pool.execute(`SELECT DISTINCT chi_tiet_don_hang.id_product,mau.color_name,kich_thuoc.size_name,chi_tiet_don_hang.quantity from don_hang join chi_tiet_don_hang on don_hang.order_id=chi_tiet_don_hang.order_id join ctsp_size on ctsp_size.size_id=chi_tiet_don_hang.size_id AND ctsp_size.id_product=chi_tiet_don_hang.id_product AND ctsp_size.color_id=chi_tiet_don_hang.color_id join kich_thuoc on kich_thuoc.size_id=ctsp_size.size_id join chi_tiet_sp on chi_tiet_sp.id_product=ctsp_size.id_product AND chi_tiet_sp.color_id=ctsp_size.color_id join mau on mau.color_id=chi_tiet_sp.color_id WHERE don_hang.order_id=${orderid}`);
            return rows;
          } catch (error) {
            console.error(error);
            throw new Error('Lỗi khi lấy danh sách');
          }
    }

    static async order_info(orderid){
        try {
            const [rows, fields] = await pool.execute(`SELECT DISTINCT chi_tiet_don_hang.order_id,don_hang.payment_method_id,don_hang.total_price,don_hang.order_status,don_hang.payment_status,thong_tin_giao_hang.name,thong_tin_giao_hang.address,thong_tin_giao_hang.phone_number from don_hang join chi_tiet_don_hang on don_hang.order_id=chi_tiet_don_hang.order_id join thong_tin_giao_hang on thong_tin_giao_hang.delivery_id = don_hang.delivery_id WHERE don_hang.order_id=${orderid}`);
            
            return rows;
          } catch (error) {
            console.error(error);
            throw new Error('Lỗi khi lấy danh sách');
          }
    }

    static async update_order(orderid){
      try {
          const [orders,fields2]=await pool.execute(`SELECT size_id,id_product,color_id,quantity FROM chi_tiet_don_hang WHERE order_id=${orderid}`)
          orders.map( async(data)=>{
            const [quantity,fields3]=await pool.execute(`SELECT qualtity FROM ctsp_size WHERE ctsp_size.size_id = ${data.size_id} AND ctsp_size.id_product = ${data.id_product} AND ctsp_size.color_id = ${data.color_id}`);
            const [sold,fields4]=await pool.execute(`SELECT sold_quantity FROM san_pham WHERE id_product = '${data.id_product}'`);
            let sold_update=sold[0].sold_quantity+data.quantity;
            let quantity_update=(quantity[0].qualtity-data.quantity)
            console.log("SL",quantity_update);

            if(quantity_update<0){
              return 0;
            }
            await pool.execute(`UPDATE ctsp_size SET qualtity = '${quantity_update}' WHERE ctsp_size.size_id = ${data.size_id} AND ctsp_size.id_product = ${data.id_product} AND ctsp_size.color_id = ${data.color_id}`);
            await pool.execute(`UPDATE san_pham SET sold_quantity = '${sold_update}' WHERE san_pham.id_product = ${data.id_product}`);
            console.log(data);
          })

          const [rows, fields] = await pool.execute(`UPDATE don_hang SET order_status = '1' WHERE don_hang.order_id = ${orderid}`);

          return 1;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách');
        }
        
    }

    static async update_order_2(orderid){
      try {
          const [rows, fields] = await pool.execute(`UPDATE don_hang SET order_status = '2' WHERE don_hang.order_id = ${orderid}`);
          return rows;
        } catch (error) {
          console.error(error);
          throw new Error('Lỗi khi lấy danh sách');
        }
        
    }

    static async feedBack(order_id) {
      try {
        const [rows, fields]= await pool.execute(`SELECT chi_tiet_don_hang.id_product,san_pham.product_name,kich_thuoc.size_name,mau.color_name,chi_tiet_don_hang.quantity,chi_tiet_don_hang.promotion_price_order from chi_tiet_don_hang join san_pham on san_pham.id_product=chi_tiet_don_hang.id_product join mau on chi_tiet_don_hang.color_id=mau.color_id join kich_thuoc on kich_thuoc.size_id=chi_tiet_don_hang.size_id WHERE chi_tiet_don_hang.order_id=${order_id}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async feedBackAddress(order_id) {
      try {
        const [rows, fields]= await pool.execute(`SELECT thong_tin_giao_hang.name,thong_tin_giao_hang.address,thong_tin_giao_hang.phone_number,don_hang.order_date,don_hang.payment_method_id,don_hang.payment_status from thong_tin_giao_hang join don_hang on don_hang.delivery_id=thong_tin_giao_hang.delivery_id WHERE don_hang.order_id=${order_id}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }
}

module.exports = OderModel;