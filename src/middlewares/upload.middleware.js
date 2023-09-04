const multer = require('multer');
const { constants } = require('../helpers');

const multerConfig = multer.diskStorage({
  destination: constants.tempStoragePath,
  filename: (req, file, cb) => {
    cb(null, req.user._id + '_avatar');
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
