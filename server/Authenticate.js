// Authenticate.js


const bcrypt = require('bcrypt'); 
const {AuthError, HashedPasswordError} = require('./Errors/errors')


/**
 * @class Authenticate
 * @description This class provides authentication methods for comparing passwords and setting a salt value for encryption.
 */
class Authenticate {

    /** 
     * @private 
     * @type {number} 
     * @description Salt value for hashing passwords, default is set to 10.
     */
    static #salt = 10;

    /**
     * @constructor
     */
    constructor(){};


    /**
     * @method authorize
     * @description Compares an unhashed password with a hashed password from the database using bcrypt.
     * @param {string} dbPassword - The hashed password stored in the database.
     * @param {string} unauthPassword - The unhashed password input by the user.
     * @returns {Promise<boolean>} Returns a Promise that resolves to `true` if passwords match, otherwise `false`.
     * @example
     * const authenticate = new Authenticate();
     * const isAuthenticated = await authenticate.auth(storedPassword, inputPassword);
     * if (isAuthenticated) {
     *   console.log("Login successful");
     * } else {
     *   console.log("Invalid password");
     * }
     */
    static authorize(dbPassword, unauthPassword){
        try {
            bcrypt.compare(unauthPassword, dbPassword, (error, result) => {
                if(error){
                    throw new AuthError;
                }
                if(result){
                    return true;
                }else{
                    return false;
                }
            });
            
        } catch (error) {
            console.log(error.stack);
            throw error;
        }
    }

    /**
     * @static
     * @method createHashedPassword
     * @description Hashes a plain text password using bcrypt and the current salt value.
     * @param {string} stringPassword - The plain text password to hash.
     * @returns {Promise<string>} A promise that resolves to the hashed password.
     * @throws {HashedPasswordError} If an error occurs during password hashing.
     * 
     * @example
     * // Example of using the createHashedPassword method:
     * async function registerUser() {
     *   try {
     *     const plainPassword = 'mySecretPassword123';
     *     const hashedPassword = await Authenticate.createHashedPassword(plainPassword);
     *     console.log(hashedPassword); // Outputs the hashed password
     *   } catch (error) {
     *     console.error('Failed to hash password:', error);
     *   }
     * }
     * 
     * registerUser();
     */
    static async createHashedPassword(stringPassword){
        try {
            const hashedPassword = await bcrypt.hash(stringPassword, this.getSalt())
            return hashedPassword;
        } catch (error) {
            throw new HashedPasswordError();
        }
    }


    /**
     * @method setSalt
     * @description Sets a custom salt value for bcrypt hashing.
     * @param {number} salt - The salt value to be set.
     * @returns {void}
     * @example
     * const authenticate = new Authenticate();
     * authenticate.setSalt(12); // Set the salt to 12 instead of the default 10
     */
    set setSalt(salt){
        Authenticate.#salt = salt;
    }

    /**
     * @method getSalt
     * @description Gets the class' salt value 
     * @returns {Number} salt integer
     */
    get getSalt(){
        return Authenticate.#salt;
    }


}



// testing auth class

// const {Connect} = require('./database');
// const User = require('./User');

// async function test(){
//     const connection = new Connect();
//     const query = 'SELECT * FROM user WHERE userID=7;';
//     const result = await connection.executeQuery(query);
//     const user = result.rows[0];
//     // console.log(user);

//     let newUser = await User.fetchByID(7)
//     console.log(newUser);

//     const auth = new Authenticate();
//     const match = auth.authorize(user.userPassword, "something nice");
//     if(match){
//         console.log("MATCHED");
//     }else{
//         console.log("FAIL");
//     }


//     connection.closePool();

// }

// test();

module.exports = Authenticate;