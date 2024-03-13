const express = require("express");
const router = express.Router();

const userCtrl = require("../controller/userCtrl");

router.post("/signup", userCtrl.signUp)
router.post("/login", userCtrl.login)

module.exports = router;