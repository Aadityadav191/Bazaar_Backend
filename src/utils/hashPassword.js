const bcrypt = require("bcrypt");

//bcrypt.hash()==> to hash the password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};


//bcrypt.compare()==> to compare the password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};





// Main functions used in the project:
//1. bcrypt.hash()
//2. bcrypt.compare()
//3. jwt.sign()
//4. jwt.verify()