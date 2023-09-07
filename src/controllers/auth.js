const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const bcrypt = require('bcrypt');

const { constants } = require('../helpers');
const { handlerWrapper, HttpError } = require('../helpers');
const { mailService } = require('../services');
const { UserModel } = require('../models/User/User');
const { UserValidationSchema, EmailValidationSchema } = require('../models/User/user.schema');

const register = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);

  const existingUserEmail = await UserModel.findOne({ email: validatedBody.email });
  if (existingUserEmail) throw new HttpError('409', 'Email already in use');

  const hashedPassword = await bcrypt.hash(validatedBody.password, 10);
  const avatarURL = gravatar.url(validatedBody.email);
  const verificationToken = crypto.randomUUID();

  const newUser = await UserModel.create({
    email: validatedBody.email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  const response = await mailService.sendMail(validatedBody.email, verificationToken);
  console.log(response.accepted);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
    verificationToken,
  });
};

const login = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);

  const existingUser = await UserModel.findOne({ email: validatedBody.email, verify: true });
  if (!existingUser) throw new HttpError(401, 'Email or password is wrong / Accound not verified!');

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

const verify = async (req, res) => {
  const verificationToken = req.params.verificationToken;

  const user = await UserModel.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null }
  );
  if (!user) throw new HttpError(404, 'Not found');

  res.status(200).json({ message: 'Verification successful' });
};

const resend = async (req, res) => {
  const validatedBody = EmailValidationSchema.parse(req.body);
  const user = await UserModel.findOne({ email: validatedBody.email, verify: false });
  if (!user) throw new HttpError(400, 'Verification has already been passed');

  const verificationToken = crypto.randomUUID();
  user.verificationToken = verificationToken;
  await user.save();

  const response = await mailService.sendMail(user.email, verificationToken);
  console.log(response.accepted);

  res.json({ message: 'Verification email sent' });
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
  verify: handlerWrapper(verify),
  resend: handlerWrapper(resend),
  updateAvatar: handlerWrapper(updateAvatar),
};
