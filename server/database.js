// database.js

// get environment variables
require('dotenv').config();

// package to connect to mysql
const mysql = require('mysql2');
const {InvalidDataType} = require('./Errors/errors')


/**
 * Database Class
 * 
 * This class is responsible for creating and managing a pool of MySQL connections.
 * It establishes a connection pool using the MySQL2 package, allowing for efficient
 * handling of multiple simultaneous database connections.
 * 
 * Methods:
 * 1. closePool(): Closes the pool of connections and exits the process.
 * 
 * Usage:
 * - This class should be extended by other classes to utilize the connection pool.
 */
class Database {
    constructor() {
        // Create a pool of connections
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,        // Your MySQL server host
            user: process.env.DB_USER,        // Your MySQL username
            password: process.env.DB_PASSWORD,// Your MySQL password
            database: process.env.DB_DATABASE,// Your MySQL database name
            multipleStatements: true,         // Allows for multiple statements to be executed in one query
            waitForConnections: true,         // Waits for a connection if none are free
            connectionLimit: 10,              // Maximum number of connections in the pool
        }).promise(); // Make the pool return promises for asynchronous queries
    }

    /**
     * closePool(): Gracefully closes the pool of connections and exits the process.
     */
    closePool() {
        this.pool.end((err) => {
            if (err) {
                console.error('Error closing the pool:', err);
            }
            console.log('Pool closed.');
            process.exit(0);
        });
    }
}

/**
 * Connect Class
 * 
 * This class extends the Database class and provides methods for executing SQL queries.
 * It includes two key methods:
 * 1. executeQueryWithParams(query, params): Executes a query with parameters.
 * 2. executeQuery(query): Executes a query without parameters.
 * 
 * Usage:
 * - The Connect class is used to interact with the database by calling the execute methods.
 * - It inherits the connection pool from the Database class and uses it to perform queries.
 * 
 * REMINDER:
 * - Remember to close pool with the method 'closePool' after use.
 */
class Connect extends Database {
    constructor() {
        super(); // Call the constructor of the Database class
    }

    /**
     * Executes a query against the database with parameters.
     * 
     * @param {string} query - The SQL query to execute.
     * @param {Array} [params] - An array of parameters to be used in the query.
     * @returns {Promise<object>} - The result of the query, containing rows and fields.
     * 
     * Example:
     * const query = 'SELECT * FROM users WHERE id = ?';
     * const params = [1];
     * const result = await connection.executeQueryWithParams(query, params);
     */
    async executeQueryWithParams(query, params = []) {
        try {
            // check if data is missing or invalid
            if(typeof query !== 'string' && !Array.isArray(params)){
                throw new InvalidDataType();
            }
            // Perform the query with parameters
            const [rows, fields] = await this.pool.query(query, params);
            return { rows, fields };
        } catch (err) {
            console.error('Error executing query:', err.stack);
        }
    }

    /**
     * Executes a query against the database without parameters.
     * 
     * @param {string} query - The SQL query to execute.
     * @returns {Promise<object>} - The result of the query, containing rows and fields.
     * 
     * Example:
     * const query = 'SELECT * FROM users';
     * const result = await connection.executeQuery(query);
     */
    async executeQuery(query) {
        try {
            // checks if data type is invalid
            if(typeof query !== 'string'){
                throw new InvalidDataType();
            }

            // Perform the query without parameters
            const [rows, fields] = await this.pool.query(query);
            return { rows, fields };
        } catch (err) {
            console.error('Error executing query:', err.stack);
        }
    }
}

// Example usage of the Connect class
// const connection = new Connect();
/**
 * Example function to run a query using the Connect class.
 * This function fetches all rows from the 'user' table.
 */
// async function runQuery() {
//     try {
//         const query = 'SELECT * FROM user';
//         const result = await connection.executeQuery(query); // Executing query without parameters
//         console.log(result); // Output the result of the query
//     } catch (err) {
//         console.error('Query Error:', err); // Handle any errors during the query
//     }
// }

// runQuery(); // Call the function to execute the query
module.exports = {Database,Connect};