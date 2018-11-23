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
