import pool from '../configs/connectDB';
let getAllItems = async (req, res) => {
  const array = await pool.execute(
    'SELECT * FROM sanpham'
  );
  return res.status(200).json({
    data: array[0],
  });
};
module.exports = {
  getAllItems,
};
