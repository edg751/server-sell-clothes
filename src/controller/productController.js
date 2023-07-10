import ProductModel from "../model/productModel";
class ProductController {

    static async getProducts(req, res) {
      try {
        const products = await ProductModel.getProducts(req.query.pageSize,req.query.page,req.query.gender,req.query.category,req.query.price,req.query.color,req.query.style,req.query.material,req.query.orderby);
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



  }
  module.exports = ProductController;