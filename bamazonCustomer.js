// Running this application will first display all of the items available for sale.

// Include: ids, names, prices of products for sale.

// When the user enters, [ Node bamazonCustomer.js ] the application will display (with CLI-table) all items available for sale from the mySQL database.

var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

var newLine = "\n--------------------------------------------------\n";
var newDblLine = "\n==================================================\n";

// Create initial connection for the server.
var connection = mysql.createConnection({
    host: "localhost",
    post: 8080,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log(newDblLine + "Connected as id: " + connection.threadId + newDblLine);
    displayProducts();
    connection.end();
});

// Functions ////
function displayProducts() {
    console.log("Current products available in the Bamazon Catalog:" + newLine);
}

