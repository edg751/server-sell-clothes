// get the client
import mysql from 'mysql2/promise';
// var mysql=require('mysql')
// create the connection to database
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user:'root',
  password:'',
  database:'databaseclothes'
});

export default pool;
