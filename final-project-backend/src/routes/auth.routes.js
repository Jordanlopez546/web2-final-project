const express = require('express');
const { loginAdmin, loginStudent, registerAdmin, registerStudent } = require('../controllers/auth.controller');

const router = express.Router();

router.post("/admin/login", loginAdmin)
router.post("/admin/register", registerAdmin)
router.post("/student/login", loginStudent)
router.post("/student/register", registerStudent)

module.exports = router;