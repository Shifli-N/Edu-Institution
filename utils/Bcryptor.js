const bcrypt = require('bcrypt');

async function CreateHash(password){
    const salt = bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    return hash;
}

async function CreateHashWithSalt(password, num){
    const salt = bcrypt.genSalt(num);
    const hash = bcrypt.hash(password,salt);
    return hash;
}


async function ComparePassword(password,hash){
    const result = bcrypt.compare(password,hash);
    return result;
}


module.exports = {
    CreateHash,
    ComparePassword,

    CreateHashWithSalt
}