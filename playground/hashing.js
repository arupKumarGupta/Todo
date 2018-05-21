const {
    SHA256
} = require('crypto-js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
/* var data = {
    id: 5
}
let token = jwt.sign(data, '124ab');
console.log(token);
let decoded = jwt.verify(token, '124abd');
console.log(decoded); */
let password = 'abc123!';
bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (error, hash) => {
        console.log(hash);
    })
});

let hashed = '$2a$10$2yiaf7VGp1RofeWcxJsj1uJJm7ut38soIgGPKPoh06iibYWhdV2nS';
let hashed2 = '$2a$10$Benupf1Wv0h0v9V1yan81.BSbyT/H0xBLvBBVIA9fygEZBpZ0S8a6';

bcrypt.compare(password, hashed, (err, res) => {
    console.log(res);
});
bcrypt.compare(password, hashed2, (err, res) => {
    console.log(res);
});