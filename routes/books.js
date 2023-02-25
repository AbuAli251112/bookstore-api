const express = require("express");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { getAllBooks, getBookById, createBook, updateBook, deleteBook } = require("../controllers/bookController");

const router = express.Router();

router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createBook);

router.route("/:id").get(getBookById).put(verifyTokenAndAdmin, updateBook).delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;