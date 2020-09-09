const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    mainMenu();
});

function mainMenu() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View all roles",
            "View all departments",
            "Add employee",
            "Add role",
            "Add department",
            "Update employee role",
            "Exit"
        ]
    }).then((answer) => {
        // Switch case depending on user option 
        switch (answer.action) {
            case "View all employees":
                viewAllEmp();
                break;

            case "View all roles":
                viewRoles();
                break;

            case "View all departments":
                viewDept();
                break;

            case "Add employee":
                addEmp();
                break;

            case "Add role":
                addRole();
                break;

            case "Add department":
                addDept();
                break;

            case "Update employee role":
                updateRole();
                break;
            default:
                exit();


        }

    });
}

// view all employees 
function viewAllEmp() {
    // select from the db
    let query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewRoles() {
    // select from the db 
    connection.query("SELECT title FROM position_role", function (err, res) {
        if (err) throw err;
        const roles = [];
        res.map((role) => roles.push(role.title));
        inquirer.prompt([
            {
              type: "list",
              message: "Which role would you like to view?",
              choices: roles,
              name: "roleChoice",
            },
          ])
          .then(function (response) {
            connection.query(
              `SELECT e.id, e.first_name, e.last_name, position_role.title, department.department_name AS department, position_role.salary, CONCAT(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN position_role ON position_role.title = "${response.roleChoice}" AND e.role_id = position_role.id INNER JOIN department ON position_role.department_id = department.id`,
              function (err, res) {
                if (err) throw err;
                console.log(`Showing employees with the ${response.roleChoice} role:`);
                console.table(res);
                mainMenu();
              }
            );
          });
      });
    

}

function viewDept() { 
    connection.query("SELECT department_name FROM department", function (err, res) {
        if (err) throw err;
        const depts = [];
        res.map((dept) => depts.push(dept.department_name));
        inquirer
          .prompt([
            {
              type: "list",
              message: "Which department would you like to view?",
              choices: depts,
              name: "deptChoice",
            },
          ])
          .then(function (response) {
            connection.query(
              `SELECT e.id, e.first_name, e.last_name, position_role.title, department.department_name AS department, position_role.salary, CONCAT(m.first_name, " " ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN position_role ON e.role_id = position_role.id INNER JOIN department ON position_role.department_id = department.id WHERE department.department_name = "${response.deptChoice}"`,
              function (err, res) {
                if (err) throw err;
                console.log(
                  `Showing employees in the ${response.deptChoice} department:`
                );
                console.table(res);
                mainMenu();
              }
            );
          });
      });
    

}

function addEmp() {
    inquirer.prompt([
        {
            type: "input",
            message: "What's the first name of the employee?",
            name: "empFirstName"
        },
        {
            type: "input",
            message: "What's the last name of the employee?",
            name: "empLastName"
        },
        {
            type: "input",
            message: "What is the employee's role id number?",
            name: "roleID"
        },
        {
            type: "input",
            message: "What is the manager id number?",
            name: "managerID"
        }
    ]).then(function (answer) {
        console.table(answer);
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.empFirstName, answer.empLastName, answer.roleID, answer.managerID], function (err, res) {
            if (err) throw err;
            mainMenu();
        });


    });

}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "What's the title of the role?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "salary"
        },
        {
            type: "input",
            message: "What is the department id number?",
            name: "deptID"
        }
    ]).then(function (answer) {
        console.table(answer);
        connection.query("INSERT INTO position_role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleTitle, answer.salary, answer.deptID], function (err, res) {
            if (err) throw err;
            mainMenu();
        });
    });


}

function addDept() {
    inquirer.prompt({

        type: "input",
        message: "What is the name of the department?",
        name: "deptName"

    }).then(function (answer) {
        console.table(answer);
        connection.query("INSERT INTO department (department_name) VALUES (?)", [answer.deptName], function (err, res) {
            if (err) throw err;
            console.table(res)
            mainMenu();
        })
    })

}

function updateRole() {
    let query = "SELECT * FROM employee";
    let query2 = "SELECT * FROM position_role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        connection.query(query2, function (err2, res2) {
            if (err2) throw err2;
            inquirer.prompt([
                {
                    name: "empChoice",
                    type: "list",
                    choices: () => {
                        let choiceArray = [];
                        //res.map(name => choiceArray.push(name.first_name + " " + name.last_name + " " + name.role_id + " " + name.id )); 

                        res.map(name => choiceArray.push({
                            name: `${name.first_name} ${name.last_name}`,
                            value: name.id,
                        }))
                        console.log(choiceArray);
                        return choiceArray;

                    },
                    message: "what employee would you like to change roles?"
                },
                {
                    name: "roleChoice",
                    type: "list",
                    choices: () => {
                        console.log(res2);
                        let choiceArray = [];
                        res2.map(role => choiceArray.push({
                            name: `${role.title}`,
                            value: role.id,
                        }))
                        // res2.map(role => choiceArray.push(role.title));
                        return choiceArray;
                    },
                    message: "what role would you like to change it to?"

                }
            ]).then(results => {
                console.log(results);
                connection.query(
                    `UPDATE employee SET role_id = (SELECT id FROM position_role WHERE position_role.title = "${results.roleChoice}") WHERE CONCAT(first_name, " ",last_name) = "${results.empChoice}"`
                );
                console.log(
                    `---Employee "${results.empChoice}" has been updated to the "${results.roleChoice}" role---` 
                    
                ); 
                console.table(results);
                mainMenu();
            });
            // connection.query("UPDATE role_id SET ? WHERE id = ? ", [results.roleChoice, results.empChoice], function (err, res) {
            //     if (err) throw err;
            // }
            // ) 
        })
    });

}



function exit() {
    connection.end();
    
}