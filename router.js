const userController = require("./Controllers/userController");
const express = require("express");
//it returns many application
const router = express.Router();

router.get("/", userController.home);
router.post("/register", userController.register);

module.exports = router;
