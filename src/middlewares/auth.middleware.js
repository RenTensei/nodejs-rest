const jwt = require('jsonwebtoken');
const { handlerWrapper } = require('../helpers');
const { UserModel } = require('../models/User/User');

const authMiddleware = async (req, _, next) => {
  const authHeader = req.headers.authorization || '';

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) throw new jwt.JsonWebTokenError();

  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(id);
  if (!user || user.token !== token) throw new jwt.JsonWebTokenError();
  req.user = user;

  next();
};

module.exports = handlerWrapper(authMiddleware);
