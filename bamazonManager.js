/*--------------------------------------------------------------------------
This app is designed to allow the Bamazon Managers to do several functions:
    [View Products for Sale]
        -List every available item (all columns)
        -Re-display list.
    [View Low Inventory]
        -List all items with an inventory count lower than FIVE.
        -Re-display list.
    [Add to Inventory]
        -Display a prompt that will let the manager 
        "add more" to any quantity in the dbase product table. 
        -Re-display list.
    [Add New Product]
        -Allows the manager to add a completely new product to the store.
        -Re-display list.
    [Close Bamazon Manager]
--------------------------------------------------------------------------*/

var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

var newLine = "\n----------------------------------------------------------------------\n";
var newDblLine = "\n======================================================================\n";

var userChoice = "";

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
    console.log(newDblLine + " Connected as id: " + connection.threadId + newDblLine);
    // Call the function to display all the products in the Bamazon Catalog.
    displayList();
});

// Functions ////

// Function to display the list options to the manager.
function displayList() {
    console.log(newDblLine + "Bamazon Manager CLI-App! Work Hard! Play Hard!" + newLine);
    inquirer
        .prompt([
            {
                type: "list",
                name: "userChoice",
                message: "Please choose from the selection below: ",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Close Bamazon Manager"]
            }
        ])
        .then(answer => {
            userChoice = answer.userChoice;

            // Call the function whichOption(); to determine what the manager would like to do.
            whichOption(userChoice);
        });
} /// displayList();

// Function that uses a switch statment and a pass-through argument to determine which function to call.
function whichOption(choice) {
    switch(choice) {
        case "View Products for Sale":
            console.log(newLine + "You selected: " + choice + newLine);
            displayList();
            break;
        case "View Low Inventory":
            console.log(newLine + "You selected: " + choice + newLine);
            displayList();
            break;
        case "Add to Inventory":
            console.log(newLine + "You selected: " + choice + newLine);
            displayList();
            break;
        case "Add New Product":
            console.log(newLine + "You selected: " + choice + newLine);
            displayList();
            break;
        case "Close Bamazon Manager":
            console.log(newLine + "You selected: " + choice + newLine);
            connection.end();
            break;
    }
}

//----------////
