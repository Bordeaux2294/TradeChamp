// server.js

// get environment variables
require('dotenv').config();

const express = require('express'); // import express server
const app = express(); // initialize express server
const cors = require('cors'); // import CORS for origin security -> also mitigates the proxy technique used in REACT to allow API requests
const BlacklistedOrigin = require('./Errors/errors')
const RegisterRouter = require('./UserRoutes/Register_Route/register')


// creating the PORT number as a constant either from the env variables or a designated port being 7000
const PORT = process.env.PORT || 7000; 
const DEV_ALLOWED_ORIGIN = process.env.DEV_ALLOWED_ORIGIN !== ''; // checks if env variable for dev allowed origin is empty
const PROD_ALLOWED_ORIGIN = process.env.PROD_ALLOWED_ORIGIN !== ''; // checks if env variable for prod allowed origin is empty

// a list of allowed origins that can access the API -> incremental ports if REACT app is started on another port during development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
]

// adds dev allowed origin to the allowed origins list
if(DEV_ALLOWED_ORIGIN){

  allowedOrigins.push(process.env.DEV_ALLOWED_ORIGIN);

}

// adds prod allowed origin to the allowed origins list
if(PROD_ALLOWED_ORIGIN){

  allowedOrigins.push(process.env.PROD_ALLOWED_ORIGIN);
}

// MIDDLEWARES HERE ->

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/api', RegisterRouter);

// using cors to differentiate between origins to allow to send requests to API
app.use(cors({
  origin: function(origin, callback){

    if(!origin){ // allow requests without origins eg. mobile applications and curl 

      return callback(null, true);

    }
    if(allowedOrigins.includes(origin)){ // allow requests from allowed origins list

      return callback(null, true);

    }else{
      //TODO: new Error requires proper error  in the Error Folder
      return callback(new BlacklistedOrigin(origin)); // error if origin has not been taken into account

    }
  }
}));


// global error handler -> used mainly in development for error tracing. All routes should use the global error handler to trace and handle errors

app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
      status: 'error',
      message: error.message,
      origin: error.origin || null,
      stack: process.env.ENVIRONMENT === 'production' ? null : error.stack,
  });
  console.error(error.stack);
});




// END OF MIDDLEWARES

// TEST ROUTE -> REMOVE WHEN READY FOR DEVELOPMENT

// app.get('/api/test', (req,res) => {
//   res.status(200).send("RECEIVED!")
// });

// app.post('/api/test', (req,res) =>{
//   res.status(200).send("POST RECEIVED!")
// })


// express server listenning on port
app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
    
  });