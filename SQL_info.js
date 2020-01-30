let inquirer = require("inquirer")

module.exports = {

    async function username() {
        try { await inquirer.prompt([
             {
                 name: "username",
                 type: "input",
                 message: "What is your MySQL username?"
             }
         ]).then(username => {return(username)})
     }catch{
        if(err) throw err;
     }
     };
     
     async function password() {
       try{  await inquirer.prompt([
             {
                 name: "password",
                 type: "input",
                 message: "What is your MySQL password?"
             }
         ]).then(password => {return(password)})
     }catch{
     
     }
     }
    
    
}



