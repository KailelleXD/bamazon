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
var currentQty = 0;
var newQty = 0;
var qty = 0;
var pid = 0;

var product = "";
var department = "";
var price = 0;
var quantity = 0;

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
    // Call the function to display the options list to the manager.
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
            displayProducts();
            break;
        case "View Low Inventory":
            displayLow();
            break;
        case "Add to Inventory":
            inventoryPrompt();
            break;
        case "Add New Product":
            addProductInfo();
            break;
        case "Close Bamazon Manager":
            console.log(newLine + "You selected: " + choice + newLine);
            connection.end();
            break;
    }
} /// whichOption();

// Function to display products in the Bamazon MySQL Database.
function displayProducts() {
    console.log(newLine + " Current products available in the Bamazon Catalog:" + newLine);
    // Instantiate a New Table.
    var table = new Table({
        head: ["Item ID#", "Product Name", "Department", "Price", "Stock Quantity"],
        colWidths: [10,35,18,10,18]
    });

    // Code to perform a SQL query and display all products from the database.
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        // For-loop that pushes the values from the database to the table array.
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$ " + res[i].price.toFixed(2), res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        // Call the function to display the options list to the manager.
        displayList();
    });
} /// displayProducts();

// Function to display any items that have an inventory count lower than FIVE.
function displayLow() {
    console.log(newLine + " Current products with a [Stock Quantity] LESS THAN FIVE that are available in the Bamazon Catalog:" + newLine);
    // Instantiate a New Table.
    var table = new Table({
        head: ["Item ID#", "Product Name", "Department", "Price", "Stock Quantity"],
        colWidths: [10,35,18,10,18]
    });

    // Code to perform a SQL query and display all products from the database.
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;

        // For-loop that pushes the values from the database to the table array.
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$ " + res[i].price.toFixed(2), res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        // Call the function to display the options list to the manager.
        displayList();
    });
} /// displayLow();

// Function to prompt the manager for the product to update and by how much.
function inventoryPrompt() {

    // Use Inquirer package to prompt manager for what item they would like to update.
    inquirer
        .prompt([
            {
                type: "input",
                name: "itemID",
                message: "Please enter the Item ID# of the item you would like to add inventory to: "
            },
            {
                type: "input",
                name: "qty",
                message: "Please enter the amount that you would like to increase the stock quantity by: "
            }
        ])
        .then(answer => {
            pid = answer.itemID;
            qty = answer.qty;

            addInventory();
        });
} /// inventoryPrompt();

// Function to update the products table to reflect the customer's purchase.
function addInventory() {
    // Use MySQL package and CLI-table to display managers choice.
    // Initialize a variable to create a string for a SQL Query.
    var productQuery = "SELECT * FROM products WHERE item_id=" + pid;

    // Instantiate a New Table.
    var table = new Table({
        head: ["Item ID#", "Product Name", "Department", "Price", "Stock Quantity"],
        colWidths: [10,35,18,10,18]
    });

    // SQL Query
    connection.query(productQuery, function(err, res) {
        if (err) throw err;
        table.push(
            [res[0].item_id, res[0].product_name, res[0].department_name, "$ " + res[0].price.toFixed(2), res[0].stock_quantity]
        );
        console.log(newLine + "Product Selected: \n" + table.toString());
        currentQty = res[0].stock_quantity;

        // Calc to determine new updated quantity.
        newQty = parseInt(currentQty) + parseInt(qty);

        // Initialize a variable to create a string for a SQL Query.
        var updateQuery = "UPDATE products SET stock_quantity=" + newQty + " WHERE item_id=" + pid;

        // Instantiate a New Table.
        var updatedTable = new Table({
            head: ["Item ID#", "Product Name", "Department", "Price", "Stock Quantity"],
            colWidths: [10,35,18,10,18]
        });

        // SQL Query
        connection.query(updateQuery, function(err, res) {
            if (err) throw err;
            console.log("Quantity Updated...");
        });

        // SQL Query
        connection.query(productQuery, function(err, res) {
            if (err) throw err;
            updatedTable.push(
                [res[0].item_id, res[0].product_name, res[0].department_name, "$ " + res[0].price.toFixed(2), res[0].stock_quantity]
            );
            console.log(updatedTable.toString() + newDblLine);
            // Call the function to display the options list to the manager.
            displayList();
        });
    });
} /// addInventory();

// Function to add new products into the bamazon product database.
function addProductInfo() {
    // Use Inquirer to prompt the manager to provide the needed information to add a new product to the database.
    console.log(newDblLine + " Add a New Product to the Bamazon Product Database: " + newDblLine);
    inquirer
        .prompt([
            {
                type: "input",
                name: "productName",
                message: "Product Name: "
            },
            {
                type: "input",
                name: "department",
                message: "Department: "
            },
            {
                type: "input",
                name: "price",
                message: "Price of Item: "
            },
            {
                type: "input",
                name: "quantity",
                message: "Quantity in Stock: "
            }
        ])
        .then(answer => {
            product = answer.productName;
            department = answer.department;
            price = answer.price;
            quantity = answer.quantity;

            // Call the function to update the table with the above values.
            updateTable(product, department, price, quantity);
        });

} /// addProductInfo();

// Function to take the user provided information and update the Bamazon Product Database.
function updateTable(name, dept, cost, qty) {
    // Initialize a variable to create a string for a SQL Query.
    var updateQuery = 
        'INSERT INTO products (product_name, department_name, price, stock_quantity)'
        + ' VALUES ("' + name + '", "' + dept + '", ' + cost + ', ' + qty + ');'

    // SQL Query
    connection.query(updateQuery, function(err, res) {
        if (err) throw err;
        console.log(newLine + "Product added to database!" + newLine);
        displayProducts();
    });
} /// updateTable();

//----------////

/*
INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Lemon Cake Lip Gloss", "Cosmetics", 3.15, 50);
*/