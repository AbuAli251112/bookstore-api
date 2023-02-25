const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, path.join(__dirname, "../images"));
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
	}
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
	res.status(200).json({ message: "Image Uploaded" });
})

module.exports = router;