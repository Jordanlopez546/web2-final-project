const express = require('express');
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.controller');
const { adminMiddleware } = require("../middleware/auth.middleware")

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.post('/', adminMiddleware, createCourse);
router.put('/:id', adminMiddleware, updateCourse);
router.delete('/:id', adminMiddleware, deleteCourse);

module.exports = router;