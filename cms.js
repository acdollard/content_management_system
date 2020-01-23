let mysql = require("mysql");
let inquirer = require("inquirer");
let cTable = require("console.table");
let SQL_info = require("./SQL_info");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: SQL_info.username,
  
    // Your password
    password: SQL_info.password,
    database: "CMS_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("Connected to database.");
    connection.query("SELECT first_name, last_name, title, salary, dept.name FROM employee as emp LEFT JOIN role as role ON emp.role_id=role.id INNER JOIN department as dept ON dept.id=role.department_id", function(err, result) {
        if (err) throw err;
        console.table(result);
    })
  });