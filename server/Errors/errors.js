// errors.js

// custom error to handle CORS forbidden origins
class BlacklistedOrigin extends Error {
    constructor(origin, message ="ORIGIN IS FORBIDDEN"){
        super(message); // message stating the error and passed to super class (parent class)
        this.name = this.constructor.name; // gives a name to the class to be easily identified
        this.origin = origin; // specifies the origin
        this.statusCode = 403; // http error code for FORBIDDEN 
        Error.captureStackTrace(this, this.constructor); // gives a stacktrace of error
    }
}

// export the necessary module/s
module.exports = BlacklistedOrigin;