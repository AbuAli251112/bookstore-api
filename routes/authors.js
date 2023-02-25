const express = require("express");
const { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor} = require("../controllers/authorController"); 
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createAuthor);

router.route("/:id").get(getAuthorById).put(verifyTokenAndAdmin, updateAuthor).delete(verifyTokenAndAdmin, deleteAuthor);

module.exports = router;