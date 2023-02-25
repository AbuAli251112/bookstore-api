const express = require("express");
const { updateUser, getAllUsers, getUserById, deleteUser } = require("../controllers/userController");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", verifyTokenAndAdmin, getAllUsers);

router.route("/:id").put(verifyTokenAndAuthorization, updateUser).get(verifyTokenAndAuthorization, getUserById).delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;