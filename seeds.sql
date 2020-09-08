USE employee_trackerDB;

INSERT INTO department (id, department_name)
VALUES (1, "Human Resources"), (2, "IT"), (3, "Engineering"), (4, "Accounting"), (5, "Sales");

INSERT INTO position_role (title, salary, department_id)
VALUE ("manager", 75000.00, 2), ("engineer", 52000, 3), ("accountant", 62500, 4), ("recruiter", 57500, 1), ("sales person", 85650, 5), ("system administrator", 70000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("John", "Smith", 1, NULL), ("Jessica", "Green", 2, 1), ("Jack", "Brown", 3, NULL), ("Steven", "Anderson", 5, 2), ("Amanda", "Taylor", 4, NULL );