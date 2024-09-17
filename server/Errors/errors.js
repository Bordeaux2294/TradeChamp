// errors.js


// custom error to handle CORS forbidden origins
/**
 * @extends Error
 * @description Use this error when handling CORS error in global error hanlding 
 */
class BlacklistedOrigin extends Error {
    constructor(origin, message ="ORIGIN IS FORBIDDEN"){
        super(message); // message stating the error and passed to super class (parent class)
        this.name = this.constructor.name; // gives a name to the class to be easily identified
        this.origin = origin; // specifies the origin
        this.statusCode = 403; // http error code for FORBIDDEN 
        Error.captureStackTrace(this, this.constructor); // gives a stacktrace of error
    }
}


// USE THIS CLASS AS AN INHERITED CLASS FOR ANY CUSTOM ERRORS
/**
 * @extends Error
 * @description Use this error as an inherited class
 */
class TradeChampErrors extends Error {
    constructor(message="AN ERROR", statusCode=500){
        super(message); // message stating the error and passed to super class (parent class)
        this.name = this.constructor.name; // gives a name to the class to be easily identified
        this.statusCode = 500; // http code for server error
        Error.captureStackTrace(this, this.constructor); // gives a stacktrace of error
    }
}

/**
 * @extends TradeChampErrors
 * @description Use this error when a user's password could not be compared by bcrypt correctly
 */
class AuthError extends TradeChampErrors {

    /**
     * @constructor
     * @param {String} message - Error message shown when error is thrown
     */
    constructor(message="AN ERROR OCCURRED COMPARING HASHES"){
        super(message);
    }
}

/**
 * @extends TradeChampErrors
 * @description Use this error when a user's plain password could not be hashed by bcrypt correctly
 */
class HashedPasswordError extends TradeChampErrors{
    constructor(message="PLAIN PASSWORD COULD NOT BE HASHED"){
        super(message);
    }
}

// this custom error should be used when the data type is missing or invaid
/**
 * @class InvalidDataType
 * @extends TradeChampErrors
 * @description Use this error when invalid data is detected
 */
class InvalidDataType extends TradeChampErrors {

    /**
     * @constructor
     * @param {String} message - Error message shown when error is thrown
     */
    constructor(message="DATA TYPE IS INVALID"){
        super(message);
    }
}

class UserError extends TradeChampErrors {
    constructor(message = "A user-related error occurred", statusCode = 400) {
        super(message, statusCode); // Call the TradeChampErrors constructor
        this.name = this.constructor.name; // Set the error name to the class name
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

// export the necessary module/s
module.exports = {
    BlacklistedOrigin ,
    UserError,
    InvalidDataType,
    AuthError,
    HashedPasswordError
};