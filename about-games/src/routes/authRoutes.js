const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { validate } = require("../middleware/validationMiddleware");
const { registerSchema } = require("../validation/authValidation");

router.post("/register", validate(registerSchema), register);
router.post("/login", login);

module.exports = router;
