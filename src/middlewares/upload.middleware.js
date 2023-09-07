const multer = require('multer');
const { constants } = require('../helpers');

const multerConfig = multer.diskStorage({
  destination: constants.tempStoragePath,
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${req.user._id}_avatar.${fileExtension}`);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
