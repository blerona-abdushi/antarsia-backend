const router = require("express").Router();
const { register, login, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout" , logout)


module.exports = router;
