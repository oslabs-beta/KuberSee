const db = require('../model/userModels');
const userController = {};

userController.signup = async (req, res, next) => {
  console.log('singingup');
  try {
    const addUser = 'INSERT INTO "User" (username, password) VALUES ($1, $2)';
    const { username, password } = req.body;
    const values = [username, password];
    console.log(values);

    // console.log(query);
    const resp = await db.query(addUser, values);
    console.log(res, nextp);
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
  console.log(req.body.password);

  try {
    const user = [req.body.username];
    const query = `SELECT * FROM "User" where username=$1`;
    // console.log(query);
    const resp = await db.query(query, user);
    console.log(resp.rows);
    if (resp.rows.length === 0) {
      console.log("no user found");
      throw new Error("wrong user");
    }
    if (resp.rows[0].password === req.body.password) {
      console.log("found users");
    }
    res.locals.users = resp.rows[0];
    return next();
    // console.log(resp.rows);
  } catch (error) {
    return next(error);
  }
};

userController.signup = async (req, res, next) => {
  //   console.log("singingup");
  //   try {
  //     const query = `SELECT * FROM "User" WHERE id=1`;
  //     // console.log(query);
  //     const resp = await db.query(query);
  //     console.log("rows", resp.rows);
  //     res.locals.users = resp.rows;
  //     return next();
userController.signup = async (req, res, next) => {};

module.exports = userController;
