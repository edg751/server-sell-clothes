import pool from "../configs/connectDB";
class ProductModel {
    static async getProducts(pageSize,page,gender,category,price,color,style,material,orderby,search) {
      try {
        let query = `SELECT DISTINCT san_pham.id_product, san_pham.product_name, san_pham.price FROM san_pham JOIN chi_tiet_sp ON san_pham.id_product = chi_tiet_sp.id_product 
        JOIN ctsp_size ON ctsp_size.id_product = chi_tiet_sp.id_product join loai_sp on loai_sp.category_id=san_pham.category_id join mau on mau.color_id=chi_tiet_sp.color_id 
        join san_pham_phong_cach on san_pham_phong_cach.id_product=san_pham.id_product join phong_cach on phong_cach.style_id=san_pham_phong_cach.style_id join vat_lieu on vat_lieu.material_id=san_pham.material_id
        WHERE ctsp_size.qualtity > 0`;

        if (gender) {
          query += ` AND (san_pham.gioi_tinh = ${gender} OR san_pham.gioi_tinh = 2)`;
        }
    
        if (category) {
          const categoryArray = Array.isArray(category) ? category : [category];
          const categoryCondition = categoryArray.map(category => `loai_sp.category_name = '${category}'`).join(' OR ');
          query += ` AND (${categoryCondition})`;
        }

        if(search){
          query += ` AND san_pham.product_name LIKE "%${search}%"`;
        }
        
        if (price) {
          let priceCondition = '';
          
          if (price === 'lessThan100k') {
            priceCondition = "san_pham.price < 100000";
          } else if (price === '100kTo250k') {
            priceCondition = "san_pham.price >= 100000 AND san_pham.price <= 250000";
          } else if (price === '250kTo500k') {
            priceCondition = "san_pham.price >= 250000 AND san_pham.price <= 500000";
          } else if (price === 'greaterThan500k') {
            priceCondition = "san_pham.price > 500000";
          }
          
          if (priceCondition) {
            query += ` AND (${priceCondition})`;
          }
        }

        if (color) {
          const colorArray = Array.isArray(color) ? color : [color];
          const colorCondition = colorArray.map(color => `mau.color_name = '${color}'`).join(' OR ');
          query += ` AND (${colorCondition})`;
        }

        if (style) {
          const styleArray = Array.isArray(style) ? style : [style];
          const styleCondition = styleArray.map(style => `phong_cach.style_name = '${style}'`).join(' OR ');
          query += ` AND (${styleCondition})`;
        }
    
        if (material) {
          const materialArray = Array.isArray(material) ? material : [material];
          const materialCondition = materialArray.map(material => `vat_lieu.material_name = '${material}'`).join(' OR ');
          query += ` AND (${materialCondition})`;
        }

        if (orderby !== 'default' && orderby) {
          let orderByCondition = '';
          if (orderby === 'bestselling') {
            orderByCondition = 'san_pham.sold_quantity DESC';
          } else if (orderby === 'priceLowToHigh') {
            orderByCondition = 'san_pham.price ASC';
          } else if (orderby === 'priceHighToLow') {
            orderByCondition = 'san_pham.price DESC';
          } else if (orderby === 'newest') {
            orderByCondition = 'san_pham.created_date DESC';
          }
          query += ` ORDER BY ${orderByCondition}`;
        }

        const offset = (page - 1) * pageSize;
        query += ` LIMIT ${pageSize} OFFSET ${offset}`;
        const [rows, fields] = await pool.execute(query);

        for (const item of rows) {
          const [rows, fields] = await pool.execute(`Select DISTINCT chi_tiet_sp.color_id,color_code,color_name from mau join chi_tiet_sp on chi_tiet_sp.color_id=mau.color_id join ctsp_size on ctsp_size.color_id=mau.color_id 
          WHERE ctsp_size.qualtity>0 AND chi_tiet_sp.id_product=${item.id_product}`);
          
          item.colors_list = rows;
        }

        for (const item of rows) {
          const [rows, fields] = await pool.execute(`SELECT DISTINCT hinh_anh.pic_id,hinh_anh.pic_link,hinh_anh.color_id from hinh_anh JOIN chi_tiet_sp on chi_tiet_sp.color_id=hinh_anh.color_id AND hinh_anh.id_product=chi_tiet_sp.id_product
          WHERE hinh_anh.is_represent=1 AND chi_tiet_sp.id_product=${item.id_product}`);
          
          item.images_list = rows;
        }

        return rows;

      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
    }


    static async getProductDetail(productid,colorid) {
      try {
        const [rows, fields] = await pool.execute(`SELECT DISTINCT * FROM san_pham WHERE san_pham.id_product=${productid}`);


        let image_query=`select DISTINCT pic_id,pic_link,hinh_anh.color_id from hinh_anh join chi_tiet_sp on
        chi_tiet_sp.id_product=hinh_anh.id_product join mau on mau.color_id=chi_tiet_sp.color_id WHERE chi_tiet_sp.id_product=${productid} `

         if (colorid) {
          image_query += ` AND hinh_anh.color_id=${colorid}`;
        }

        const [images, images_fields] = await pool.execute(image_query);


         //AND hinh_anh.color_id=1
        const [colors, colors_fields] = await pool.execute(`SELECT DISTINCT mau.color_id,mau.color_name,mau.color_code from mau join chi_tiet_sp on chi_tiet_sp.color_id=mau.color_id WHERE chi_tiet_sp.id_product=${productid}`);

        const [size, size_fields] = await pool.execute(`SELECT DISTINCT kich_thuoc.size_id,kich_thuoc.size_name FROM kich_thuoc join ctsp_size on ctsp_size.size_id=kich_thuoc.size_id join chi_tiet_sp on chi_tiet_sp.id_product=ctsp_size.id_product 
        WHERE chi_tiet_sp.id_product=${productid}`);
        
        rows[0].images_list=images;
        rows[0].colors_list=colors;
        rows[0].size_list=size;
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy chi tiết sản phẩm');
      }
    }
    
    static async getCategories(gender) {
      try {

        let query=`SELECT DISTINCT loai_sp.category_id,category_name FROM loai_sp join san_pham on loai_sp.category_id=san_pham.category_id `
        if(gender){
          query+=`WHERE san_pham.gioi_tinh=${gender} OR san_pham.gioi_tinh=2`
        }
        const [rows, fields] = await pool.execute(query);
        // `SELECT DISTINCT loai_sp.category_id,category_name FROM loai_sp join san_pham on loai_sp.category_id=san_pham.category_id WHERE san_pham.gioi_tinh=${gender} OR san_pham.gioi_tinh=2`
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách danh mục');
      }
    }

    static async getUpdateProduct(idproduct) {
      try {
        let query=`SELECT * from san_pham join san_pham_phong_cach on san_pham_phong_cach.id_product=san_pham.id_product JOIN phong_cach on phong_cach.style_id=san_pham_phong_cach.style_id WHERE san_pham.id_product=${idproduct}`
        const [rows, fields] = await pool.execute(query);
        // `SELECT DISTINCT loai_sp.category_id,category_name FROM loai_sp join san_pham on loai_sp.category_id=san_pham.category_id WHERE san_pham.gioi_tinh=${gender} OR san_pham.gioi_tinh=2`
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách danh mục');
      }
    }

    static async postProductUpdate(productName,price,description,gender,category,material,styled,is_active,productid) {
      try {
        let query=`UPDATE san_pham SET product_name = '${productName}', price = '${price}', product_description = '${description}', gioi_tinh = '${gender}', is_active = '${is_active}',category_id = '${category}', material_id = '${material}' WHERE san_pham.id_product = ${[productid]}`
        const [rows, fields] = await pool.execute(query);
        await pool.execute(`UPDATE san_pham_phong_cach SET style_id = '${styled}' WHERE san_pham_phong_cach.id_product = ${productid}`)
        // `SELECT DISTINCT loai_sp.category_id,category_name FROM loai_sp join san_pham on loai_sp.category_id=san_pham.category_id WHERE san_pham.gioi_tinh=${gender} OR san_pham.gioi_tinh=2`
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách danh mục');
      }
    }

    static async getColors(gender) {
      try {
        let query=`SELECT DISTINCT mau.color_id,color_name,color_code FROM mau join chi_tiet_sp on chi_tiet_sp.color_id=mau.color_id join san_pham on san_pham.id_product=chi_tiet_sp.id_product `;
        if(gender){
          query+=`WHERE san_pham.gioi_tinh=${gender} OR san_pham.gioi_tinh=2`
        }
        const [rows, fields] = await pool.execute(query);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getStyles(gender) {
      try {
        let query=`SELECT DISTINCT phong_cach.style_id,phong_cach.style_name FROM phong_cach join san_pham_phong_cach on san_pham_phong_cach.style_id=phong_cach.style_id join san_pham on san_pham.id_product=san_pham_phong_cach.id_product `
        if(gender){
          query+=`WHERE san_pham.gioi_tinh=${gender} OR san_pham.gioi_tinh=2`
        }
        const [rows, fields] = await pool.execute(query);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách phong cách');
      }
    }

    static async getMaterials(gender) {
      try {
        let query=`SELECT DISTINCT vat_lieu.material_id,vat_lieu.material_name FROM san_pham join vat_lieu on vat_lieu.material_id=san_pham.material_id `;
        if(gender){
          query+=`WHERE san_pham.gioi_tinh=${gender} OR san_pham.gioi_tinh=2`
        }
        const [rows, fields] = await pool.execute(query);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách loại vải');
      }
    }

    static async getProductListAdmin() {
      try {
        const [rows, fields] = await pool.execute(`SELECT DISTINCT san_pham.id_product,san_pham.product_name,san_pham.price FROM san_pham`);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
    }

    static async getProductDetailAdmin(productid) {

      try {
        const [rows, fields] = await pool.execute(`SELECT DISTINCT mau.color_id,kich_thuoc.size_id, mau.color_name,kich_thuoc.size_name,qualtity FROM ctsp_size join kich_thuoc on kich_thuoc.size_id=ctsp_size.size_id join chi_tiet_sp on chi_tiet_sp.id_product=ctsp_size.id_product AND chi_tiet_sp.color_id=ctsp_size.color_id join mau on mau.color_id=chi_tiet_sp.color_id where ctsp_size.id_product=${productid}`);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
    }

    static async postUpdateQuantityProduct(productListDetail,productid,imageDetail) {
      try {
        productListDetail.map( async data=>{
          const [rows, fields] = await pool.execute(`UPDATE ctsp_size SET qualtity = '${data.quantity}' WHERE ctsp_size.size_id = ${data.size_id} AND ctsp_size.id_product = ${productid} AND ctsp_size.color_id = ${data.color_id}`);
        })
        imageDetail.map(async data=>{
          await pool.execute(`UPDATE hinh_anh SET pic_link = '${data.pic_link}' WHERE hinh_anh.pic_id = ${data.pic_id}`)
        })

        return productid;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async postAddCategory(categoryName) {
      try {
        const [rows, fields]= await pool.execute(`INSERT INTO loai_sp (category_name) VALUES ('${categoryName}')`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getDetailCategory(categoryId) {
      try {
        const [rows, fields]= await pool.execute(`SELECT * FROM loai_sp WHERE category_id=${categoryId}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getAllCategory() {
      try {
        const [rows, fields]= await pool.execute(`SELECT * FROM loai_sp`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async postUpdateCategory(categoryName,categoryId) {
      try {
        const [rows, fields]= await pool.execute(`UPDATE loai_sp SET category_name = '${categoryName}' WHERE loai_sp.category_id = ${categoryId}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }
    // MATERIAL
    static async postAddMaterial(materialName) {
      try {
        const [rows, fields]= await pool.execute(`INSERT INTO vat_lieu (material_name) VALUES ('${materialName}')`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getDetailMaterial(materialId) {
      try {
        const [rows, fields]= await pool.execute(`SELECT * FROM vat_lieu WHERE material_id=${materialId}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getAllMaterial() {
      try {
        const [rows, fields]= await pool.execute(`SELECT * FROM vat_lieu`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async postUpdateMaterial(materialName,materialId) {
      try {
        const [rows, fields]= await pool.execute(`UPDATE vat_lieu SET material_name = '${materialName}' WHERE vat_lieu.material_id = ${materialId}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }
    // STYLE

    static async postAddStyle(styleName) {
      try {
        const [rows, fields]= await pool.execute(`INSERT INTO phong_cach (style_name) VALUES ('${styleName}')`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getDetailStyle(styleId) {
      try {
        const [rows, fields]= await pool.execute(`SELECT * FROM phong_cach WHERE style_id=${styleId}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getAllStyle() {
      try {
        const [rows, fields]= await pool.execute(`SELECT * FROM phong_cach`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async postUpdateStyle(styleName,styleId) {
      try {
        const [rows, fields]= await pool.execute(`UPDATE phong_cach SET style_name = '${styleName}' WHERE phong_cach.style_id = ${styleId}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    // COLOR
    static async postAddColor(colorName,colorCode) {
      try {
        const [rows, fields]= await pool.execute(`INSERT INTO mau (color_name,color_code) VALUES ('${colorName}','${colorCode}')`);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getDetailColor(colorId) {
      try {
        const [rows, fields]= await pool.execute(`SELECT * FROM mau WHERE color_id=${colorId}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getAllColor() {
      try {
        const [rows, fields]= await pool.execute(`SELECT * FROM mau`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async postUpdateColor(colorName,colorCode,colorId) {
      try {
        const [rows, fields]= await pool.execute(`UPDATE mau SET color_name = '${colorName}',color_code = '${colorCode}' WHERE mau.color_id = ${colorId}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async postReview(productid,userid,comment,star) {
      try {
        const currentDate = new Date().toISOString().split("T")[0];

        const [don_hang, fields]= await pool.execute(`SELECT don_hang.order_id,chi_tiet_don_hang.size_id,chi_tiet_don_hang.id_product,chi_tiet_don_hang.color_id 
        FROM khach_hang join don_hang on khach_hang.user_id=don_hang.user_id join chi_tiet_don_hang on chi_tiet_don_hang.order_id=don_hang.order_id 
        WHERE khach_hang.user_id=${userid} AND chi_tiet_don_hang.id_product=${productid} LIMIT 1`)
        
        await pool.execute(`INSERT INTO chi_tiet_bl (comments, score_rating, date_created, order_id, size_id, id_product, color_id) VALUES ('${comment}', '${star}', '${currentDate}', '${don_hang[0].order_id}', '${don_hang[0].size_id}', '${don_hang[0].id_product}', '${don_hang[0].color_id}')`)
        
        const [san_pham,fields2]=await pool.execute(`SELECT * FROM san_pham where san_pham.id_product=${productid}`)
        let count=san_pham[0].count_rating+1;
        let stars=((san_pham[0].rating*san_pham[0].count_rating+star)/(san_pham[0].count_rating));
        console.log("Đếm",count);
        console.log("Sao",stars);
        if(san_pham[0].count_rating==0){
        await pool.execute(`UPDATE san_pham SET rating = '${star}', count_rating = '1' WHERE san_pham.id_product = ${productid}`)
        }else{
        await pool.execute(`UPDATE san_pham SET rating = '${stars}', count_rating = '${count}' WHERE san_pham.id_product = ${productid}`)
        }

        
        return don_hang;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getComment(idproduct) {
      try {
        const [rows, fields] = await pool.execute(`SELECT khach_hang.full_name,chi_tiet_bl.comments,chi_tiet_bl.score_rating FROm khach_hang join don_hang on don_hang.user_id=khach_hang.user_id join chi_tiet_don_hang on chi_tiet_don_hang.order_id=don_hang.order_id join chi_tiet_bl on chi_tiet_bl.id_product=chi_tiet_don_hang.id_product AND chi_tiet_bl.order_id=chi_tiet_don_hang.order_id WHERE chi_tiet_don_hang.id_product=${idproduct}`);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
    }
// SIZE
    static async getSize() {
      try {
        const [rows, fields] = await pool.execute(`SELECT * from kich_thuoc`);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
    }

    static async getListColorImage(productid) {
      try {
        const [rows, fields] = await pool.execute(`SELECT DISTINCT mau.color_id,mau.color_name FROm chi_tiet_sp join mau on mau.color_id=chi_tiet_sp.color_id WHERE chi_tiet_sp.id_product=${productid}`);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
    }

    static async getListLinkImage(productid) {
      try {
        const [rows, fields] = await pool.execute(`SELECT DISTINCT hinh_anh.pic_id,mau.color_id, mau.color_name,hinh_anh.pic_link FROM ctsp_size join kich_thuoc on kich_thuoc.size_id=ctsp_size.size_id join chi_tiet_sp on chi_tiet_sp.id_product=ctsp_size.id_product AND chi_tiet_sp.color_id=ctsp_size.color_id join mau on mau.color_id=chi_tiet_sp.color_id join hinh_anh on hinh_anh.id_product=chi_tiet_sp.id_product AND hinh_anh.color_id=chi_tiet_sp.color_id where ctsp_size.id_product=${productid} ORDER BY hinh_anh.pic_id ASC`);
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
    }






    static async postAddProduct(name,price,description,gender_id,category_id,material_id,color_list,style_id,size_list) {
      console.log(color_list)
      const currentDate = new Date().toISOString().split("T")[0];
      try {
        const [productId,fields1]=await pool.execute(`INSERT INTO san_pham (product_name, price, sold_quantity, created_date, product_description, gioi_tinh, rating, count_rating, is_active, category_id, material_id) VALUES ('${name}', '${price}', '0', '${currentDate}', '${description}', '${gender_id}', '0', '0', '1', '${category_id}', '${material_id}')`)
        await pool.execute(`INSERT INTO san_pham_phong_cach (style_id, id_product) VALUES ('${style_id}', '${productId.insertId}')`)
        
        color_list.map( async (dataColor)=>{
          await pool.execute(`INSERT INTO chi_tiet_sp (id_product, color_id) VALUES ('${productId.insertId}', '${dataColor.color_id}')`)

          await pool.execute(`INSERT INTO hinh_anh (pic_link, is_represent, id_product, color_id) VALUES ('https://bizweb.dktcdn.net/thumb/large/100/438/408/products/apm3299-xxm-7.jpg?v=1688723498000', '1', '${productId.insertId}', '${dataColor.color_id}')`)
          await pool.execute(`INSERT INTO hinh_anh (pic_link, is_represent, id_product, color_id) VALUES ('https://bizweb.dktcdn.net/thumb/large/100/438/408/products/apm3299-xxm-7.jpg?v=1688723498000', '0', '${productId.insertId}', '${dataColor.color_id}')`)
          await pool.execute(`INSERT INTO hinh_anh (pic_link, is_represent, id_product, color_id) VALUES ('https://bizweb.dktcdn.net/thumb/large/100/438/408/products/apm3299-xxm-7.jpg?v=1688723498000', '0', '${productId.insertId}', '${dataColor.color_id}')`)
          await pool.execute(`INSERT INTO hinh_anh (pic_link, is_represent, id_product, color_id) VALUES ('https://bizweb.dktcdn.net/thumb/large/100/438/408/products/apm3299-xxm-7.jpg?v=1688723498000', '0', '${productId.insertId}', '${dataColor.color_id}')`)
          await pool.execute(`INSERT INTO hinh_anh (pic_link, is_represent, id_product, color_id) VALUES ('https://bizweb.dktcdn.net/thumb/large/100/438/408/products/apm3299-xxm-7.jpg?v=1688723498000', '0', '${productId.insertId}', '${dataColor.color_id}')`)
          await pool.execute(`INSERT INTO hinh_anh (pic_link, is_represent, id_product, color_id) VALUES ('https://bizweb.dktcdn.net/thumb/large/100/438/408/products/apm3299-xxm-7.jpg?v=1688723498000', '0', '${productId.insertId}', '${dataColor.color_id}')`)

          size_list.map(async (dataSize)=>{
            await pool.execute(`INSERT INTO ctsp_size (qualtity, size_id, id_product, color_id) VALUES ('0', '${dataSize.size_id}', '${productId.insertId}', '${dataColor.color_id}')`)

          })
        })
        return productId.insertId;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
    }

    static async getFavorite(productid,userid) {
      try {
        const [rows, fields]= await pool.execute(`SELECT * from ds_yeu_thich WHERE user_id=${productid} AND id_product=${userid}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async getReview(productid,userid) {
      console.log(productid)
      console.log(userid)

      try {
        const [rows, fields]= await pool.execute(`SELECT DISTINCT khach_hang.user_id,chi_tiet_don_hang.id_product FROm khach_hang join don_hang on khach_hang.user_id=don_hang.user_id 
        join thong_tin_giao_hang on thong_tin_giao_hang.delivery_id=don_hang.delivery_id join chi_tiet_don_hang on chi_tiet_don_hang.order_id=don_hang.order_id WHERE khach_hang.user_id=${userid} 
        AND chi_tiet_don_hang.id_product=${productid} AND thong_tin_giao_hang.delevery_status=2`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }

    static async postRemoveFavorite(productid,userid) {
      try {
        const [rows, fields]= await pool.execute(`DELETE FROM ds_yeu_thich WHERE user_id=${userid} AND id_product=${productid}`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }


    static async postAddFavorite(productid,userid) {
      try {
        const [rows, fields]= await pool.execute(`INSERT INTO ds_yeu_thich (id_product,user_id) VALUES ('${productid}', '${userid}')`)    
        return rows;
      } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách màu');
      }
    }
  }
  module.exports = ProductModel;