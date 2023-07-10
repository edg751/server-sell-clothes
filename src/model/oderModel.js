import pool from "../configs/connectDB";
class OderModel {
    static async order(email, password, fullname,address,numberphone,totalprice,cartdata) {
        console.log("email",email)
        console.log("password",password)
        console.log("fullname",fullname)

        // KHACH_HANG
        if(!email && !password){
          email=null,
          password=null
        }
          try {
              const [userid,fields] = await pool.execute(`INSERT INTO khach_hang (email, password, full_name, is_active) VALUES (?, ?, ?, 0)`, [email, password, fullname]);
              const userID=userid.insertId;

              const currentDate = new Date().toISOString().split("T")[0];
              const [deliveryID,fields2]=await pool.execute(`INSERT INTO thong_tin_giao_hang (start_delevery_date, delevery_status, address, phone_number) VALUES ('${currentDate}', '0', '${address}', '${numberphone}'); `)
              const deliveryId=deliveryID.insertId;

              const [orderID,fields3]=await pool.execute(`INSERT INTO don_hang (order_date, order_status, total_price, payment_method_id, user_id, delivery_id) VALUES ('${currentDate}', '0', '${totalprice}', '1', '${userID}', '${deliveryId}');`)
              const orderId=orderID.insertId;
            
              cartdata.map( async (data)=>{
                console.log("cart data",data);
              await pool.execute(`INSERT INTO chi_tiet_don_hang (unit_price, quantity, promotion_price_order, order_id, size_id, id_product, color_id) VALUES ('${data.price}', '${data.quantity}', '${data.price*data.quantity}', '${orderId}', '${data.size_id}', '${data.id}', '${data.color_id}')`)

              })

              return { status: 201, message: "Đăng ký thành công" };
            }
            catch (error) { 
            console.error(error);
            throw new Error('Lỗi khi đăng ký');
        }


          //THONG_TIN_GIAO_HANG
    }    
    static async order_list_wait(){
        try {
            const [rows, fields] = await pool.execute(`SELECT DISTINCT order_id, user_id FROM don_hang`);
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
            const [rows, fields] = await pool.execute(`SELECT DISTINCT chi_tiet_don_hang.order_id,don_hang.payment_method_id,don_hang.total_price,don_hang.order_status,khach_hang.full_name,thong_tin_giao_hang.address,thong_tin_giao_hang.phone_number from don_hang join chi_tiet_don_hang on don_hang.order_id=chi_tiet_don_hang.order_id join thong_tin_giao_hang on thong_tin_giao_hang.delivery_id = don_hang.delivery_id join khach_hang on khach_hang.user_id=don_hang.user_id WHERE don_hang.order_id=${orderid}`);
            return rows;
          } catch (error) {
            console.error(error);
            throw new Error('Lỗi khi lấy danh sách');
          }
    }
}

module.exports = OderModel;