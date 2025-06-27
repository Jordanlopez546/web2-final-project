const express = require('express');
const gradeController = require('../controllers/grade.controller');
const {
  getAllGrades,
  getGrade,
  createGrade,
  updateGrade,
  deleteGrade,
  getGradesByStudent,
  getMyGrades,
  getGradesByCourse,
  bulkCreateGrades
} = gradeController;

const { adminMiddleware, studentMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/my-grades', studentMiddleware, getMyGrades);

router.get('/student/:studentId', authorizeGradeAccess, getGradesByStudent);
router.get('/:id', authorizeGradeAccess, getGrade);

router.get('/', adminMiddleware, getAllGrades);
router.post('/', adminMiddleware, createGrade);
router.put('/:id', adminMiddleware, updateGrade);
router.delete('/:id', adminMiddleware, deleteGrade);
router.get('/course/:courseId', adminMiddleware, getGradesByCourse);
router.post('/bulk', adminMiddleware, bulkCreateGrades);

// Custom middleware to authorize grade access
// Admins can access all grades, students can only access their own
function authorizeGradeAccess(req, res, next) {
  // First check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { role, userId } = req.user;
  
  // Admin can access all grades
  if (role === 'admin') {
    return next();
  }
  
  // Student can only access their own grades
  if (role === 'student') {
    // For routes with studentId parameter, check if it matches the authenticated user
    if (req.params.studentId && req.params.studentId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own grades.'
      });
    }
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Insufficient permissions.'
  });
}

module.exports = router;