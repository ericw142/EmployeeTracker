const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
// ASCII Logo
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());