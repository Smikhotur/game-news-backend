const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images/')
  },
  filename(req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, new Date() + '-' + ext)
  }
});

const types = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    console.log('true', file.mimetype);
    cb(null, true);
  } else {
    console.log('false', file.mimetype);
    cb(null, false);
  }
};


module.exports = multer(storage, fileFilter);
