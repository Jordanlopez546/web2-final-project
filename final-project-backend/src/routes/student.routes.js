const express = require('express');
const studentController = require('../controllers/student.controller');
const { studentMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const {
  getProfile,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentCourses,
  enrollInCourse,
  unenrollFromCourse,
} = studentController;

const router = express.Router();

router.get('/profile', studentMiddleware, getProfile);
router.get('/', adminMiddleware, getAllStudents); 
router.get('/:id', adminMiddleware, getStudent);
router.put('/', studentMiddleware, updateStudent);
router.delete('/', studentMiddleware, deleteStudent);

router.get('/me/courses', studentMiddleware, getStudentCourses);
router.post('/enroll', studentMiddleware, enrollInCourse);
router.delete('/unenroll', studentMiddleware, unenrollFromCourse);

module.exports = router;