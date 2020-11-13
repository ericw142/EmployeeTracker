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
// Prompts user to choose function
function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'select',
            message: 'Select one of the following:',
            choices: ['Quit', 'View All Employees', 'Add Employee', 'Remove Employee', 
                    'View All Roles', 'Add Role', 'Remove Role', 'Update Role', 
                    'View All Departments', 'Add Department', 'Remove Department']
        }
    ]).then((res) => {
        switch(res.select) {
        case('Quit'):
            end();
            break;
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
        case('Update Role'):
            update();
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
// Function to view info from database
function view(table) {
    // Display Employee info alongside role info
    if (table === 'employee') {
        let query = "SELECT e.id, e.first_name, e.last_name, r.title, r.salary FROM employee e INNER JOIN role r ON e.role_id = r.id"
        connection.query(
            query, 
            function(err, res) {
                if (err) throw err;
                let values = [];

                for (var i = 0; i < res.length; i++) {
                    values.push([res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary]);
                }
                console.log("------------------------");
                console.table(['id','First Name', 'Last Name', 'Title', 'Salary'], values);
            }
        )
        init();
    } else {
        let query = "SELECT * FROM " + table;
        connection.query(
        query,
        function(err, res) {
            if (err) throw err;
            let values = [];

            if (table === 'role') {
                for (var i = 0; i < res.length; i++) {
                    values.push([res[i].id, res[i].title, res[i].salary]);
                }
                console.table(['id', 'Title', 'Salary'], values);
            } else {
                for (var i = 0; i < res.length; i++) {
                    values.push([res[i].id, res[i].name]);
                }
                console.table(['Department ID', 'Department Name'], values);
            }
            
            init();
        }
    )
    }
    
}
// Function to add data to a table
function add(table) {
    if (table === 'employee') {
        let q = "SELECT * FROM role";
        connection.query(
            q,
            function(err, res) {
                if (err) throw err;
                let roleArr = [];

                for (var i = 0; i < res.length; i++) {
                    roleArr.push(res[i].title);
                };

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
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: "What is the employee's role?",
                        choices: roleArr
                    }
                ]).then((res) => {
                    let finalid = roleArr.findIndex((role) => res.role_id) + 1;
                    let query = "INSERT INTO employee SET ?";
                    connection.query(
                        query,
                        {
                            first_name: res.first_name,
                            last_name: res.last_name,
                            role_id: finalid
                        },
                        function(err, result) {
                            if (err) throw err;
                            console.log("Updated Employees Database with " + res.first_name + "'s information.");
                        }
                    )
                    init();
                })
            }
        )
        
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
            init();
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
            init();
        })
    }
}
// Function to update role table
function update() {
    let query = "SELECT * FROM role";
    connection.query(
        query,
        function(err, res) {
            if (err) throw err;
                let roleArr = [];

                for (var i = 0; i < res.length; i++) {
                    roleArr.push(res[i].title);
                };

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleChoice',
                        message: 'What is the role you would like to update?',
                        choices: roleArr
                    },
                    {
                        type: 'input',
                        name: 'newTitle',
                        message: 'What is the new title?'
                    },
                    {
                        type: 'input',
                        name: 'newSalary',
                        message: 'What is the new salary?'
                    }
                ]).then((res) => {
                    let query = "UPDATE role SET title = ?, salary = ? WHERE title = ?";
                    connection.query(
                        query,
                        [res.newTitle,res.newSalary,res.roleChoice,],
                        function(err, result) {
                            if (err) throw err;

                            console.log("Successfully updated role.");
                            init();
                        }
                        
                    )
                    
                })
        }
    )
}
// Function to remove data from a table
function remove(table) {
    let query = "SELECT * FROM " + table;
    connection.query(
        query,
        function(err, res) {
            if (err) throw err;
            let resultsArr = [];

            if (table === 'employee') {
                for (var i = 0; i < res.length; i++) {
                    resultsArr.push(res[i].first_name);
                };
                var queryTwo = "DELETE FROM " + table + " WHERE first_name = ?";
            } else if (table === 'role') {
                for (var i = 0; i < res.length; i++) {
                    resultsArr.push(res[i].title);
                };
                var queryTwo = "DELETE FROM " + table + " WHERE title = ?";
            } else {
                for (var i = 0; i < res.length; i++) {
                    resultsArr.push(res[i].name);
                };
                var queryTwo = "DELETE FROM " + table + " WHERE name = ?";
            }

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'prompt',
                    message: 'Which would you like to delete?',
                    choices: resultsArr
                }
            ]).then((res) => {
                connection.query(
                    queryTwo,
                    res.prompt,
                    function(err, result) {
                        if (err) throw err;
                        console.log('Deleted ' + res.prompt);
                    }
                )
                init();
            })
        }
    )   
}

function end() {
    console.log("Goodbye");
    connection.end();
}