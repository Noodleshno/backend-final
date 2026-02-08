const User = require("../models/User");

exports.getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    if (username) req.user.username = username;
    if (email) req.user.email = email;

    const updatedUser = await req.user.save();

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
