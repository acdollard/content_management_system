# content_management_system
A solution for managing a company's employees. 

## About

This application uses node.js to interact with a MySQL database which contains tables for employees, roles, and departments. The user can select from a list of choices which will allow them to edit and review the data in a variety of ways. 

This application uses node.js, inquirer, MySQL, and console.table. The user will need to have MySQL workbench installed.


## Getting Started

1. Clone this repo to your local machine.
2. copy the file `tables.sql` to a new tab in MySQL Workbench and run it.
3. copy the file `seed.sql` to the MySQL tab and run the newly added seed data, to pre-populate the tables
4. open the file `cms.js` in your code editor. Near the top will be the code segment that connects to your MySQL database. You will need to enter your MySQL user and password information on lines 23 and 26, respectively. 
5. open the `cms.js` file in your terminal or bash, and run the command `npm install`to install necessary node modules.
6. now run the command `node cms.js` and you're ready to go!
