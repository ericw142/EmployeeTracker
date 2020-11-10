const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
// ASCII Logo
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "employee_trackerdb"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    init();
});

function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'select',
            message: 'Select one of the following:',
            choices: ['View All Employees', 'Add Employee', 'Remove Employee', 
                    'View All Roles', 'Add Role', 'Remove Role', 
                    'View All Departments', 'Add Department', 'Remove Department']
        }
    ]).then((res) => {
        switch(res.select) {
            // EMPLOYEE
        case('View All Employees'): 
            view('employee');
            break;
        case('Add Employee'):
            add('employee');
            break;
        case('Remove Employee'):
            remove('employee');
            break;
            // ROLE
        case('View All Roles'): 
            view('role');
            break;
        case('Add Role'):
            add('role');
            break;
        case('Remove Role'):
            remove('role');
            break;
            // DEPARTMENT
        case('View All Departments'): 
            view('department');
            break;
        case('Add Department'):
            add('department');
            break;
        case('Remove Department'):
            remove('department');
            break;
        }
    })
}

function view(table) {
    let query = "SELECT * FROM " + table;
    connection.query(
        query,
        function(err, res) {
            if (err) throw err;
            let values = [];

            if (table === 'employee') {
                for (var i = 0; i < res.length; i++) {
                    values.push([res[i].first_name, res[i].last_name]);
                }
                console.table(['First Name', 'Last Name'], values);
            } else if (table === 'role') {
                for (var i = 0; i < res.length; i++) {
                    values.push([res[i].title, res[i].salary]);
                }
                console.table(['Title', 'Salary'], values);
            } else {
                for (var i = 0; i < res.length; i++) {
                    values.push([res[i].id, res[i].name]);
                }
                console.table(['Department ID', 'Department Name'], values);
            }
            
            connection.end();
        }
    )
}

function add(table) {
    if (table === 'employee') {
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What is the employee's last name?"
            }
        ]).then((res) => {
            console.log(res)
            let query = "INSERT INTO employee SET ?";
            connection.query(
                query,
                {
                    first_name: res.first_name,
                    last_name: res.last_name,
                },
                function(err, result) {
                    if (err) throw err;
                    console.log("Updated Employees Database with " + res.first_name + "'s information.");
                }
            )
            connection.end();
        })
    } else if (table === 'role') {
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the role called?'
            },
            {
                type: "input",
                name: 'salary',
                message: "What is the role's salary?"
            }
        ]).then((res) => {
            let query = "INSERT INTO role SET ?";
            connection.query(
                query,
                {
                    title: res.title,
                    salary: res.salary,
                },
                function(err, result) {
                    if (err) throw err;
                    console.log("Updated Roles Database with " + res.title + ".");
                }
            )
            connection.end();
        })
    } else {
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: "What is the department's name?"
            }
        ]).then((res) => {
            let query = "INSERT INTO department SET ?";
            connection.query(
                query,
                {
                    name: res.name,
                },
                function(err, result) {
                    if (err) throw err;
                    console.log("Updated Departments Database with " + res.name + ".");
                }
            )
            connection.end();
        })
    }
    
    
}

function remove(table) {
    connection.query(
        "SELECT * FROM " + table,
        function(err, res) {
            if (err) throw err;
            let resultsArr = [];

            for (var i = 0; i < res.length; i++) {
                resultsArr.push(res[i]);
            };

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'prompt',
                    message: 'Which would you like to delete?',
                    choices: resultsArr
                }
            ]).then((res) => {
                let query = "DELETE FROM " + table + " WHERE ?";
                connection.query(
                    query,
                    res.prompt,
                    function(err, result) {
                        if (err) throw err;
                    }
                )
            })
        }
    )   
}