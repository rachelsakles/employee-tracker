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
            "View all employees by role",
            "View all employees by department",
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

            case "View all employees by role":
                viewEmpRole();
                break;

            case "View all employees by department":
                viewEmpDept();
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

function viewEmpRole() {
    // select from the db 
    let query = "SELECT * FROM position_role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });

}

function viewEmpDept() { 
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
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
                        res.map(name => choiceArray.push(name.first_name + " " + name.last_name));
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
                        res2.map(role => choiceArray.push(role.title));
                        return choiceArray;
                    },
                    message: "what role would you like to change it to?"

                }
            ]).then(results=>{ 
                console.log(results);
            })
        })
    });

}


function exit() {
    connection.end();
    //process.exit();
}