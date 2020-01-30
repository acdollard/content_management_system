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
            updateManager();
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
    INNER JOIN department as dept ON dept.id=role.department_id ORDER BY emp.id`,
    function(err, result) {
            if (err) throw new Error ("Ya got a problem!");
            console.table(result);
            promptUser();
    });
}


function showManagers() {
    connection.query(  `SELECT emp1.id, CONCAT( emp1.first_name, " ", emp1.last_name ) AS Employee, 
    CONCAT( emp2.first_name, " ", emp2.last_name ) AS Manager, emp1.manager_id AS Manager_id
    FROM employee as emp1
    LEFT JOIN employee as emp2
     ON emp1.manager_id=emp2.id
     ORDER BY emp1.manager_id`,
     
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




function addEmployee() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the first name of the new employee?",
            validate: function validateFirstName(name) {
                return name !== "";
            }
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the last name of the new employee?",
            validate: function validateLastName(name) {
                return name !== "";
            }
        }
    ]).then(name => {
        console.log(name)
        connection.query(`SELECT id, name FROM department`,
        function(err, res){
            if (err) throw err;
            console.log(res);
            inquirer.prompt([
                {
                    name: "dept",
                    type: "rawlist",
                    message: "What department does the new employee belong to?",
                    choices: function(){
                        let deptArray =[];
                        for (let i=0; i<res.length; i++){
                            deptArray.push(res[i].name)
                        }
                        return deptArray; 
                    }
                }
            ]).then(departmentRes => {
                //trying to return only roles associated with the selected department
                console.log(departmentRes);
                connection.query(`SELECT title, r.id FROM role AS r 
                INNER JOIN department AS d
                ON r.department_id=d.id
                WHERE d.name=?`,[departmentRes.dept], 
                function(err, res){
                    if (err) throw err;

                    console.log(res);

                    inquirer.prompt([
                        {
                            name: "role",
                            type: "rawlist",
                            message: "What role will they have?",
                            choices: function() {
                                let titlesArr =[]; 
                                for(let i=0; i<res.length; i++){
                                    titlesArr.push({name: res[i].title, value: res[i].id});
                                }
                                return titlesArr;

                            }
                        }
                    ]).then(roleRes => {
                        console.log(roleRes);
                        console.log(departmentRes);
                        console.log(name.first_name);
                        console.log(name.last_name)

                        //query list of employees and their id's for user to select new emp's manager
                        connection.query(`SELECT id, last_name FROM employee`,
                        function(err, manRes){
                            if(err) throw new Error("Unable to find managers list!");

                            console.log(manRes);

                            inquirer.prompt([
                                {
                                    name: "manager",
                                    type: "rawlist",
                                    message: "Who will be the new employee's manager?",
                                    choices: function() {
                                        let manArray = [];
                                        for(let i=0; i<manRes.length; i++){
                                            manArray.push({name: manRes[i].last_name, value: manRes[i].id})
                                        }
                                        return manArray;
                                    }
                                }
                            ]).then(chosenManager => {
                                console.log(chosenManager);
                                console.log(roleRes);
                                console.log(name.last_name);
                                console.log(name.first_name);

                                connection.query(`INSERT INTO employee SET ?`,
                                {
                                    first_name: name.first_name,
                                    last_name: name.last_name,
                                    role_id: roleRes.role,
                                    manager_id: chosenManager.manager
                                }, function(err, done){
                                    if(err) throw new Error("Error creating new employee!");
                                    console.log( `${name.first_name} ${name.last_name} successfully added!`);
                                    promptUser();
                                    
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}


function updateManager() {
    connection.query(`SELECT id, last_name, first_name, manager_id FROM employee`,
    function(err, res){
        if(err) throw new Error("couldn't fetch employee data");

        inquirer.prompt([
            {
                name: "updatedEmp",
                type: "rawlist",
                message: "Which employee's manager would you like to change?",
                choices: function(){
                    let empArray = [];
                    for(let i=0; i<res.length; i++){
                        empArray.push({name:`${res[i].first_name} ${res[i].last_name}` ,value: res[i].id})
                    }
                    return empArray;
                }
            }
        ]).then(chosenEmp => {
            inquirer.prompt([
                {
                    name: "updatedMan",
                    type: "rawlist",
                    message: "Who will be their new manager?",
                    choices: function() {
                        let manArray =[];
                        for(let i=0; i<res.length; i++){
                            manArray.push({name:`${res[i].first_name} ${res[i].last_name}` ,value: res[i].id})
                        }
                        return manArray; 
                    }
                }
            ]).then(chosenMan => {
                connection.query(`UPDATE employee SET ? WHERE id=${chosenEmp.updatedEmp}`,
                {
                    manager_id: chosenMan.updatedMan
                },
                function(err, done){
                    if(err) throw new Error("Problem updating manager!");
                    console.log(`Manager updated succesfully!`);

                    promptUser(); 
                })
            })
        })
    })
}



