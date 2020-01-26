
INSERT INTO department (name)
VALUES ("Legal"),("Engineering"),("Sales"),("Marketing"),("Finance");


INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 200000, null); 

INSERT INTO role (title, salary, department_id)
VALUES ("Engineering Manager", 150000, 2),("Engineer", 100000, 2), ("Finance Manager", 150000, 5),
("Financial Analyst", 100000, 5), ("Sales Manager", 150000, 3), ("Sales Analyst", 100000, 3), ("Legal Manager", 150000, 1),
("Legal Analyst", 100000, 1), ("Marketing Manager", 150000, 4), ("Marketing Analyst", 100000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Asa", "Holloway", 1, null), ("Ashley", "Marcus", 2, 1), ("Figmund", "Clark", 3, 2),
("Timbo", "Lam", 4, 1), ("Bort", "Sheffield", 5, 4), ("Ben", "Hale", 6, 1), ("Mya", "Womack", 7, 6),
("Claire", "Mufflehorn", 8, 1), ("Charlie" , "Sasquatch", 9, 8), ("Alex", "Dollard", 10, 1), ("Autumn", "Harvey", 11, 10);

