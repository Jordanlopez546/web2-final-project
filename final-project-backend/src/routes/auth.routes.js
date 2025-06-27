const express = require('express');
const authController = require('../controllers/auth.controller');
const { loginAdmin, loginStudent, registerAdmin, registerStudent } = authController;

const router = express.Router();

router.post("/admin/login", loginAdmin)
router.post("/admin/register", registerAdmin)
router.post("/student/login", loginStudent)
router.post("/student/register", registerStudent)

module.exports = router;