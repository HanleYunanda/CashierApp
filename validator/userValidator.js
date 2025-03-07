const { body } = require('express-validator')

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

const userValidator = [
    // Name
    body('name', 'Name is required').notEmpty(),
    body('name', 'Name must be between 3-100 chars').isLength({min:3, max:100}),
    
    // Email
    body('email', 'Email is required').notEmpty(),
    body('email', 'Email format is invalid').isEmail(),
    
    // Password
    body('password', 'Password is required').notEmpty(),
    body('password', 'Password must contains lower case & upper case letter, number, and symbol').matches(passwordRegex),
    
    // Gender
    body('gender', 'Gender value is invalid').isBoolean(),
    
    // Active
    body('active', 'Active status value is invalid').isBoolean(),

]

module.exports = userValidator