const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const fs = require('fs/promises');

const { handlerWrapper, HttpError } = require('../helpers');
const { UserModel } = require('../models/User/User');
const { UserValidationSchema } = require('../models/User/user.schema');
const path = require('path');
const { constants } = require('../helpers');
const Jimp = require('jimp');

const register = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);
  const existingUserEmail = await UserModel.findOne({ email: validatedBody.email });
  if (existingUserEmail) throw new HttpError('409', 'Email already in use');

  const hashedPassword = await bcrypt.hash(validatedBody.password, 10);
  const avatarURL = gravatar.url(validatedBody.email);
  const newUser = await UserModel.create({
    email: validatedBody.email,
    password: hashedPassword,
    avatarURL,
  });

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

const updateAvatar = async (req, res) => {
  const { filename, path: tempPath } = req.file;

  const stablePath = path.join(constants.avatarStoragePath, filename);

  const image = await Jimp.read(tempPath);
  image.resize(250, 250).write(stablePath);
  await fs.unlink(tempPath);

  const avatarURL = path.join('avatars', filename);
  await UserModel.findByIdAndUpdate(req.user._id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: handlerWrapper(register),
  login: handlerWrapper(login),
  logout: handlerWrapper(logout),
  current: handlerWrapper(current),
  updateAvatar: handlerWrapper(updateAvatar),
};
