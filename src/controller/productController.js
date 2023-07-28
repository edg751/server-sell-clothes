import ProductModel from "../model/productModel";
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({ 
  cloud_name: 'dsopmggtb', 
  api_key: '128841183738398', 
  api_secret: 'iOR18H_0gFw-iIdOYZLJpzhkFuw' 
});
class ProductController {

    static async getProducts(req, res) {
      try {
        const products = await ProductModel.getProducts(req.query.pageSize,req.query.page,req.query.gender,req.query.category,req.query.price,req.query.color,req.query.style,req.query.material,req.query.orderby,req.query.search);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getProductDetail(req, res) {
      try {
        const categories = await ProductModel.getProductDetail(req.query.productid,req.query.color);
        return res.status(200).json(categories);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getCategories(req, res) {
      try {
        const categories = await ProductModel.getCategories(req.query.gender);
        return res.status(200).json(categories);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }


    static async getColors(req, res) {
      try {
        const colors = await ProductModel.getColors(req.query.gender);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getStyles(req, res) {
      try {
        const colors = await ProductModel.getStyles(req.query.gender);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getMaterials(req, res) {
      try {
        const colors = await ProductModel.getMaterials(req.query.gender);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getUpdateProduct(req, res) {
      try {
        const colors = await ProductModel.getUpdateProduct(req.query.productid);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getFavorite(req, res) {
      try {
        const colors = await ProductModel.getFavorite(req.query.productid,req.query.userid);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getCorlorListOnItem(req, res) {
      try {
        const colors = await ProductModel.getCorlorListOnItem(req.query.productid);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getSizeListOnItem(req, res) {
      try {
        const colors = await ProductModel.getSizeListOnItem(req.query.productid);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getQuantityItem(req, res) {
      try {
        const colors = await ProductModel.getQuantityItem(req.query.productid,req.query.color_id,req.query.size_id);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }


    static async getReview(req, res) {
      try {
        const colors = await ProductModel.getReview(req.query.productid,req.query.userid);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getComment(req, res) {
      try {
        const colors = await ProductModel.getComment(req.query.productid);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postReview(req, res) {
      try {
        const colors = await ProductModel.postReview(req.body.productid,req.body.userid,req.body.comment,req.body.star);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postProductUpdate(req, res) {
      let productName=req.body.productName;
      let price=req.body.price;
      let description=req.body.description;
      let gender=req.body.gender_id;
      let category=req.body.category_id;
      let material=req.body.material_id;
      let styled=req.body.style_id;
      let is_active=req.body.is_active;
      let productid=req.body.idproduct;
      try {
        const colors = await ProductModel.postProductUpdate(productName,price,description,gender,category,material,styled,is_active,productid);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getSize(req, res) {
      try {
        const colors = await ProductModel.getSize();
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getProductListAdmin(req, res) {
      try {
        const products = await ProductModel.getProductListAdmin();
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }


    static uploadImage = async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        // Lấy đường dẫn
        const imageUrl = result.secure_url;
        return imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    };
  
    static async postUploadImage(req, res) {
      try {
        if (!req.file) {
          throw new Error('No file uploaded');
        }
        const imageUrl = await ProductController.uploadImage(req.file);
        res.send({ imageUrl });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
      }
    }

    static async getProductDetailAdmin(req, res) {
      try {
        const products = await ProductModel.getProductDetailAdmin(req.query.productid);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getListLinkImage(req, res) {
      try {
        const products = await ProductModel.getListLinkImage(req.query.productid);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    

    static async postAddProduct(req, res) {
      const product_name=req.body.productName;
      const price=req.body.price;
      const description=req.body.description;
      const gender_id=req.body.gender_id;
      const category_id=req.body.category_id;
      const material_id=req.body.material_id;
      const color_list=req.body.color_list;
      const style_id=req.body.style_id;
      const size_list=req.body.size_list;
      try {
        const products = await ProductModel.postAddProduct(product_name,price,description,gender_id,category_id,material_id,color_list,style_id,size_list);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }


    static async postUpdateQuantityProduct(req, res) {
      try { 

        const products = await ProductModel.postUpdateQuantityProduct(req.body.productListDetail,req.body.productid,req.body.imageDetail);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postAddCategory(req, res) {
      try { 
        const products = await ProductModel.postAddCategory(req.body.category_name);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postRemoveFavorite(req, res) {
      try { 
        const products = await ProductModel.postRemoveFavorite(req.body.idProduct,req.body.user_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postAddFavorite(req, res) {
      try { 
        const products = await ProductModel.postAddFavorite(req.body.idProduct,req.body.user_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }



    static async getAllCategory(req, res) {
      try { 
        const products = await ProductModel.getAllCategory();
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getDetailCategory(req, res) {
      try { 
        const products = await ProductModel.getDetailCategory(req.query.category_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postUpdateCategory(req, res) {
      try { 
        const products = await ProductModel.postUpdateCategory(req.body.category_name,req.body.category_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }
    // MATERIAL
    static async postAddMaterial(req, res) {
      try { 
        const products = await ProductModel.postAddMaterial(req.body.material_name);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getAllMaterial(req, res) {
      try { 
        const products = await ProductModel.getAllMaterial();
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getDetailMaterial(req, res) {
      try { 
        const products = await ProductModel.getDetailMaterial(req.query.material_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postUpdateMaterial(req, res) {
      try { 
        const products = await ProductModel.postUpdateMaterial(req.body.material_name,req.body.material_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }
    // STYLE
    static async postAddStyle(req, res) {
      try { 
        const products = await ProductModel.postAddStyle(req.body.style_name);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getAllStyle(req, res) {
      try { 
        const products = await ProductModel.getAllStyle();
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getDetailStyle(req, res) {
      try { 
        const products = await ProductModel.getDetailStyle(req.query.style_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postUpdateStyle(req, res) {
      try { 
        const products = await ProductModel.postUpdateStyle(req.body.style_name,req.body.style_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }
        // COLOR
    static async postAddColor(req, res) {
      try { 
        const products = await ProductModel.postAddColor(req.body.color_name,req.body.color_code);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getAllColor(req, res) {
      try { 
        const products = await ProductModel.getAllColor();
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getStatistical(req, res) {
      try { 
        const products = await ProductModel.getStatistical();
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getDetailColor(req, res) {
      try { 
        const products = await ProductModel.getDetailColor(req.query.color_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postUpdateColor(req, res) {
      try { 
        const products = await ProductModel.postUpdateColor(req.body.color_name,req.body.color_code,req.body.color_id);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postAddProductPromotion(req, res) {

      try { 
        const products = await ProductModel.postAddProductPromotion(req.body.id_PM,req.body.productList);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getDetailPromotion(req, res) {
      try { 
        const products = await ProductModel.getDetailPromotion(req.query.idPM);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async postUpdateDetailPromotion(req, res) {
      try { 
        const products = await ProductModel.postUpdateDetailPromotion(req.body.idPM,req.body.todate,req.body.fromdate,req.body.description,req.body.percent,req.body.status);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }


    
    static async postRemoveProductPromotion(req, res) {

      try { 
        const products = await ProductModel.postRemoveProductPromotion(req.body.id_PM,req.body.id_product);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }


    static async getListProduct(req, res) {
      try { 
        const products = await ProductModel.getListProduct(req.query.idPM);
        return res.status(200).json(products);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    
    static async getPromotionList(req, res) {
      try {
        const colors = await ProductModel.getPromotionList();
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

    static async getPromotionListPromotion(req, res) {
      try {
        const colors = await ProductModel.getPromotionListPromotion(req.query.promotion_id);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }
    static async postAddPromotion(req, res) {
      try {
        const colors = await ProductModel.postAddPromotion(req.body.promotionDescription,req.body.percent,req.body.todate,req.body.fromdate,);
        return res.status(200).json(colors);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
      }
    }

  }
  module.exports = ProductController;