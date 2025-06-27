const express = require('express');
const { authMiddleware, studentMiddleware, adminMiddleware } = require("../middleware/auth.middleware")

const authRoutes = require("./auth.routes");
const courseRoutes = require("./course.routes");
const ratingRoutes = require("./rating.routes");
const gradeRoutes = require("./grade.routes");
const studentRoutes = require("./student.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/auth", authRoutes)

router.use("/courses", authMiddleware, courseRoutes)

router.use("/course-ratings", authMiddleware, ratingRoutes)

router.use("/grades", authMiddleware, gradeRoutes)

router.use("/student", authMiddleware, studentRoutes)

router.use("/admin", authMiddleware, adminMiddleware, adminRoutes)

module.exports = router;