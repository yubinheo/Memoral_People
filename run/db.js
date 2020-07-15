var mysql = require('mysql'); // module import

var conn = mysql.createConnection({
    host     : 'localhost', // mysql host
    user     : 'root', // mysql id
    password : 'root', // mysql pwd
    port     : 3306, // mysql port (default 3306)
    database : 'memorial_people', // database name
    multipleStatements: true
  });
  
module.exports = conn;