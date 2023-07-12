const db = require("../model/userModels");
const userController = {};

userController.signin = async (req, res, next) => {
  console.log("signin");
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

userController.signup = async (req, res, next) => {};

module.exports = userController;
