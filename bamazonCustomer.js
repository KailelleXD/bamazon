// Running this application will first display all of the items available for sale.

// Include: ids, names, prices of products for sale.

// When the user enters, [ Node bamazonCustomer.js ] the application will display (with CLI-table) all items available for sale from the mySQL database.

var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

var newLine = "\n----------------------------------------------------------------------\n";
var newDblLine = "\n======================================================================\n";
var productID = "";
var orderQty = "";
var currentQty = "";
var currentProduct = "";
var currentPID = "";
var updatedQty = "";
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
    displayProducts();
});

// Functions ////

// function to display products in the Bamazon MySQL Database.
function displayProducts() {
    console.log(" Current products available in the Bamazon Catalog:" + newLine);
    // Instantiate a New Table.
    var table = new Table({
        head: ["Item ID#", "Product Name", "Price"],
        colWidths: [10,40,10]
    });

    // Code to perform a SQL query and display all products from the database.
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        // For-loop that pushes the values from the database to the table array.
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, "$ " + res[i].price.toFixed(2)]
            );
        }
        console.log(table.toString());
        // Call the function to prompt the user through the order process.
        orderPrompt();
    });
} /// displayProducts();

// Function that prompts the user through the order process.
function orderPrompt() {
    console.log(newDblLine);
    inquirer
        .prompt([
            {
                type: "input",
                name: "productID",
                message: "What is the ID# of the product you would like to purchase? "
            },
            {
                type: "input",
                name: "orderQty",
                message: "How many units would you like? "
            }
        ])
        .then(answer => {
            productID = answer.productID;
            orderQty = answer.orderQty;

            // Call the function that checks the quantity in the database and orders the products.
            orderProducts();
        });
} /// orderPrompt();

// Function that checks the quantity of the chosen products in the database and then orders the products and adjusts the appropriate quantities.
function orderProducts() {
    console.log(newDblLine + " Product to be purchased: ");

    // Initialize a variable to create a string for a SQL Query.
    var productQuery = "SELECT * FROM products WHERE item_id=" + productID;

    // Instantiate a new table.
    var table = new Table({
        head: ["Item ID#", "Product Name", "Price"],
        colWidths: [10,40,10]
    });

    // SQL Query
    connection.query(productQuery, function(err, res) {
        if (err) throw err;
        table.push(
            [res[0].item_id, res[0].product_name, "$" + res[0].price.toFixed(2)]
        );
        console.log(table.toString() + "\n Quantity Requested: " + orderQty);

        // Calc to determine total amount owed.
        var amountOwed = orderQty * res[0].price;

        // assign current qty from specific product ordered to the variable currentQty.
        currentQty = res[0].stock_quantity;

        // assign the current name of the product ordered to the variable currentProduct.
        currentProduct = res[0].product_name;

        // assign the current item_id of the product ordered to the variable currentPID.
        currentPID = res[0].item_id;

        // IF-Statment, IF, orderQty < Quantity of Product. THEN, adjust Quantity of product in table AND calc the total cost to be paid by the customer.
        if (orderQty > res[0].stock_quantity) {
            console.log(newDblLine + " Insufficient quantity available for purchase! Sorry!" + newDblLine);
            
            // call the function to ask user if they would like to order anything else.
            orderMore();

        } else {
            console.log(newDblLine + " Thank you for your purchase! Please pay a total of: $" + amountOwed.toFixed(2) + newDblLine);

            // call the function to update the products in the bamazon products table.
            updateProducts(currentPID, currentProduct, currentQty);
        }
    });
} /// orderProducts();

// Function to update the products table to reflect the customer's purchase.
function updateProducts(pid, name, qty) {
    // console.log(newDblLine + " Bamazon Product Database Updated");

    updatedQty = qty - orderQty;

    // Initialize a variable to create a string for a SQL Query.
    var updateQuery = "UPDATE products SET stock_quantity=" + updatedQty + " WHERE item_id=" + pid;

    // SQL Query
    connection.query(updateQuery, function(err, res) {
        if (err) throw err;

        // console.log(newLine + " Product Name: " + name + " | " + "Updated Quantity: " + updatedQty + newLine + newDblLine);

        orderMore();
    });
} /// updateProducts();

// function to prompt/ask the user if they would like to order anything else.
function orderMore() {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "userChoice",
                message: "Would you like to order something else? ",
                default: false
            }
        ])
        .then(answer => {
            userChoice = answer.userChoice;

            // IF-statement, IF user chooses YES then re-run program, IF NO then end program.
            if (userChoice === true) {
                console.log(newDblLine);
                displayProducts();
            } else {
                console.log(newDblLine + " Thank you for using the Bamazon CLI-app, Have a great day!" + newDblLine);
                connection.end();
            }
        });
}
