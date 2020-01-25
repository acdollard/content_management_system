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
    // connection.query("SELECT first_name, last_name, title, salary, dept.name FROM employee as emp LEFT JOIN role as role ON emp.role_id=role.id INNER JOIN department as dept ON dept.id=role.department_id", function(err, result) {
    //     if (err) throw err;
    //     console.table(result);
        // showData();
        runSearch();
  
      });
    
    




function runSearch() {
      inquirer.prompt([
          {
              name: "action",
              type: "list",
              message: "What would you like to do?",
              choices: [
                    "view all employees",
                    "view all by department",
                    "view all by manager",
                    "add employee",
                    "remove employee",
                    "update employee role",
                    "update employee manager"
              ]
          }
      ]).then(function(data){
          switch (data.action) {
            case "view all employees":
            showData();
            break;

            case "view all by department":
            //function
            break;

            case "view all by manager":
            showManagers();
            break;

            case "add employee":
            //function
            break;

            case "remove employee":
            //function
            break;

            case "update employee role":
            //function
            break;

            case "update employee manager":
            //function
            break;

          }
      })
  }




 function showData() {
        connection.query(`SELECT emp.id, first_name, last_name, title, salary, dept.name 
        FROM employee as emp LEFT JOIN role as role ON emp.role_id=role.id 
        INNER JOIN department as dept ON dept.id=role.department_id`,
        function(err, result) {
        if (err) throw new Error ("Ya got a problem!");
        console.table(result);
        runSearch();
    });
}



function showManagers() {
    connection.query(  `SELECT e1.last_name AS Employee, e2.last_name AS Manager
    FROM employee as e1
    LEFT JOIN employee as e2
     ON e1.manager_id=e2.id`,
    function(err, result) {
        if (err) throw new Error ("Ya got a sitch!");
        console.table(result);
})
};

// showAll();