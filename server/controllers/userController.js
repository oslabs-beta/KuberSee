const db = require('../model/userModels');
const bcrypt = require('bcryptjs')
const userController = {};

userController.signup = async (req, res, next) => {
  console.log('singingup');
  try {
    const addUser = 'INSERT INTO "User" (username, password) VALUES ($1, $2)';
    const { username, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const values = [username, hashedPassword];
    console.log(values);

    // console.log(query);
    const resp = await db.query(addUser, values);
    console.log(resp);
    res.locals.users = resp.rows[0];
    return next();
  } catch (error) {
    console.log('error');
    console.log(error);
    return next({
      log: 'Error from userController.signup middleware',
      message: { err: 'Error from userController.signup middleware' },
    });
  }
};

userController.signin = async (req, res, next) => {
  console.log('signin');
  console.log(req.body.username);

  try {
    const user = [req.body.username];
    const query = `SELECT * FROM "User" where username=$1`;
    console.log(query);
    const resp = await db.query(query, user);
    console.log(resp);
    const url = '';
    if (resp.rows.length === 0) {
      console.log('no user found');
      url = 'http://localhost:8080/';
    } else {
    }
    // console.log(resp.rows);
  } catch (error) {}
  return next();
};

module.exports = userController;
