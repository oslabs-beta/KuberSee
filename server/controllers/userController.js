const db = require("../model/userModels");
const userController = {};

userController.signin = async (req, res) => {
  console.log("signin");
  console.log(req.body.username);

  try {
    const user = [req.body.username];
    const query = `SELECT * FROM "User" where username=$1`;
    console.log(query);
    const resp = await db.query(query, user);
    console.log(resp);
    const url = "";
    if (resp.rows.length === 0) {
      console.log("no user found");
      url = "http://localhost:8080/";
    } else {
    }
    // console.log(resp.rows);
  } catch (error) {}
  return next();
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
  //   } catch (error) {
  //     error = {
  //       err: "couldnt sign up",
  //     };
  //   }
  //   return next();
};

module.exports = userController;
