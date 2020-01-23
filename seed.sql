DROP DATABASE IF EXISTS CMS_db;

CREATE DATABASE CMS_db;

USE CMS_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30), 
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
	PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Legal"),("Engineering"),("Sales"),("Marketing"),("Finance");

INSERT INTO department (name)
VALUES ("Exectuive");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 200000, 1); 

INSERT INTO role (title, salary, department_id)
VALUES ("Engineering Manager", 150000, 2),("Engineer", 100000, 2), ("Finance Manager", 150000, 5),
("Financial Analyst", 100000, 5), ("Sales Manager", 150000, 3), ("Sales Analyst", 100000, 3), ("Legal Manager", 150000, 1),
("Legal Analyst", 100000, 1), ("Marketing Manager", 150000, 4), ("Marketing Analyst", 100000, 4);

SELECT * from role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Asa", "Holloway", 1, null), ("Ashley", "Marcus", 2, 1), ("Figmund", "Clark", 3, 2),
("Timbo", "Lam", 4, 1), ("Bort", "Sheffield", 5, 4), ("Ben", "Hale", 6, 1), ("Mya", "Womack", 7, 6),
("Claire", "Mufflehorn", 8, 1), ("Charlie" , "Sasquatch", 9, 8), ("Alex", "Dollard", 10, 1), ("Autumn", "Harvey", 11, 10);

SELECT * from employee;
