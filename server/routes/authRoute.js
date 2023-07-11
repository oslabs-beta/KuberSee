const express = require('express');
const router = express.Router();

router.post('/signup', userController.signup, (req, res) => {
  res.status(200).json(res.locals.users);
});

module.exports = router;
