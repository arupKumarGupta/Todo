const {
    SHA256
} = require('crypto-js');

const jwt = require('jsonwebtoken');
var data = {
    id: 5
}
let token = jwt.sign(data, '124ab');
console.log(token);
let decoded = jwt.verify(token, '124abd');
console.log(decoded);