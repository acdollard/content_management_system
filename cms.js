let mysql = require("mysql");
let inquirer = require("inquirer");
let cTable = require("console.table");
let SQL_info = require("./SQL_info");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: SQL_info.username,
  
    // Your password
    password: SQL_info.password,
    database: "CMS_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw new Error("You can't even connect to the Database right!");
    // run the start function after the connection is made to prompt the user
    console.log("Connected to database.");
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
            addEmployee();
            break;

            case "remove employee":
            removeEmployee();
            break;

            case "update employee role":
            updateRole();
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
    connection.query(  `SELECT emp1.id, CONCAT( emp1.first_name, " ", emp1.last_name ) AS Employee, 
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


function showByDepartment () {
    connection.query( `SELECT a.id, CONCAT( a.first_name, " ", a.last_name ) AS Employee, c.name AS Department
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

function addEmployee() {
    //query to fetch current database information
    connection.query( `SELECT a.id, CONCAT( a.first_name, " ", a.last_name ) AS Employee, b.title AS role,
        c.name AS Department, CONCAT( d.first_name, " ", d.last_name) AS manager
    FROM employee AS a
    RIGHT JOIN role AS b 
    ON a.role_id=b.id
    INNER JOIN department AS c
    ON b.department_id=c.id
    INNER JOIN employee as d
    ON a.manager_id=d.id`, 
    function (err, result){
        if (err) throw new Error ("Couldn't fetch data");

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the first name of the new employee?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the last name of the new employee?"
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the role ID of the new employee?",
                choices: function() {
                    let role_array = [];
                    for(let i=0; i<result.length; i++){
                        role_array.push(result[i].role)
                    }
                    return role_array;
                }
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the new employee?"
            },
            // {
            //     name: "department",
            //     type: "rawlist",
            //     message: "What department does the new employee work in?",
            //     choices: function() {
            //         //shows list of departments as choices 
            //         let department_array = [];
            //         for(i=0; i<result.length; i++){
            //             //prevents duplicates from being added to list of departments
            //             if(department_array.includes(result[i].Department) === false){
            //             department_array.push(result[i].Department)
            //             }
            //         }
            //         return department_array;
            //     }
            // },
            {
                name: "manager",
                type: "rawlist",
                message: "Who is the new employee's manager?",
                choices: function() {
                    //shows list of current employees as choices
                    let manager_array = [];
                    for(let i=0; i<result.length; i++){
                        //prevents duplicates from being added to the array
                        if(manager_array.includes(result[i].Employee) === false){

                        manager_array.push(result[i].Employee);
                    }
                }
                    return manager_array;
                }
            }
            
        ]).then( data => {
            //create new employee
            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role_id: connection.query()

                }
            )
            
        })
    });
}




    function removeEmployee() {
        //querys a list of employees by last name
        connection.query(
            `SELECT a.last_name FROM employee AS a`,
        function(err, results) {
            if (err) throw new Error("NOOOO");


            inquirer.prompt([
                {
                    name: "removed_employee",
                    type: "rawlist",
                    message: "Which employee would you like to remove?",
                    choices: function(){
                        let removedEmpArr = [];
                        for (let i=0; i< results.length; i++){
                            removedEmpArr.push(results[i].last_name)
                        }
                        return removedEmpArr
                    }
        
                }
    
            ]).then( selection => {
                connection.query(
                    `DELETE FROM employee WHERE ?`,
                    {
                        last_name: selection.removed_employee
                    },
                    function(err, res){
                        if (err) throw err;
                        console.log("Removed last name: " + selection.removed_employee + " from database\n");
                        promptUser();
                    })
            })
        })


}


function updateEmployee() {
    connection.query(`SELECT a.id, a.last_name, b.title FROM employee AS a
    LEFT JOIN role AS b
    ON a.role_id=b.id`,
    function(err, result) {
        if (err) throw new Error("there's a problem!");

        console.table(result);

        inquirer.prompt([
            {
                name: "removed_employee",
                type: "rawlist",
                message: "Which employee would you like to update?",
                choices: function(){
                    let removedEmpArr = [];
                    for (let i=0; i< result.length; i++){
                        removedEmpArr.push(result[i].last_name)
                    }
                    return removedEmpArr
                }
    
            },
            {
                name: "new_role",
                type: "rawlist",
                message: "What is their new role:",
                choices: function(){
                    let removedEmpArr = [];
                    for (let i=0; i< result.length; i++){
                        removedEmpArr.push(result[i].title)
                    }
                    return removedEmpArr
                }
            }

        ])

        .then( (data) => {
            console.log(data)
            //make a select to get the id number of each role, for future reference
            connection.query(`SELECT id FROM role WHERE ?`, {title:data.new_role}, 
            function(err, res) {
                if (err) throw new Error("OH NOES");
                

            connection.query(
                `UPDATE employee SET ? WHERE?`,
                [
                {
                    role_id: res.id
                },
                {
                    last_name: data.removed_employee
                }
    
                ],
                function(err, res){
                    if (err) throw err;
                    console.log("updates last name: " + data.removed_employee + " in database\n");
                    promptUser();
                })
            
        })
    })
})
}


function updateRole() {
//first query employees table to get list of employees, prompt user to select one
connection.query(`SELECT last_name FROM employee`,
    function(err, employees){
        if (err) throw new Error("Couldn't fetch employee table");
        inquirer.prompt([
            {
                name: "updated_employee",
                type: "rawlist",
                message: "Which employee would you like to update?",
                choices: function() {
                    let empArray = [];
                    for(let i=0; i<employees.length; i++){
                        empArray.push(employees[i].last_name)
                    }
                    return empArray;
                }
            }
        ]).then(chosenEmp => {

//then query roles table to prompt user to select a new role for chosen employee
connection.query(`SELECT * FROM role`,
    function(err, res){
        if(err) throw new Error("Can't get role table");
        inquirer.prompt([
            {
                name: "new_role",
                type: "rawlist",
                message: "What would you like their new role to be?",
                choices: function() {
                    let role_Array = [];
                    for (let i=0; i<res.length; i++){
                        role_Array.push(res[i].title)
                    }
                    return role_Array
                }
            }
        ]).then(response => {
            console.log(response.new_role)
            //query roles table again to get id# for specified role
            connection.query("SELECT id FROM role WHERE ?", 
            {
                title: response.new_role
            },
            function(err, res) {
                if (err) throw new Error ("Couldn't fetch role_id");
                console.table(res);
                connection.query("UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: res[0].id
                    },
                    {
                        last_name: chosenEmp.updated_employee
                    }
                ],
                function(err, newRoleId) {if(err) throw new Error("Problem updating table.");
                console.table(newRoleId);
            console.log(`Updated ${chosenEmp.updated_employee} to ${response.new_role} successfully!`);
                promptUser();
        }
                );//closes 379
            })//closes 357
    })//closes 355
    })//closes 339, 340
})
})
}


// updateRole();


