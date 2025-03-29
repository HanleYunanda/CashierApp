const { body } = require('express-validator')

const productValidator = [
    // Name
    body('name', 'Name is required').notEmpty(),
    body('name', 'Name must be between 3-100 chars').isLength({min:3, max:100}),

    // Price
    body('price', 'Price is required').notEmpty(),
    body('price', 'Price must be a positive number').isInt({ gt: 0 }),

    // Active
    body('active', 'Status value is invalid').isBoolean(),

    
];

module.exports = productValidator;