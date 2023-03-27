// get the client
import mysql from 'mysql2/promise';
// var mysql=require('mysql')
// create the connection to database
const pool = mysql.createPool({
  host: 'db4free.net',
  port: 3306,
  user:'bao266',
  password:'Lemkhungf',
  database:'bao266',
  connectionLimit:100,
  multipleStatements:true
});

export default pool;
