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
            console.log(res)
            connection.end();
        }
    )
}

function add(table) {

}

function remove(table) {

}