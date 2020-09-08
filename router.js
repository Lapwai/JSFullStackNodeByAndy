const userController = require("./Controllers/userController");
const express = require("express");
//it returns many application
const router = express.Router();

router.get("/", userController.home);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
module.exports = router;
