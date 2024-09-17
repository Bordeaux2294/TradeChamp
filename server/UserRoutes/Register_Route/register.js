// register.js

const express = require('express')
const router = express.Router()
const User = require('../../User');
const Authenticate = require('../../Authenticate')
const {InvalidDataType} = require('../../Errors/errors')

router.post('/register', async (request, response, next) => {
    
    try {
        const userData = request.body;

        if(userData.hasOwnProperty('username') && userData.hasOwnProperty('email') && userData.hasOwnProperty('userPassword')){
            const newUser = await User.create(userData);
            if(newUser){
                return response.status(200).send({message:true});
            }
        }else{
            throw new InvalidDataType();
        }

    } catch (error) {
        next(error);
    }

});

router.post('/login', async(request, response, next) => {
    try {
        
        const userData = request.body
    
        if(userData.hasOwnPoroperty('username') && userData.hasOwnProperty('userPassword')){
            const fetchedUser = User.fetchByID(2);
            const authenticate = await Authenticate.authorize(fetchedUser.userPassword, userData.userPassword)
            if(authenticate){
                return response.status(200).send({message:true});
            }else{
                return response.status(200).send({message:false});
            }
        }else{
            throw new InvalidDataType();
        }
    } catch (error) {
        next(error);
    }
});

// export router
module.exports = router;