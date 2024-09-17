const {UserError} = require('./Errors/errors.js');
const {Connect} = require('./database.js');
const bcrypt = require('bcrypt'); 
const fs = require('fs');

class User {

    constructor(userID, username, email, userPassword, role, active, coins, stockID) {
        this.userID = userID;
        this.username = username;
        this.email = email;
        this.userPassword = userPassword;
        this.role = role;
        this.active = active;
        this.coins = coins;
        this.stockID = stockID;
        }
  
    /**
     * Fetch a user from the database by userID.
     * @param {number} userID - The ID of the user to fetch.
     * @returns {Promise<User>} - Returns an instance of the User class.
     */
    static async fetchByID(userID) {
        const query = new Connect();
        try {
            
            const result = await query.executeQueryWithParams('SELECT * FROM user WHERE userID = ?', [userID]);
            const userData = result.rows[0]; // Assuming only one user with a specific userID

            if (userData) {
                // Return a new User instance with the fetched data
                return new User(
                    userData.userID,
                    userData.username,
                    userData.email,
                    userData.userPassword,
                    userData.role,
                    userData.active,
                    userData.coins,
                    userData.stockID
                );
            } else {
                throw new UserError(`User with ID ${userID} not found.`,404);
            }
        } catch (error) {
            if (error instanceof UserError)
                throw error;
            else
                console.error(error);
        }
        finally{
            query.closePool();
        }
    }
    

    /**
     * Create a new user in the database.
     * @param {object} userData - An object containing user details (username, email, userPassword, role, active).
     * @returns {Promise<void>}
     */
    static async create(userData) {
        const connection = new Connect();
        try {
            const hashedPassword = await bcrypt.hash(userData.userPassword, 10); // Hash password before saving
            const query = `
                INSERT INTO user (username, email, userPassword, role, active, coins, stockID)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            await connection.executeQueryWithParams(query, [
                userData.username,
                userData.email,
                hashedPassword,
                userData.role,
                userData.active,
                userData.coins || 0, // Default coins to 0 if not provided
                userData.stockID || null // Allow stockID to be null
            ]);

            console.log('User created successfully.');
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error("COULD NOT CREATE USER");
        }
        finally{
            connection.closePool();
        }
    }

    
    /**
     * Function to export user to local JSON file
     * @param {number} userID - An object containing user details (username, email, userPassword, role, active).
     * @param {string} filePath - The location of the generated JSON file. (eg. '' is same directory)
     */
    static async exportUserToJson(userID, filePath) {
        try {
            // Fetch user by ID
            const user = await User.fetchByID(userID);
            
            // Convert the user instance to a plain object
            const userObject = {
                userID: user.userID,
                username: user.username,
                email: user.email,
                role: user.role,
                active: user.active,
                coins: user.coins,
                stockID: user.stockID
            };
            filePath = filePath+user.username+'.json'
            // Serialize the object to JSON
            const jsonData = JSON.stringify(userObject, null, 2);
    
            // Write the JSON data to a file
            fs.writeFileSync(filePath, jsonData);
    
            console.log(`User exported successfully to ${filePath}`);
        } catch (error) {
            console.error('Error exporting user:', error);
        }
    }

    // Method to toggle user active status
    toggleActiveStatus() {
      this.active = this.active === 'online' ? 'offline' : 'online';
    }
  
    // Method to add coins to the user account
    addCoins(amount) {
      this.coins += amount;
    }
  
    // Method to deduct coins from the user account
    deductCoins(amount) {
      if (this.coins >= amount) {
        this.coins -= amount;
      } else {
        console.log("Not enough coins");
      }
    }
  
    // Example: Print user details
    getUserInfo() {
      return `User: ${this.username}, Email: ${this.email}, Role: ${this.role}, Status: ${this.active}, Coins: ${this.coins}, StockID: ${this.stockID}`;
    }

    get_userID() {
        return this.userID;
    }

    // Getter for username
    get_username() {
        return this.username;
    }

    // Getter for email
    get_email() {
        return this.email;
    }

    // Getter for userPassword
    get_userPassword() {
        return this.userPassword;
    }

    // Getter for role
    get_role() {
        return this.role;
    }

    // Getter for active status
    get_active() {
        return this.active;
    }

    // Getter for coins
    get_coins() {
        return this.coins;
    }

    // Getter for stockID
    get_stockID() {
        return this.stockID;
    }
  }
  
//   async function test(){
//   const user = await User.fetchByID(8);
//   console.log(user);
//   console.log(user.userID); // Accessing userID using the getter
//   console.log(user.username); // Accessing username using the getter
//   console.log(user.getUserInfo()); // Displaying user information using a method
//   await User.exportUserToJson(8,'');
//   }
//   test();
module.exports= User;
  