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
        promptUser();
  
      });
    
    




function promptUser() {
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
                    "update employee manager",
                    // "Exit."
              ]
          }
      ]).then(function(data){
          switch (data.action) {
            case "view all employees":
            showData();
            break;

            case "view all by department":
            showByDepartment();
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

        //this part made the inquirer options repeat, for some reason
            // case "Exit.":
            // connection.end();
            // break;

            default:
            connection.end();

          }
      })
  }




 function showData() {
        connection.query(`SELECT emp.id, CONCAT( emp.first_name, " ", emp.last_name ) AS name, role.title, role.salary, dept.name AS department 
        FROM employee as emp LEFT JOIN role as role ON emp.role_id=role.id 
        INNER JOIN department as dept ON dept.id=role.department_id`,
        function(err, result) {
        if (err) throw new Error ("Ya got a problem!");
        console.table(result);
        promptUser();
    });
}



function showManagers() {
    connection.query(  `SELECT CONCAT( emp1.first_name, " ", emp1.last_name ) AS Employee, 
    CONCAT( emp2.first_name, " ", emp2.last_name ) AS Manager
    FROM employee as emp1
    LEFT JOIN employee as emp2
     ON emp1.manager_id=emp2.id`,
    function(err, result) {
        if (err) throw new Error ("Ya got a sitch!");
        console.table(result);
        promptUser();
})
};

// showAll();


function showByDepartment () {
    connection.query( `SELECT CONCAT( a.first_name, " ", a.last_name ) AS Employee, c.name AS Department
    FROM employee AS a
    INNER JOIN role AS b 
    ON a.role_id=b.id
    INNER JOIN department AS c
    ON b.department_id=c.id`, 
    function (err, result) {
        if (err) throw new Error("Ya got an uh-oh!");
        console.table(result);
        promptUser();
    })
}


