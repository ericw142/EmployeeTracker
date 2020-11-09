DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- department

CREATE TABLE department (
    id INT not null AUTO_INCREMENT,
    name VARCHAR(30) null,
    PRIMARY KEY (id)
)

INSERT INTO department(name)
VALUES ('Sales')

-- role

CREATE TABLE role (
    id INT not null AUTO_INCREMENT,
    title VARCHAR(30) null,
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id)
)

INSERT INTO role(title, salary)
VALUES ('Sales Lead', 100000)

-- employee

CREATE TABLE employee (
    id INT not null AUTO_INCREMENT,
    first_name VARCHAR(30) null,
    last_name VARCHAR(30) null,
    role_id INT,
    manager_id INT null,
    PRIMARY KEY (id)
)

INSERT INTO employee(first_name, last_name, role_id)
VALUES ('John', 'Smith', 1)
