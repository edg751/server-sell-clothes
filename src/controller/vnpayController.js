const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');
const cors = require('cors');
import OderModel from "../model/oderModel";

class VnpayController {
  static async createPayment(req, res) {
    function sortObject(obj) {
      let sorted = {};
      let str = [];
      let key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          str.push(encodeURIComponent(key));
        }
      }
      str.sort();
      for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
          /%20/g,
          "+"
        );
      }
      return sorted;
    }
    try {
      process.env.TZ = "Asia/Ho_Chi_Minh";
      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let tmnCode = "8HUAZIIP";
      let secretKey = "XISCIMAQAPYKTHASFEWICTNBWKTDSXUK";
      let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
      let returnUrl = "http://localhost:3500/vnpay_return";
      let orderId = req.query.order_id;
      let amount = req.query.amount;
      let bankCode = req.query.bankCode;

      let locale = req.query.language;
      if (locale === null || locale === "") {
        locale = "vn";
      }
      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = `Thanh toan cho ma GD: ${orderId}`;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = parseFloat(amount) * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      let signData = querystring.stringify(vnp_Params, { encode: false });
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac
        .update(new Buffer.from(signData, "utf-8"))
        .digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      console.log("link", vnpUrl);
      res.status(200).json({ vnpUrl: vnpUrl });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server" });
    }
  }



  static async vnpayReturn(req, res) {
    function sortObject(obj) {
      let sorted = {};
      let str = [];
      let key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          str.push(encodeURIComponent(key));
        }
      }
      str.sort();
      for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
          /%20/g,
          "+"
        );
      }
      return sorted;
    }
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = "8HUAZIIP"; 
    let secretKey = "XISCIMAQAPYKTHASFEWICTNBWKTDSXUK";

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      // Kiểm tra xem dữ liệu trong db có hợp lệ hay không và thông báo kết quả
      // Cập nhật lại đơn hàng trong MySQL ở đây
      await OderModel.order_update_payment_status(vnp_Params.vnp_TxnRef);
      res.redirect(`http://localhost:3000/feedback?order_id=${vnp_Params.vnp_TxnRef}`);
    } else {
      res.send("Payment failed");
    }
    
  }
}
module.exports = VnpayController;
