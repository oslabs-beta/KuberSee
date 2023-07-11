const apiController = {};

userController.signup = async (req, res, next) => {
  console.log('singingup');
  try {
    const addUser = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const { username, password } = req.body;
    const values = [username, password];

    // console.log(query);
    const resp = await db.query(addUser, values);
    console.log('rows', resp.rows);
    res.locals.users = resp.rows[0];
    return next();
  } catch (error) {
    return next({
      log: 'Error from userController.signup middleware',
      message: { err: 'Error from userController.signup middleware' },
    });
  }
  return next();
};

module.exports = apiController;
