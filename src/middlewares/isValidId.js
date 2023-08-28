const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers');

const isValidId = (req, res, next) => {
  const contactId = req.params.contactId;
  isValidObjectId(contactId) ? next() : next(new HttpError(400, `${contactId} is not a valid id!`));
};

module.exports = { isValidId };
