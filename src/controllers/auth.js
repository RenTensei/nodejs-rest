const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { handlerWrapper, HttpError } = require('../helpers');
const { UserModel } = require('../models/User/User');
const { UserValidationSchema } = require('../models/User/user.schema');

const register = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);
  const existingUserEmail = await UserModel.findOne({ email: validatedBody.email });
  if (existingUserEmail) throw new HttpError('409', 'Email already in use');

  const hashedPassword = await bcrypt.hash(validatedBody.password, 10);
  const newUser = await UserModel.create({ email: validatedBody.email, password: hashedPassword });

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
};

const login = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);
  const existingUser = await UserModel.findOne({ email: validatedBody.email });
  if (!existingUser) throw new HttpError(401, 'Email or password is wrong');

  const passwordMatches = await bcrypt.compare(validatedBody.password, existingUser.password);

  if (!passwordMatches) throw new HttpError(401, 'Email or password is wrong');

  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  const userWithUpdatedToken = await UserModel.findByIdAndUpdate(
    existingUser._id,
    { token },
    { new: true }
  );

  res.json({
    token: userWithUpdatedToken.token,
    user: {
      email: userWithUpdatedToken.email,
      subscription: userWithUpdatedToken.subscription,
    },
  });
};

const logout = async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) throw new jwt.JsonWebTokenError();

  user.token = null;
  await user.save();
  res.status(204).send();
};

const current = async (req, res) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

module.exports = {
  register: handlerWrapper(register),
  login: handlerWrapper(login),
  logout: handlerWrapper(logout),
  current: handlerWrapper(current),
};
