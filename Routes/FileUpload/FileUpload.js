const express = require('express')
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname.substr(file.originalname.indexOf('.')) )
  }
})

const upload = multer({ storage: storage });

const app = express()

app.post('/', upload.single('files'), function (req, res, next) {
	try {
	res.status(200).json({status: 200, Upload: "success", path: req.file.path});
	}
	catch {
	res.status(400).json({
	status: 400,
	upload: "failed"
	});
	}
})
module.exports = app;
