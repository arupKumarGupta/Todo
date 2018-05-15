const mongoose = require('mongoose');
const validator = require('validator');

/* u = {
    email: 'x@g.com',
    password: "hashed",
    tokens: [{
        access:'auth',
        token: 'hashed',
    }]
} */
var User = mongoose.model('Users', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,

    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = {
    User
};